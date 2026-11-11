
import API from "./api";

export const getTasks = async (filters = {}) => {
  const response = await API.get("/tasks", {
    params: filters
  });

  return response.data;
};

export const createTask = async (taskData) => {
  const response = await API.post("/tasks", taskData);
  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await API.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await API.delete(`/tasks/${taskId}`);
  return response.data;
};
