"use client";
import axios, { AxiosInstance } from "axios";
import { notification } from "antd";

export default function request(config: any) {
  const instance: AxiosInstance = axios.create({
    baseURL: "/",
    timeout: 1000 * 60,
    withCredentials: true,
  });

  instance.interceptors.request.use(
    (config) => {
      // 判断有没有token
      let token = window.localStorage.getItem("blog_token");
      if (token) config.headers.Authorization = token;

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
      if (response.data.code == 401) {
        notification.error({
          message: "提示",
          duration: 1.5,
          description: response.data.msg,
          onClose: () => {
            window.localStorage.removeItem("blog_token");
            window.location.replace(window.location.origin + "/login");
          },
        });
      }
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
