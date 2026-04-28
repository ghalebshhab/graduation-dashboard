import axiosClient from "./axiosClient.js";

export const adminLogin = async (email, password) => {
  const response = await axiosClient.post("/api/admin/auth/login", {
    email,
    password,
  });

  return response.data;
};
