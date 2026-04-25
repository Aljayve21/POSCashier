import Constants from "expo-constants";
import { Platform } from "react-native";
import axios from "axios";

const getApiBaseUrl = () => {
  const explicitUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  if (explicitUrl) {
    return explicitUrl.replace(/\/+$/, "");
  }

  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoGo?.debuggerHost ??
    null;

  const hostname = hostUri?.split(":")[0];

  if (hostname) {
    return `http://${hostname}:5000/api`;
  }

  if (Platform.OS === "android") {
    return "http://10.0.2.2:5000/api";
  }

  return "http://localhost:5000/api";
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
