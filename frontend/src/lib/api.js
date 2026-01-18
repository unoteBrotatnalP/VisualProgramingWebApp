import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api",
});

//Ustawianie / czyszczenie tokenu globalnie
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
}

//Po odświeżeniu strony spróbuj wczytać token z localStorage
const savedToken = localStorage.getItem("token");
if (savedToken) {
  api.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
}

export default api;
