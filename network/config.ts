import axios, { AxiosInstance } from "axios";
import { notification } from "antd";
import { parseCookies } from "nookies";

export default function request(config: any) {
  const instance: AxiosInstance = axios.create({
    baseURL: "/",
    timeout: 1000 * 60,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      let { client_token } = parseCookies();
      if (client_token) config.headers.Authorization = client_token;
      return config;
    },
    (error) => {
      notification.error({
        message: "提示",
        description: "网络异常，请稍后再试",
      });
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response.data;
    },
    (error) => {
      notification.error({
        message: "提示",
        description: "网络异常，请稍后再试",
      });
      return Promise.reject(error);
    }
  );

  return instance(config);
}
