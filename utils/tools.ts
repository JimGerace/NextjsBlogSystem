import { notification } from "antd";

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

// 提示框
export const TipToast = (
  description: string,
  type: string = "error",
  callback: Function = function () {},
  duration: number = 2,
  message: string = "提示"
) => {
  switch (type) {
    case "error": {
      notification.error({
        message,
        duration,
        description,
        onClose: () => {
          callback && callback();
        },
      });
      break;
    }
    case "success": {
      notification.success({
        message,
        duration,
        description,
        onClose: () => {
          callback && callback();
        },
      });
      break;
    }
    case "warning": {
      notification.warning({
        message,
        duration,
        description,
        onClose: () => {
          callback && callback();
        },
      });
      break;
    }
  }
};
