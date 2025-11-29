import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import medicinesData from '../../db/medicines.json';
import MedicineDetailsModal from '../components/MedicineDetailsModal';

const MedicinesDirectoryScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    // Simulate initial load or just set data
    setFilteredMedicines(medicinesData);
    setLoading(false);
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const textData = text.toUpperCase();
      
      const newData = medicinesData.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        return itemData.indexOf(textData) > -1;
      }).sort((a, b) => {
        const nameA = a.name.toUpperCase();
        const nameB = b.name.toUpperCase();
        
        // Priority 1: Exact match
        if (nameA === textData && nameB !== textData) return -1;
        if (nameB === textData && nameA !== textData) return 1;
        
        // Priority 2: Starts with
        const aStartsWith = nameA.startsWith(textData);
        const bStartsWith = nameB.startsWith(textData);
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // Priority 3: Alphabetical
        return nameA.localeCompare(nameB);
      });
      
      setFilteredMedicines(newData);
    } else {
      setFilteredMedicines(medicinesData);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => {
        setSelectedMedicine(item);
        setModalVisible(true);
      }}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="medkit-outline" size={24} color="#4D96FF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.medicineName}>{item.name}</Text>
        <Text style={styles.medicineCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medicines Directory</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search medicines..."
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4D96FF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredMedicines}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      )}
      <MedicineDetailsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        medicine={selectedMedicine}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e6f0ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  medicineCategory: {
    fontSize: 13,
    color: '#888',
  },
});

export default MedicinesDirectoryScreen;
