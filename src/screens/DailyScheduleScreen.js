import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicines, updateMedicineStatus, saveHistory, fillMissingHistory } from '../storage/storageUtils';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
const iconMap = {
  1: <Ionicons name="medkit" size={22} />,
  2: <MaterialCommunityIcons name="pill" size={22} />,
  3: <MaterialCommunityIcons name="flask-outline" size={22} />,
  4: <FontAwesome5 name="apple-alt" size={22} />,
  5: <Ionicons name="thermometer-outline" size={22} />,
  6: <Ionicons name="heart" size={22} />,
};
export default function DailyScheduleScreen({ navigation }) {
  const [medicines, setMedicines] = useState([]);
  useFocusEffect(
    useCallback(() => {
      loadMedicines();
    }, [])
  );
  const loadMedicines = async () => {
    const meds = await getMedicines();
    const today = new Date().toDateString();
    const updatedMeds = meds.map(med => {
      // Migration: Ensure status field exists
      let status = med.status;
      if (!status) {
        status = med.taken ? 'taken' : 'pending';
      }
      if (med.lastTakenDate !== today) {
        // Reset for new day
        return { ...med, status: 'pending', taken: false };
      }
      return { ...med, status };
    });
    setMedicines(updatedMeds);
    if (JSON.stringify(meds) !== JSON.stringify(updatedMeds)) {
      await updateMedicineStatus(updatedMeds);
    }
    await fillMissingHistory(updatedMeds.length);
  };
  const updateStatus = async (id, newStatus) => {
    const updatedMedicines = medicines.map(med => {
      if (med.id === id) {
        let newStock = med.stock;
        // Handle stock logic
        if (med.stock !== null && med.stock !== undefined) {
          // If marking as taken
          if (newStatus === 'taken' && med.status !== 'taken') {
            newStock = med.stock > 0 ? med.stock - 1 : 0;
            if (newStock <= 5) {
              alert(`Low stock for ${med.name}: ${newStock} left!`);
            }
          }
          // If un-taking (going back to pending or skipped)
          else if (med.status === 'taken' && newStatus !== 'taken') {
            newStock = med.stock + 1;
          }
        }
        return {
          ...med,
          status: newStatus,
          taken: newStatus === 'taken', // Maintain legacy compatibility if needed, or deprecate
          stock: newStock,
          lastTakenDate: (newStatus === 'taken' || newStatus === 'skipped') ? new Date().toDateString() : med.lastTakenDate
        };
      }
      return med;
    });
    setMedicines(updatedMedicines);
    await updateMedicineStatus(updatedMedicines);
    const today = new Date().toISOString().split('T')[0];
    const taken = updatedMedicines.filter(m => m.status === 'taken').length;
    const skipped = updatedMedicines.filter(m => m.status === 'skipped').length;
    const details = updatedMedicines.map(m => ({
      id: m.id,
      name: m.name,
      time: m.time,
      status: m.status,
      color: m.color
    }));
    await saveHistory(today, taken, skipped, details);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Today's Schedule</Text>
        </View>
        {medicines.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No medicines added yet.</Text>
            <Text style={styles.emptySub}>Tap + on Home to add medicines</Text>
          </View>
        )}
        {medicines.map(med => (
          <View key={med.id} style={[styles.card, { borderLeftColor: med.color }]}>
            <View style={styles.cardLeft}>
              <View style={[styles.iconHolder, { backgroundColor: med.color + '33' }]}>
                {iconMap[med.icon]}
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.medName}>{med.name}</Text>
                <Text style={styles.medDetails}>{med.dosage} • {med.time}</Text>
                {med.stock !== null && (
                  <Text style={[styles.stockText, med.stock <= 5 && styles.lowStock]}>
                    Stock: {med.stock}
                  </Text>
                )}
                {med.familyMember ? (
                  <Text style={styles.memberTag}>For {med.familyMember}</Text>
                ) : null}
              </View>
            </View>
            <View style={styles.actionButtons}>
              {med.status === 'taken' ? (
                <TouchableOpacity onPress={() => updateStatus(med.id, 'pending')} style={[styles.statusBtn, styles.takenBtn]}>
                  <Text style={styles.statusText}>Taken</Text>
                </TouchableOpacity>
              ) : med.status === 'skipped' ? (
                <TouchableOpacity onPress={() => updateStatus(med.id, 'pending')} style={[styles.statusBtn, styles.skippedBtn]}>
                  <Text style={styles.statusText}>Skipped</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity onPress={() => updateStatus(med.id, 'taken')} style={[styles.statusBtn, styles.takeBtn]}>
                    <Text style={styles.statusText}>Take</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateStatus(med.id, 'skipped')} style={[styles.statusBtn, styles.skipBtn]}>
                    <Text style={styles.statusText}>Skip</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  container: {
    flex: 1,
    padding: 15,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  missedText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#FF6B6B',
    fontWeight: '600',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    borderLeftWidth: 5,
    marginBottom: 12,
    elevation: 2,
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
  stockText: { fontSize: 12, color: '#666', marginTop: 2 },
  lowStock: { color: '#FF6B6B', fontWeight: 'bold' },
  memberTag: { fontSize: 13, marginTop: 3, color: '#555' },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  takeBtn: { backgroundColor: '#4D96FF' },
  takenBtn: { backgroundColor: '#6BCB77' },
  skipBtn: { backgroundColor: '#FFB74D' },
  skippedBtn: { backgroundColor: '#9E9E9E' },
  statusText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  emptyBox: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#555' },
  emptySub: { fontSize: 14, marginTop: 8, color: 'gray' },
});
