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

export const fillMissingHistory = async (totalMedicinesCount) => {
  try {
    const existing = await AsyncStorage.getItem(HISTORY_KEY);
    const history = existing ? JSON.parse(existing) : {};
    const dates = Object.keys(history).sort();

    if (dates.length === 0) return;

    const lastDateStr = dates[dates.length - 1];
    const lastDate = new Date(lastDateStr);

    const getLocalDateStr = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const todayStr = getLocalDateStr(new Date());

    let currentDate = new Date(lastDate);
    currentDate.setDate(currentDate.getDate() + 1);

    let hasUpdates = false;

    while (true) {
      const currentDateStr = getLocalDateStr(currentDate);
      if (currentDateStr >= todayStr) break;

      if (!history[currentDateStr]) {
        history[currentDateStr] = { taken: 0, skipped: totalMedicinesCount };
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