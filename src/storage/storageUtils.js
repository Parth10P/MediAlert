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
export const saveHistory = async (date, taken, skipped, details = []) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : {};
    history[date] = { taken, skipped, details };
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
export const fillMissingHistory = async (totalMedicinesCount) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : {};
    const dates = Object.keys(history).sort();
    if (dates.length === 0) return;
    const getLocalDateStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
    const todayStr = getLocalDateStr(new Date());
    let hasUpdates = false;
    // For each date in history except today, update pending to skipped
    for (const date of dates) {
      if (date >= todayStr) continue; // Only process past days
      const entry = history[date];
      if (entry && Array.isArray(entry.details)) {
        let changed = false;
        let taken = 0;
        let skipped = 0;
        const newDetails = entry.details.map(item => {
          if (item.status === 'pending') {
            changed = true;
            skipped++;
            return { ...item, status: 'skipped' };
          } else if (item.status === 'taken') {
            taken++;
            return item;
          } else if (item.status === 'skipped') {
            skipped++;
            return item;
          } else {
            return item;
          }
        });
        if (changed) {
          entry.details = newDetails;
          entry.taken = taken;
          entry.skipped = skipped;
          hasUpdates = true;
        }
      }
    }
    // Fill in missing days as before
    const lastDateStr = dates[dates.length - 1];
    const lastDate = new Date(lastDateStr);
    let currentDate = new Date(lastDate);
    currentDate.setDate(currentDate.getDate() + 1);
    while (true) {
      const currentDateStr = getLocalDateStr(currentDate);
      if (currentDateStr >= todayStr) break;
      if (!history[currentDateStr]) {
        history[currentDateStr] = { taken: 0, skipped: totalMedicinesCount, details: [] };
        hasUpdates = true;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    if (hasUpdates) {
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }
  } catch (error) {
    console.log('Error filling missing history:', error);
  }
};







