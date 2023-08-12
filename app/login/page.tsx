"use client";
import "./index.scss";
import { useState } from "react";
import { Input, Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import { TipToast, RSAEncrypt } from "@/utils/tools";
import { loginIn } from "@/network/index";
import { setCookie } from "nookies";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // 点击sign up按钮
  const submitInfo = async () => {
    if (!username) {
      TipToast("Please enter your account", "warning");
      return;
    } else if (!password) {
      TipToast("Please enter your password", "warning");
      return;
    }

    setLoading(true);
    loginIn({
      username,
      password: RSAEncrypt(password),
    })
      .then((res: any) => {
        if (res.code == 200) {
          TipToast(res.msg, "success");
          localStorage.setItem("blog_user", username);

          setCookie(null, "client_token", res.token, {
            maxAge: 60 * 60 * 24,
            path: "/",
          });

          router.push("/main/article");
        } else {
          TipToast(res.msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 跳转到注册页面
  const toRegisterPage = () => {
    router.push("/register");
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="login_page">
        <div className="controller">
          <div className="title">Welcome back</div>
          <div className="title_des">Please enter your account to sign in</div>

          <div className="input_box">
            <Input
              onChange={(e) => setUsername(e.target.value)}
              className="input_item"
              allowClear
              defaultValue={username}
              type="text"
              placeholder="account"
            ></Input>
            <Input.Password
              onChange={(e) => setPassword(e.target.value)}
              allowClear
              defaultValue={password}
              className="input_item"
              placeholder="password"
            ></Input.Password>
          </div>

          <div className="btn_box">
            <Button block className="btn_login" onClick={submitInfo}>
              Sign in
            </Button>
          </div>

          <span className="login_des" onClick={toRegisterPage}>
            Don't have an account? Sign Up
          </span>
        </div>
      </div>
    </Spin>
  );
}
