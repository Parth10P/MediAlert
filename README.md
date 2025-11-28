# MediAlert – Medicine & Dose Reminder App

A simple React Native (Expo) application for managing medicine schedules and reminders.

---

## 📦 Installed Packages

### Navigation
- `@react-navigation/native`
- `@react-navigation/native-stack`
- `@react-navigation/bottom-tabs`
- `react-native-screens` *(auto-installed by Expo)*
- `react-native-safe-area-context` *(auto-installed by Expo)*

### Local Storage
- `@react-native-async-storage/async-storage`

### Notifications
- `expo-notifications`

### UI Icons
- `@expo/vector-icons`

---

## 📌 Installation Commands
```bash
npm install @react-navigation/native
npm install @react-navigation/native-stack
npm install @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install expo-notifications
npx expo install @expo/vector-icons
```

---

## 📁 Project Folder Structure
```
medi-alert/
│
├── App.js
├── package.json
├── app.json
│
└── src/
    ├── navigation/
    │   └── AppNavigator.js
    │
    ├── screens/
    │   ├── HomeScreen.js
    │   ├── AddMedicineScreen.js
    │   ├── DailyScheduleScreen.js
    │   ├── MissedDosesScreen.js
    │   ├── HistoryScreen.js
    │   └── ProfileScreen.js
    │
    ├── components/
    │   ├── MedicineCard.js
    │   ├── DoseItem.js
    │   └── Header.js
    │
    ├── context/
    │   └── MedicineContext.js
    │
    ├── storage/
    │   └── storageUtils.js
    │
    ├── notifications/
    │   └── notificationService.js
    │
    ├── utils/
    │   ├── timeHelpers.js
    │   └── colorOptions.js
    │
    └── styles/
        └── globalStyles.js
```

---

**Built with React Native (Expo)**