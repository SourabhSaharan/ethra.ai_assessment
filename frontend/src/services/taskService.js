import axios from "axios";

const API =
  `${import.meta.env.VITE_API_URL}/api/tasks`;

export const getTasks = async (token) => {
  const response = await axios.get(API, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createTask = async (
  taskData,
  token
) => {
  const response = await axios.post(
    `${API}/create`,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateTaskStatus = async (
  taskId,
  status,
  token
) => {
  const response = await axios.patch(
    `${API}/${taskId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteTask = async (
  taskId,
  token
) => {
  const response = await axios.delete(
    `${API}/${taskId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  

  return response.data;
};
export const editTask = async (
  taskId,
  taskData,
  token
) => {
  const response = await axios.put(
    `${API}/${taskId}`,
    taskData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
