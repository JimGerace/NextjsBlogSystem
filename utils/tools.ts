import { notification } from "antd";
import JSEncrypt from "jsencrypt";
import { publicKey } from "./config";

// 格式化时间日期
export function formDate(time: string, type: string) {
  let year: number = new Date(time).getFullYear();
  let month: number | string = new Date(time).getMonth() + 1;
  let day: number | string = new Date(time).getDate();

  let hour: number | string = new Date(time).getHours();
  let minute: number | string = new Date(time).getMinutes();
  let seconds: number | string = new Date(time).getSeconds();

  month < 10 && (month = "0" + month);
  day < 10 && (day = "0" + day);
  hour < 10 && (hour = "0" + hour);
  minute < 10 && (minute = "0" + minute);
  seconds < 10 && (seconds = "0" + seconds);

  switch (type) {
    case "yyyy-mm-dd hh:mm:ss": {
      return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;
    }
    case "hh:mm:ss": {
      return `${hour}:${minute}:${seconds}`;
    }
    default: {
      return `${year}-${month}-${day}`;
    }
  }
}

// RSA -- 加密
export function RSAEncrypt(word: string) {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(word);
}

// 提示框
export const TipToast = (
  description: string,
  type: string = "error",
  duration: number = 2,
  message: string = "提示"
) => {
  switch (type) {
    case "error": {
      notification.error({
        message,
        duration,
        description,
      });
      break;
    }
    case "success": {
      notification.success({
        message,
        duration,
        description,
      });
      break;
    }
    case "warning": {
      notification.warning({
        message,
        duration,
        description,
      });
      break;
    }
  }
};
