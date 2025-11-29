import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const medicines = [
    {
      id: 1,
      name: "Aspirin",
      dose: "1 tablet - Daily",
      for: "Mom",
      iconBg: "#e0f7f4",
      iconColor: "#0aa78f",
    },
    {
      id: 2,
      name: "Paracetamol",
      dose: "1 tablet - Daily",
      for: "Dad",
      iconBg: "#ffece7",
      iconColor: "#ff5722",
    },
  ];

  const renderMed = ({ item }) => (
    <View style={styles.medCard}>
      <View style={[styles.medIcon, { backgroundColor: item.iconBg }]}>
        <Ionicons name="medkit-outline" size={22} color={item.iconColor} />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.medName}>{item.name}</Text>
        <Text style={styles.medDose}>{item.dose}</Text>
        <Text style={styles.medFor}>For: {item.for}</Text>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#777" />
    </View>
  );

  return (
    <View style={styles.container}>

      <Text style={styles.appTitle}>MediAlert</Text>

      
      <Text style={styles.title}>Good Evening</Text>
      <Text style={styles.subtitle}>Here is your daily summary</Text>


      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Today's Progress</Text>
        <Text style={styles.progressSubtitle}>0 of 2 doses taken</Text>
      </View>

    
      <View style={styles.medicineHeader}>
        <Text style={styles.sectionTitle}>Your Medicines</Text>

        <TouchableOpacity onPress={() => navigation.navigate("AddMedicine")}>
          <Text style={styles.addBtn}>+ Add</Text>
        </TouchableOpacity>
      </View>

     
      <FlatList
        data={medicines}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMed}
        contentContainerStyle={{ paddingBottom: 60 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 18,
    paddingTop: 10, 
  },

  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 15,
    color: "#555",
    marginBottom: 20,
  },

  progressCard: {
    backgroundColor: "#2d74f0",
    padding: 20,
    borderRadius: 16,
    marginBottom: 26,
  },
  progressTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  progressSubtitle: {
    color: "#dbe6ff",
    marginTop: 6,
    fontSize: 14,
  },

  medicineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  addBtn: {
    fontSize: 16,
    color: "#2d74f0",
    fontWeight: "600",
  },

  medCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  medIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  medName: {
    fontSize: 17,
    fontWeight: "700",
  },
  medDose: {
    fontSize: 14,
    color: "#555",
  },
  medFor: {
    fontSize: 13,
    color: "#888",
  },
});
