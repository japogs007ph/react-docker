import axios from "axios";

const API = "http://10.2.2.100/DEV/Portfolio/Devs/mark.rabit/ReactAppApi/api/Users";

export async function getUsers() {
  const res = await axios.get(API);
  return res.data;
}

export async function createUser(data) {
  return axios.post(API, data);
}

export async function updateUser(id, data) {
  return axios.put(`${API}/${id}`, data);
}

export async function deleteUser(id) {
  return axios.delete(`${API}/${id}`);
}

export const activateUser = (id) =>
  axios.post(`${API}/activate/${id}`);