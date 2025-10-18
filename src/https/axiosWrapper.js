import axios from "axios";
import API_CONFIG from "../config/api.js";

const defaultHeader = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export const axiosWrapper = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  withCredentials: true,
  headers: { ...defaultHeader },
});
