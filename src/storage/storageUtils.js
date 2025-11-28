import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';

// Save a new user
export const saveUser = async (userData) => {
    try {
        const users = await getAllUsers();
        users[userData.username] = {
            username: userData.username,
            email: userData.email,
            password: userData.password,
        };
        await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
        return { success: true };
    } catch (error) {
        console.error('Error saving user:', error);
        return { success: false, error: error.message };
    }
};

// Get all users
export const getAllUsers = async () => {
    try {
        const usersJson = await AsyncStorage.getItem(USERS_KEY);
        return usersJson ? JSON.parse(usersJson) : {};
    } catch (error) {
        console.error('Error getting users:', error);
        return {};
    }
};

// Get a specific user by username
export const getUser = async (username) => {
    try {
        const users = await getAllUsers();
        return users[username] || null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

// Check if user exists
export const checkUserExists = async (username) => {
    try {
        const user = await getUser(username);
        return user !== null;
    } catch (error) {
        console.error('Error checking user:', error);
        return false;
    }
};

// Set current logged-in user
export const setCurrentUser = async (username) => {
    try {
        await AsyncStorage.setItem(CURRENT_USER_KEY, username);
        return { success: true };
    } catch (error) {
        console.error('Error setting current user:', error);
        return { success: false, error: error.message };
    }
};

// Get current logged-in user
export const getCurrentUser = async () => {
    try {
        const username = await AsyncStorage.getItem(CURRENT_USER_KEY);
        if (username) {
            return await getUser(username);
        }
        return null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

// Logout
export const logout = async () => {
    try {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        return { success: true };
    } catch (error) {
        console.error('Error logging out:', error);
        return { success: false, error: error.message };
    }
};

// Validate login credentials
export const validateLogin = async (username, password) => {
    try {
        const user = await getUser(username);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        if (user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }
        return { success: true, user };
    } catch (error) {
        console.error('Error validating login:', error);
        return { success: false, message: error.message };
    }
};
