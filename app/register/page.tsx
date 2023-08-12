"use client";
import "./index.scss";
import { Input, Button, Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TipToast } from "@/utils/tools";
import { RegisterIn } from "@/network/index";
import { publicKey } from "@/utils/config";

function Register() {
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
      password: jsEncrypt.encrypt(password),
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

export default Register;
