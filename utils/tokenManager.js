import AsyncStorage from "@react-native-async-storage/async-storage";
/**
 * Stores the provided token in AsyncStorage.
 * @async
 * @function storeToken
 * @param {string} token - The token to be stored.
 * @returns {Promise<void>} A promise that resolves when the token is successfully stored.
 * @throws {Error} If an error occurs while storing the token.
 */
export const storeToken = async (token) => {
  try {
    await AsyncStorage.setItem('@token', token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

/**
 * Retrieves the token from AsyncStorage.
 * @async
 * @function getToken
 * @returns {Promise<?string>} A promise that resolves with the token if it exists, or null if no token is found.
 * @throws {Error} If an error occurs while retrieving the token.
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('@token');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    throw error;
  }
};

/**
 * Clears the token from AsyncStorage.
 * @async
 * @function clearToken
 * @returns {Promise<void>} A promise that resolves when the token is successfully cleared.
 * @throws {Error} If an error occurs while clearing the token.
 */
export const clearToken = async () => {
  try {
    await AsyncStorage.removeItem('@token');
  } catch (error) {
    console.error('Error clearing token:', error);
    throw error;
  }
};

/**
 * Fetches data from the specified URL with authorization token included in the request headers.
 * @async
 * @function authFetch
 * @param {string} url - The URL to fetch data from.
 * @param {object} [options={}] - Additional options for the fetch request.
 * @returns {Promise<Response>} A promise that resolves with the fetch Response.
 * @throws {Error} If an error occurs during the fetch request.
 */
export const authFetch = async (url, options = {}) => {
  try {
    const authToken = await getToken();
    const headers = {
      ...options.headers,
      "x-access-token": authToken,
    };
    console.log(JSON.stringify({
      ...options,
      headers: headers
    }));
  
    return fetch(url, {
      ...options,
      headers: headers
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
