import axios from "axios";

const api = axios.create({
  baseURL: "https://tiao.supliu.com.br/api/",
  headers: {
    'Content-type': 'application/json',
    'Authorization': import.meta.env.VITE_AUTH,
  }
});

export default api;