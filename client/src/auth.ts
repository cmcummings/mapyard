import axios from "axios";

export const getUsername = () => localStorage.getItem("username");

export async function register(username: string, password: string) {
  return axios.post("http://localhost:3000/api/auth/register", {
    username: username,
    password: password,
  }, {
    withCredentials: true
  }).then(res => {   
    localStorage.setItem("username", res.data.name);
  });
}

export async function login(username: string, password: string) {
  return axios.post("http://localhost:3000/api/auth/login", {
    username: username,
    password: password
  }, { 
    withCredentials: true 
  }).then(res => {
    localStorage.setItem("username", res.data.username);
  });
}

export async function logout() {
  return axios.post("http://localhost:3000/api/auth/logout", {}, { withCredentials: true }).then(() => {
    localStorage.removeItem("username");
  });
}
