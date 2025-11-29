import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICINE_KEY = '@medicines_list';
const HISTORY_KEY = '@medicine_history';

export const saveMedicine = async (medicine) => {
  try {
    const existing = await AsyncStorage.getItem(MEDICINE_KEY);
    const medicines = existing ? JSON.parse(existing) : [];
    medicines.push(medicine);
    await AsyncStorage.setItem(MEDICINE_KEY, JSON.stringify(medicines));
  } catch (error) {
    console.log('Error saving medicine:', error);
  }
};

export const getMedicines = async () => {
  try {
    const existing = await AsyncStorage.getItem(MEDICINE_KEY);
    return existing ? JSON.parse(existing) : [];
  } catch (error) {
    console.log('Error loading medicines:', error);
    return [];
  }
};

export const updateMedicineStatus = async (medicines) => {
  try {
    await AsyncStorage.setItem(MEDICINE_KEY, JSON.stringify(medicines));
  } catch (error) {
    console.log('Error updating medicines:', error);
  }
};

export const saveHistory = async (date, taken, skipped) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : {};
    history[date] = { taken, skipped };
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.log('Error saving history:', error);
  }
};

export const getHistory = async () => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    return existing ? JSON.parse(existing) : {};
  } catch (error) {
    console.log('Error loading history:', error);
    return {};
  }
};