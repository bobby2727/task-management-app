
import API from "./api";

export const signupUser = async (userData) => {
  const response = await API.post("/auth/signup", userData);
  return response.data;
};

export const loginUser = async (loginData) => {
  const response = await API.post("/auth/login", loginData);
  return response.data;
};
