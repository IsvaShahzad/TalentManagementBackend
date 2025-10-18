// import axios from "axios";

// const API_BASE_URL = "http://localhost:7000";

// // Fetch user by email and password
// export const fetchUserByEmail = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/user/fetchUser`, { email, password });
//     return response.data; // user object
//   } catch (error) {
//     // If backend returns 404 (user not found), treat as null
//     if (error.response && error.response.status === 404) return null;

//     // If backend returns 401 (invalid password)
//     if (error.response && error.response.status === 401) return null;

//     throw error; // other errors
//   }
// };

// // Validate password for a given email
// export const validatePassword = async (email, password) => {
//   try {
//     const response = await axios.post(`${API_BASE_URL}/api/user/fetchPasswd`, { email, password });
//     return response.data; // e.g., { valid: true } or user object
//   } catch (error) {
//     if (error.response && error.response.status === 401) return false;
//     throw error;
//   }
// };

import axios from "axios";

const API_BASE_URL = "http://localhost:7000/api/user";

// Fetch user by email
export const fetchUserByEmail = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetchUser`, { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) return null;
    throw error;
  }
};

// Validate password for a given email
export const validatePassword = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/fetchPasswd`, { email, password });
    return response.data; // e.g., { valid: true } or user object
  } catch (error) {
    if (error.response && error.response.status === 401) return false;
    throw error;
  }
};
