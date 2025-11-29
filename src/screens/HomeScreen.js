import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>


      <Text style={styles.title}>MediAlert</Text>

  
      <Text style={styles.text}>Welcome to MediAlert</Text>

   
      <TouchableOpacity
        style={styles.directoryButton}
        onPress={() => navigation.navigate('MedicinesDirectory')}
      >
        <Ionicons name="search" size={24} color="#fff" style={{ marginRight: 10 }} />
        <Text style={styles.directoryButtonText}>Medicines Directory</Text>
      </TouchableOpacity>


      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddMedicine')}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,           
    paddingHorizontal: 20,  
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,         
  },

  text: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',      
  },

  directoryButton: {
    flexDirection: 'row',
    backgroundColor: '#4D96FF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',     
    marginBottom: 20,


    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  directoryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#0d6efd',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
