import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MedicineDetailsModal = ({ visible, onClose, medicine }) => {
  if (!medicine) return null;

  const getTagColor = (str) => {
    const colors = [
      '#FF6B6B', '#4D96FF', '#6BCB77', '#FFD93D', '#845EC2', '#FF9671',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const categories = medicine.category ? medicine.category.split('/') : [];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Medicine Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            <View style={styles.headerRow}>
              <Text style={styles.medicineName}>{medicine.name}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <View style={styles.tagsContainer}>
                {categories.map((cat, index) => {
                  const tagColor = getTagColor(cat.trim());
                  return (
                    <View
                      key={index}
                      style={[styles.tag, { backgroundColor: tagColor + '20', borderColor: tagColor }]}
                    >
                      <Text style={[styles.tagText, { color: tagColor }]}>
                        {cat.trim()}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {medicine.description && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Description</Text>
                <Text style={styles.detailValue}>{medicine.description}</Text>
              </View>
            )}

            {medicine.sideEffects && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Side Effects</Text>
                <Text style={styles.detailValue}>{medicine.sideEffects}</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalBody: {
    marginBottom: 20,
  },
  headerRow: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 15,
  },
  medicineName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 32,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#4D96FF',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicineDetailsModal;
