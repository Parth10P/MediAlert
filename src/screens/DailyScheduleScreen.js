import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicines } from '../storage/storageUtils';
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
    setMedicines(meds);
  };

  const toggleTaken = (id) => {
    setMedicines(prev =>
      prev.map(med =>
        med.id === id ? { ...med, taken: !med.taken } : med
      )
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Today's Schedule</Text>

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
            <View>
              <Text style={styles.medName}>{med.name}</Text>
              <Text style={styles.medDetails}>{med.dosage} • {med.time}</Text>
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
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
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
