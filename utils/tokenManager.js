import AsyncStorage from '@react-native-async-storage/async-storage';

// Storing the token
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@token', token);
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Retrieving the token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Clearing the token
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('@token');
  } catch (error) {
    console.error('Error clearing token:', error);
  }
};
