import React from 'react';
<<<<<<< HEAD
import { View, Text } from 'react-native';

export default function HistoryScreen() {
    return (
        <View>
            <Text>History Screen</Text>
        </View>
    );
}
=======
import { View, Text, StyleSheet } from 'react-native';

const HistoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>History Screen</Text>
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

export default HistoryScreen;
>>>>>>> origin/main
