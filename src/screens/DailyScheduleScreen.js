import React from 'react';
<<<<<<< HEAD
import { View, Text } from 'react-native';

export default function DailyScheduleScreen() {
    return (
        <View>
            <Text>Daily Schedule Screen</Text>
        </View>
    );
}
=======
import { View, Text, StyleSheet } from 'react-native';

const DailyScheduleScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Daily Schedule Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default DailyScheduleScreen;
>>>>>>> origin/main
