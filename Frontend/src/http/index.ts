import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const APIAuthenticated = axios.create({
  baseURL: "http://localhost:5000",
});

APIAuthenticated.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { API, APIAuthenticated };


// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//   },
// });

// const APIAuthenticated = axios.create({
//   baseURL: "http://localhost:5000",
//   headers: {
//     "Content-Type": "application/json",
//     Accept: "application/json",
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// export { API, APIAuthenticated };
