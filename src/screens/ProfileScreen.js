import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
    const [currentUser, setCurrentUser] = useState('');
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        phone: '',
        emergencyContact: '',
        bloodType: '',
        allergies: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({ ...userData });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const username = await AsyncStorage.getItem('@current_user');
            if (username) {
                setCurrentUser(username);
                const usersJson = await AsyncStorage.getItem('@users');
                if (usersJson) {
                    const users = JSON.parse(usersJson);
                    const user = users[username];
                    const loadedData = {
                        username: username,
                        email: user.email || '',
                        phone: user.phone || '',
                        emergencyContact: user.emergencyContact || '',
                        bloodType: user.bloodType || '',
                        allergies: user.allergies || '',
                    };
                    setUserData(loadedData);
                    setEditedData(loadedData);
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to load user data');
        }
    };

    const handleSave = async () => {
        try {
            const usersJson = await AsyncStorage.getItem('@users');
            if (usersJson) {
                const users = JSON.parse(usersJson);
                users[currentUser] = {
                    ...users[currentUser],
                    email: editedData.email,
                    phone: editedData.phone,
                    emergencyContact: editedData.emergencyContact,
                    bloodType: editedData.bloodType,
                    allergies: editedData.allergies,
                };
                await AsyncStorage.setItem('@users', JSON.stringify(users));
                setUserData(editedData);
                setIsEditing(false);
                Alert.alert('Success', 'Profile updated successfully');
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Error', 'Failed to save changes');
        }
    };

    const handleCancel = () => {
        setEditedData({ ...userData });
        setIsEditing(false);
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('@current_user');
        navigation.replace('Login');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>
                        {userData.username.charAt(0).toUpperCase()}
                    </Text>
                </View>
                <Text style={styles.username}>{userData.username}</Text>
            </View>

            <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Personal Information</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Email</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedData.email}
                            onChangeText={(text) => setEditedData({ ...editedData, email: text })}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    ) : (
                        <Text style={styles.value}>{userData.email || 'Not set'}</Text>
                    )}
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Phone Number</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedData.phone}
                            onChangeText={(text) => setEditedData({ ...editedData, phone: text })}
                            placeholder="Enter your phone number"
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.value}>{userData.phone || 'Not set'}</Text>
                    )}
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Emergency Contact</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedData.emergencyContact}
                            onChangeText={(text) => setEditedData({ ...editedData, emergencyContact: text })}
                            placeholder="Enter emergency contact number"
                            keyboardType="phone-pad"
                        />
                    ) : (
                        <Text style={styles.value}>{userData.emergencyContact || 'Not set'}</Text>
                    )}
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 25 }]}>Medical Information</Text>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Blood Type</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedData.bloodType}
                            onChangeText={(text) => setEditedData({ ...editedData, bloodType: text })}
                            placeholder="e.g., A+, O-, B+"
                            autoCapitalize="characters"
                        />
                    ) : (
                        <Text style={styles.value}>{userData.bloodType || 'Not set'}</Text>
                    )}
                </View>

                <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Allergies</Text>
                    {isEditing ? (
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={editedData.allergies}
                            onChangeText={(text) => setEditedData({ ...editedData, allergies: text })}
                            placeholder="List any allergies"
                            multiline
                            numberOfLines={3}
                        />
                    ) : (
                        <Text style={styles.value}>{userData.allergies || 'None listed'}</Text>
                    )}
                </View>

                {isEditing ? (
                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                        <Text style={styles.editText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#3498db',
        paddingTop: 60,
        paddingBottom: 30,
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2980b9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: 'white',
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    formContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    fieldContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: '#666',
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    input: {
        backgroundColor: '#f9f9f9',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    editBtn: {
        backgroundColor: '#3498db',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    editText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#95a5a6',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginRight: 10,
    },
    cancelText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveBtn: {
        flex: 1,
        backgroundColor: '#27ae60',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
    },
    saveText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logoutBtn: {
        backgroundColor: 'red',
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;