import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('@current_user');
            navigation.replace('Login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Welcome to MediAlert</Text>
            <Button onPress={handleLogout} title="Logout" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        padding: 20,
    }
})