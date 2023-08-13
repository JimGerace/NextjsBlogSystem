"use client";
import "./index.scss";
import { useEffect, useState } from "react";
import { Input, Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TipToast } from "@/utils/tools";
import { loginIn } from "@/network/index";
import { setCookie } from "nookies";
import { publicKey } from "@/utils/config";

function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [jsEncrypt, setJsEncrypt] = useState<any>(null);

  useEffect(() => {
    import("jsencrypt").then((module) => {
      const JSEncrypt = module.default;
      let instance = new JSEncrypt();
      instance.setPublicKey(publicKey);
      setJsEncrypt(instance);
    });
  }, []);

  // 点击sign up按钮
  const submitInfo = () => {
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
      password: jsEncrypt.encrypt(password),
    })
      .then((res: any) => {
        if (res.code == 200) {
          TipToast(res.msg, "success");
          setCookie(null, "user_name", username);
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

          <Link href="/register" className="login_des">
            Don't have an account? Sign Up
          </Link>
        </div>
      </div>
    </Spin>
  );
}

export default Login;
