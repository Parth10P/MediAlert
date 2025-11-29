import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
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

export default function DailyScheduleScreen() {
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
      // If the last taken date is not today, reset taken to false
      if (med.lastTakenDate !== today) {
        return { ...med, taken: false };
      }
      return med;
    });

    setMedicines(updatedMeds);
    
    // If we reset any medicines, update storage
    if (JSON.stringify(meds) !== JSON.stringify(updatedMeds)) {
      await updateMedicineStatus(updatedMeds);
    }
  };

  const toggleTaken = async (id) => {
    const updatedMedicines = medicines.map(med => {
      if (med.id === id) {
        const isTaking = !med.taken;
        let newStock = med.stock;

        if (med.stock !== null && med.stock !== undefined) {
          if (isTaking) {
            newStock = med.stock > 0 ? med.stock - 1 : 0;
            if (newStock <= 5) {
              alert(`Low stock for ${med.name}: ${newStock} left!`);
            }
          } else {
            newStock = med.stock + 1;
          }
        }

        return { 
          ...med, 
          taken: isTaking, 
          stock: newStock,
          lastTakenDate: isTaking ? new Date().toDateString() : med.lastTakenDate
        };
      }
      return med;
    });

    setMedicines(updatedMedicines);

    // Save to storage
    await updateMedicineStatus(updatedMedicines);

    // Update history
    const today = new Date().toISOString().split('T')[0];
    const taken = updatedMedicines.filter(m => m.taken).length;
    const skipped = updatedMedicines.filter(m => !m.taken).length;
    await saveHistory(today, taken, skipped);
  };

  const simulateNextDay = async () => {
    const meds = await getMedicines();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const agedMeds = meds.map(med => ({
      ...med,
      lastTakenDate: yesterday.toDateString()
    }));
    
    await updateMedicineStatus(agedMeds);
    await loadMedicines(); // Reload to trigger the reset logic immediately
    alert('Simulated passing of a day! The list has been refreshed.');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text style={styles.header}>Today's Schedule</Text>
        <TouchableOpacity onPress={simulateNextDay} style={{ padding: 5 }}>
          <Text style={{ color: 'blue', fontSize: 12 }}>Simulate Tomorrow</Text>
        </TouchableOpacity>
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

          <TouchableOpacity
            onPress={() => toggleTaken(med.id)}
            style={[
              styles.statusBtn,
              med.taken ? styles.taken : styles.notTaken,
            ]}
          >
            <Text style={styles.statusText}>
              {med.taken ? 'Taken' : 'Take'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderLeftWidth: 6,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fafafa',
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

  statusBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 50,
    alignSelf: 'center',
  },
  taken: { backgroundColor: '#6BCB77' },
  notTaken: { backgroundColor: '#FF6B6B' },
  statusText: { color: '#fff', fontWeight: 'bold' },

  emptyBox: { alignItems: 'center', marginTop: 80 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#555' },
  emptySub: { fontSize: 14, marginTop: 8, color: 'gray' },
});