import API from "./axios";

export const LoginUser = (userData) => API.post("/auth/login", userData);

export const RegisterUser = (credentials) =>
  API.post("/auth/register", credentials);
