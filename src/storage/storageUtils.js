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

export const fillMissingHistory = async (totalMedicines) => {
  try {
    const history = await getHistory();
    const today = new Date();
    const dates = Object.keys(history).sort();

    if (dates.length === 0) return;

    const lastDateStr = dates[dates.length - 1];
    const lastDate = new Date(lastDateStr);

    // Iterate from day after last record until yesterday
    const nextDay = new Date(lastDate);
    nextDay.setDate(nextDay.getDate() + 1);

    let changed = false;

    while (nextDay < today) {
      const dateStr = nextDay.toISOString().split('T')[0];
      if (!history[dateStr]) {
        // Assume 0 taken, all skipped (or just 0 taken)
        // For now, we'll record 0 taken and 0 skipped (or total skipped if strict)
        // Let's record 0 taken, 0 skipped to indicate no activity
        history[dateStr] = { taken: 0, skipped: 0 };
        changed = true;
      }
      nextDay.setDate(nextDay.getDate() + 1);
    }

    if (changed) {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.log('Error filling missing history:', error);
  }
};