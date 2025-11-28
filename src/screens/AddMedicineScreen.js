import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveMedicine } from '../storage/storageUtils';

const icons = [
  { id: 1, icon: <Ionicons name="medkit" size={22} /> },
  { id: 2, icon: <MaterialCommunityIcons name="pill" size={22} /> },
  { id: 3, icon: <MaterialCommunityIcons name="flask-outline" size={22} /> },
  { id: 4, icon: <FontAwesome5 name="apple-alt" size={22} /> },
  { id: 5, icon: <Ionicons name="thermometer-outline" size={22} /> },
  { id: 6, icon: <Ionicons name="heart" size={22} /> },
];

const colors = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFA987', '#F7D060', '#D9C6FF'];

const AddMedicineScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [familyMember, setFamilyMember] = useState('');
  const [stock, setStock] = useState('');
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(icons[0].id);
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  const onTimeChange = (event, selected) => {
    setShowPicker(false);
    if (selected) setTime(selected);
  };

  const handleSave = async () => {
    if (!name.trim() || !dosage.trim()) {
      Alert.alert('Missing Fields', 'Please enter medicine name and dosage.');
      return;
    }

    const newMedicine = {
      id: Date.now(),
      name,
      dosage,
      familyMember,
      stock: stock ? Number(stock) : null,
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: selectedIcon,
      color: selectedColor,
    };

    await saveMedicine(newMedicine);

    Alert.alert('Success', 'Medicine added successfully!');
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Medicine Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Aspirin"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Dosage</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. 1 tablet"
        value={dosage}
        onChangeText={setDosage}
      />

      <Text style={styles.label}>Family Member (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Mom"
        value={familyMember}
        onChangeText={setFamilyMember}
      />

      <Text style={styles.label}>Stock (Optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Total pills"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <Text style={styles.label}>Time</Text>
      <TouchableOpacity
        onPress={() => setShowPicker(true)}
        style={styles.input}
      >
        <Text>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker mode="time" value={time} onChange={onTimeChange} />
      )}

      <Text style={styles.label}>Icon</Text>
      <View style={styles.iconRow}>
        {icons.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => setSelectedIcon(item.id)}
            style={[
              styles.iconButton,
              selectedIcon === item.id && styles.selectedIcon,
            ]}
          >
            {item.icon}
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Color</Text>
      <View style={styles.colorRow}>
        {colors.map((color, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedColor(color)}
            style={[
              styles.colorCircle,
              { backgroundColor: color },
              selectedColor === color && styles.selectedColor,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Medicine</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginTop: 6,
    fontSize: 15,
  },
  iconRow: { flexDirection: 'row', marginTop: 10 },
  iconButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
  },
  selectedIcon: { borderWidth: 2, borderColor: '#4D96FF' },
  colorRow: { flexDirection: 'row', marginTop: 10 },
  colorCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  selectedColor: { borderWidth: 3, borderColor: '#000' },
  saveBtn: {
    backgroundColor: '#4D96FF',
    padding: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AddMedicineScreen;
