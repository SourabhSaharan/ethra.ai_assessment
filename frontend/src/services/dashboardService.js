import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/api/dashboard`;

export const getDashboardData = async (token) => {
  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
