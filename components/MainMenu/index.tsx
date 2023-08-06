"use client";
import "./index.scss";
import type { MenuProps } from "antd";
import { Menu } from "antd";

import { GitlabOutlined, HighlightOutlined } from "@ant-design/icons";
import { useEffect, useState, memo } from "react";
import { useRouter, usePathname } from "next/navigation";

type MenuItem = Required<MenuProps>["items"][number];

interface Prop {
  collapsed: boolean;
  changeActiveMenu: Function;
}
interface Article {
  article: string;
  about: string;
}

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    label,
    key,
    icon,
    children,
    type,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem("文章", "article", <HighlightOutlined />),
  getItem("关于我", "about", <GitlabOutlined />),
];

const articleEnum: Article = {
  article: "文章",
  about: "关于我",
};

function MainMenu({ collapsed, changeActiveMenu }: Prop) {
  const pathName = usePathname();
  const router = useRouter();
  const [selectKey, setSelectKey] = useState<string>("");

  useEffect(() => {
    let result: string = pathName.replace("/main/", "");
    changeActiveMenu((articleEnum as any)[result]);
    setSelectKey(result);
  }, []);

  // 选择菜单栏
  const changeSelectKey = (row: any) => {
    const { key } = row;
    setSelectKey(key);
    changeActiveMenu((articleEnum as any)[key]);
    router.push(`/main/${key}`);
  };

  return (
    <>
      <div className="logo">{collapsed ? "JB" : "JimGerace Blog"}</div>
      <Menu
        onClick={changeSelectKey}
        theme="light"
        defaultSelectedKeys={[selectKey]}
        selectedKeys={[selectKey]}
        mode="inline"
        items={items}
      />
    </>
  );
}

export default memo(MainMenu);
