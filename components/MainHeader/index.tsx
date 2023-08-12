"use client";
import "./index.scss";
import Image from "next/image";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies } from "nookies";

interface Prop {
  activeMenu: string;
}

export default function MainHeader({ activeMenu }: Prop) {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>("");

  useEffect(() => {
    let { user_name } = parseCookies();
    setUsername(user_name);
  }, []);

  // 退出登录
  const layoutInfo = () => {
    router.replace("/login");
    destroyCookie(null, "client_token");
    destroyCookie(null, "user_name");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span onClick={layoutInfo}>退出登录</span>,
    },
  ];

  return (
    <div className="header_box">
      <div className="header_left">
        <Image
          src="/images/icon_location.png"
          width={20}
          height={20}
          alt=""
        ></Image>
        {activeMenu && <span className="route_item">{activeMenu}</span>}
      </div>

      <div className="header_right">
        <Image
          className="icon_user"
          src="/images/icon_user.png"
          width={20}
          height={20}
          alt=""
        ></Image>

        <Dropdown arrow={true} menu={{ items }} trigger={["click"]}>
          <Space>
            <span>{username}</span>
            <DownOutlined />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
}
