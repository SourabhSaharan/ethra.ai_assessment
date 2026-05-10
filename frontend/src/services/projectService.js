import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/api/projects`;

export const getProjects = async (token) => {
  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createProject = async (
  projectData,
  token
) => {
  const response = await axios.post(
    `${API}/create`,
    projectData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
