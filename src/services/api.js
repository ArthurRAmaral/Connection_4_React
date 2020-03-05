import axios from "axios";
import url from "../utils/backendUrl";

const api = axios.create({
  baseURL: url
});

export default api;
