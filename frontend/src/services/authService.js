import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/api/auth`;

export const signupUser = async (userData) => {
  const response = await axios.post(
    `${API}/signup`,
    userData
  );

  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(
    `${API}/login`,
    userData
  );

  return response.data;
};
