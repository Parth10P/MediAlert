import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

function SignupScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = async () => {
        // validation
        if (!username || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const usersJson = await AsyncStorage.getItem('@users');
            let users = {};
            if (usersJson) {
                users = JSON.parse(usersJson);
            }

            if (users[username]) {
                Alert.alert('Error', 'Username already taken');
                return;
            }

            // save user
            users[username] = {
                username: username,
                email: email,
                password: password
            };
            await AsyncStorage.setItem('@users', JSON.stringify(users));
            await AsyncStorage.setItem('@current_user', username);

            Alert.alert('Success', 'Account created!', [
                { text: 'OK', onPress: () => navigation.replace('Home') }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Could not create account');
            console.log(error);
        }
    };

    return (
        <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={styles.container}>
                <View style={styles.form}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Sign up to get started</Text>

                    <View style={styles.inputBox}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Choose a username"
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="Your email address"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Create a password"
                            secureTextEntry={true}
                        />
                    </View>

                    <View style={styles.inputBox}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Re-enter password"
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
                        <Text style={styles.btnText}>Sign Up</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={{ marginTop: 15, alignItems: 'center' }}
                        onPress={() => navigation.navigate('Login')}
                    >
                        <Text style={{ color: '#666', fontSize: 14 }}>
                            Already have an account? <Text style={{ color: '#3498db', fontWeight: '600' }}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        paddingTop: 40,
        paddingBottom: 40,
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        marginBottom: 20,
    },
    inputBox: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
    },
    signupBtn: {
        backgroundColor: '#2ecc71',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    btnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SignupScreen;
