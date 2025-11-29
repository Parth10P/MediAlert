import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicines, updateMedicineStatus, saveHistory } from '../storage/storageUtils';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const iconMap = {
    1: <Ionicons name="medkit" size={22} />,
    2: <MaterialCommunityIcons name="pill" size={22} />,
    3: <MaterialCommunityIcons name="flask-outline" size={22} />,
    4: <FontAwesome5 name="apple-alt" size={22} />,
    5: <Ionicons name="thermometer-outline" size={22} />,
    6: <Ionicons name="heart" size={22} />,
};

export default function MissedDosesScreen({ navigation }) {
    const [missedMedicines, setMissedMedicines] = useState([]);

    useFocusEffect(
        useCallback(() => {
            loadMissedMedicines();
        }, [])
    );

    const loadMissedMedicines = async () => {
        const meds = await getMedicines();
        const now = new Date();
        const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Helper to compare times "HH:MM AM/PM"
        const isTimePast = (medTime) => {
            // Simple string comparison works for same format if 24h, but here we have AM/PM potentially or just locale dependent.
            // Let's assume the format stored is consistent.
            // To be safe, let's parse them.
            // Actually, the stored format in AddMedicineScreen is: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            // This depends on device locale.
            // For the purpose of this task, let's assume we can compare them if we parse them to dates on the same day.

            const [time, modifier] = medTime.split(' ');
            let [hours, minutes] = time.split(':');

            if (hours === '12') {
                hours = '00';
            }

            if (modifier === 'PM') {
                hours = parseInt(hours, 10) + 12;
            }

            const medDate = new Date();
            medDate.setHours(hours, minutes, 0, 0);

            return medDate < now;
        };

        // However, the stored time format might vary. 
        // Let's try to be robust. If the stored time is just a string, we might need a better comparison.
        // Given the previous code: time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        // It likely produces "10:30 AM" or "14:30".
        // Let's rely on a simpler check: if the current time is greater than the med time.
        // But string comparison "09:00 PM" > "10:00 AM" is false.
        // So we DO need to parse.

        // Let's use a robust parser or just assume the standard JS Date parsing works on "DateString TimeString".
        const todayStr = now.toDateString();

        const missed = meds.filter(med => {
            if (med.taken) return false;

            // Construct a date object for the medicine time today
            const medTimeStr = `${todayStr} ${med.time}`;
            const medDate = new Date(medTimeStr);

            // If invalid date (parsing failed), fallback or ignore
            if (isNaN(medDate.getTime())) return false;

            return medDate < now;
        });

        setMissedMedicines(missed);
    };

    const markAsTaken = async (id) => {
        const allMeds = await getMedicines();
        const updatedMeds = allMeds.map(med => {
            if (med.id === id) {
                let newStock = med.stock;
                if (med.stock !== null && med.stock !== undefined) {
                    newStock = med.stock > 0 ? med.stock - 1 : 0;
                }

                return {
                    ...med,
                    taken: true,
                    stock: newStock,
                    lastTakenDate: new Date().toDateString()
                };
            }
            return med;
        });

        await updateMedicineStatus(updatedMeds);

        // Update history
        const today = new Date().toISOString().split('T')[0];
        const takenCount = updatedMeds.filter(m => m.taken).length;
        const skippedCount = updatedMeds.filter(m => !m.taken).length;
        await saveHistory(today, takenCount, skippedCount);

        Alert.alert('Success', 'Medicine marked as taken!');
        loadMissedMedicines();
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
                        <Ionicons name="arrow-back" size={24} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.header}>Missed Doses</Text>
                </View>
                <Text style={styles.subHeader}>Medicines scheduled for earlier today that you haven't taken yet.</Text>

                {missedMedicines.length === 0 && (
                    <View style={styles.emptyBox}>
                        <Ionicons name="checkmark-circle-outline" size={64} color="#6BCB77" />
                        <Text style={styles.emptyText}>No missed doses!</Text>
                        <Text style={styles.emptySub}>You are all caught up.</Text>
                    </View>
                )}

                {missedMedicines.map(med => (
                    <View key={med.id} style={[styles.card, { borderLeftColor: med.color }]}>
                        <View style={styles.cardLeft}>
                            <View style={[styles.iconHolder, { backgroundColor: med.color + '33' }]}>
                                {iconMap[med.icon]}
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.medName}>{med.name}</Text>
                                <Text style={styles.medDetails}>{med.dosage} • {med.time}</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => markAsTaken(med.id)}
                            style={styles.takeBtn}
                        >
                            <Text style={styles.takeText}>Take Now</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    scrollContent: { padding: 15 },
    header: { fontSize: 24, fontWeight: 'bold' },
    subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderLeftWidth: 6,
        padding: 12,
        borderRadius: 10,
        backgroundColor: '#fafafa',
        marginBottom: 12,
        elevation: 2,
        alignItems: 'center'
    },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    textContainer: { flex: 1 },
    iconHolder: {
        width: 45,
        height: 45,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    medName: { fontSize: 16, fontWeight: '600' },
    medDetails: { fontSize: 14, color: 'gray', marginTop: 2 },
    takeBtn: {
        backgroundColor: '#4D96FF',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    takeText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
    emptyBox: { alignItems: 'center', marginTop: 60 },
    emptyText: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 10 },
    emptySub: { fontSize: 14, color: 'gray', marginTop: 5 },
});
