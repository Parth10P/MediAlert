import AsyncStorage from '@react-native-async-storage/async-storage';

const MEDICINE_KEY = '@medicines_list';

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
  }
};
