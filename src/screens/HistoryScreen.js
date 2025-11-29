import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getHistory } from '../storage/storageUtils';

const HistoryScreen = () => {
    const [history, setHistory] = useState({});

    useFocusEffect(
        useCallback(() => {
            loadHistory();
        }, [])
    );

    const loadHistory = async () => {
        const data = await getHistory();
        setHistory(data);
    };

    const sortedDates = Object.keys(history).sort().reverse();

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>History</Text>

            {sortedDates.length === 0 && (
                <View style={styles.emptyBox}>
                    <Text style={styles.emptyText}>No history yet</Text>
                </View>
            )}

            {sortedDates.map(date => (
                <View key={date} style={styles.card}>
                    <Text style={styles.date}>{date}</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.takenNumber}>{history[date].taken}</Text>
                            <Text style={styles.takenLabel}>Taken</Text>
                        </View>
                        <View style={styles.stat}>
                            <Text style={styles.skippedNumber}>{history[date].skipped}</Text>
                            <Text style={styles.skippedLabel}>Skipped</Text>
                        </View>
                    </View>

                    {history[date].details && history[date].details.length > 0 && (
                        <View style={styles.detailsContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.detailsHeader}>Daily Log</Text>
                            {history[date].details.map((item, index) => (
                                <View key={index} style={styles.detailItem}>
                                    <View style={[styles.statusDot, { backgroundColor: item.status === 'taken' ? '#4CAF50' : item.status === 'skipped' ? '#F44336' : '#9E9E9E' }]} />
                                    <View style={styles.detailInfo}>
                                        <Text style={styles.detailName}>{item.name}</Text>
                                    </View>
                                    <Text style={[styles.detailStatus, { color: item.status === 'taken' ? '#4CAF50' : item.status === 'skipped' ? '#F44336' : '#9E9E9E' }]}>
                                        {item.status === 'taken' ? 'Taken' : item.status === 'skipped' ? 'Skipped' : 'Pending'}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 15,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    date: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    takenNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    takenLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    skippedNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F44336',
    },
    skippedLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
    detailsContainer: {
        marginTop: 15,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 10,
    },
    detailsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        paddingVertical: 5,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    detailInfo: {
        flex: 1,
    },
    detailName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
    },
    detailStatus: {
        fontSize: 13,
        fontWeight: '600',
    },
});

export default HistoryScreen;