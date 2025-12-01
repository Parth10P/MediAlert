import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { getMedicines } from '../storage/storageUtils';

export default function HomeScreen({ navigation }) {
  const [stats, setStats] = useState({ total: 0, taken: 0, pending: 0 });
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    const meds = await getMedicines();
    const today = new Date().toDateString();
    
    let totalDoses = meds.length;
    let takenDosesCount = 0;

    meds.forEach(med => {
      // Check if taken today based on status and date
      // If lastTakenDate is not today, it's effectively pending (reset state)
      if (med.status === 'taken' && med.lastTakenDate === today) {
        takenDosesCount++;
      }
    });

    setStats({
      total: totalDoses,
      taken: takenDosesCount,
      pending: totalDoses - takenDosesCount
    });
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const QuickAction = ({ title, icon, color, route }) => (
    <TouchableOpacity 
      style={[styles.actionCard, { backgroundColor: color + '15' }]} 
      onPress={() => navigation.navigate(route)}
    >
      <View style={[styles.iconCircle, { backgroundColor: color }]}>
        {icon}
      </View>
      <Text style={styles.actionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()},</Text>
            <Text style={styles.date}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <View style={styles.profileIcon}>
                <Ionicons name="person" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar} 
          onPress={() => navigation.navigate('MedicinesDirectory')}
        >
          <Ionicons name="search" size={22} color="#4D96FF" style={{ marginRight: 12 }} />
          <Text style={styles.searchText}>Search medicines...</Text>
        </TouchableOpacity>

        {/* Status Card */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => navigation.navigate('DailySchedule')}
        >
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Text style={styles.statusTitle}>Today's Progress</Text>
              <Text style={styles.statusPercent}>
                {stats.total > 0 ? Math.round((stats.taken / stats.total) * 100) : 0}%
              </Text>
            </View>
            
            <View style={styles.progressBarBg}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${stats.total > 0 ? (stats.taken / stats.total) * 100 : 0}%` }
                ]} 
              />
            </View>
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.pending}</Text>
                <Text style={styles.statLabel}>Remaining</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.taken}</Text>
                <Text style={styles.statLabel}>Taken</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stats.total}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <QuickAction 
            title="Add Medicine" 
            icon={<Ionicons name="add-circle" size={24} color="#fff" />} 
            color="#4D96FF" 
            route="AddMedicine" 
          />
          <QuickAction 
            title="History" 
            icon={<MaterialCommunityIcons name="history" size={24} color="#fff" />} 
            color="#6BCB77" 
            route="History" 
          />
          <QuickAction 
            title="Directory" 
            icon={<Ionicons name="search" size={24} color="#fff" />} 
            color="#FFB74D" 
            route="MedicinesDirectory" 
          />
        </View>

      </ScrollView>

      {/* FAB */}
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
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4D96FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  searchText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
  
  statusCard: {
    backgroundColor: '#4D96FF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#4D96FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  statusPercent: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    marginBottom: 20,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  actionCard: {
    width: '30%',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4D96FF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});
