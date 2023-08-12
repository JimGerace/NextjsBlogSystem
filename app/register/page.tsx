"use client";
import "./index.scss";
import { Input, Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TipToast, RSAEncrypt } from "@/utils/tools";
import { RegisterIn } from "@/network/index";

function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const toRegister = () => {
    if (!username) {
      TipToast("Please enter your account", "warning");
      return;
    } else if (!password) {
      TipToast("Please enter your password", "warning");
      return;
    }

    setLoading(true);
    RegisterIn({
      username,
      password: RSAEncrypt(password),
    })
      .then((res: any) => {
        if (res.code == 200) {
          TipToast(res.msg, "success");
          toLoginPage();
        } else {
          TipToast(res.msg);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 跳转到登陆页面
  const toLoginPage = () => {
    router.back();
  };

  return (
    <Spin size="large" spinning={loading}>
      <div className="register_page">
        <div className="controller">
          <div className="title">Create an account</div>
          <div className="title_des">Create an account and password</div>

          <div className="input_box">
            <Input
              defaultValue={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input_item"
              placeholder="account"
            />
            <Input.Password
              defaultValue={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input_item"
              placeholder="password"
            />
          </div>

          <div className="btn_box">
            <Button className="btn_register" onClick={toRegister}>
              Sign up
            </Button>
          </div>

          <span className="register_des" onClick={toLoginPage}>
            Already have an account? Sign in instead.
          </span>
        </div>
      </div>
    </Spin>
  );
}

export async function getServerSideProps() {
  return {
    // 通过返回一个空对象，关闭该页面的 SSR
    props: {},
  };
}

export default Register;
