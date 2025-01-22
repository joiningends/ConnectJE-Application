import axios from "axios";

// Function to set the token as Authorization header
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

// Get both tokens from localStorage
const defaultToken = localStorage.getItem("whatsappusertoken");
const facebookToken = localStorage.getItem("facebookToken");

// Initially set the default token if it exists
if (defaultToken) {
  setAuthToken(defaultToken);
}

// Add a function to switch to the Facebook token when needed
export const useFacebookToken = () => {
  if (facebookToken) {
    setAuthToken(facebookToken);
  }
};

// Add a function to switch back to the default token
export const useDefaultToken = () => {
  if (defaultToken) {
    setAuthToken(defaultToken);
  }
};

// Add a response interceptor to handle errors like 401 Unauthorized
axios.interceptors.response.use(
  response => response, // Return the response if successful
  error => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized errors
      localStorage.removeItem("whatsappusertype");
      localStorage.removeItem("whatsappusertoken");
      localStorage.removeItem("whatsappuserId");
      localStorage.removeItem("facebookToken");
      localStorage.setItem("isLoggedIn", "false");
      delete axios.defaults.headers.common["Authorization"];
      window.location.href = "/SignIn";
    }
    return Promise.reject(error);
  }
);

export default axios;
