import API from "./axios";

export const RegisterUser = (credentials) => API.post("/auth/register", credentials);

export const LoginUser = (userData) => API.post("/auth/login", userData);

export const LogoutUser = () => API.post("/auth/logout");
