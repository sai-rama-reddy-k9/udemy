import axios from "axios";

/**
 * Custom Axios Instance
 * Automatically handles baseURL and credential-based (Cookie) authentication.
 */
const API = axios.create({
  // Base URL for all relative endpoints (e.g., API.get("/users"))
  baseURL: "http://localhost:5000/api",

  // Default headers for payload formatting
  headers: {
    "Content-Type": "application/json",
  },

  // CRITICAL: Instructs the browser to send cookies (session/JWT) with cross-origin requests
  withCredentials: true,
});

export default API;
