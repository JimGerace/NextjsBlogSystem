"use client";
import { Layout } from "antd";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
const MainMenu = dynamic(() => import("../../components/MainMenu"), {
  ssr: false,
});
const MainHeader = dynamic(() => import("../../components/MainHeader"), {
  ssr: false,
});

const { Content, Sider } = Layout;

export default function Main({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<string>("");
  const [i, setI] = useState<number>(1);

  useEffect(() => {
    setI(1);
    setTimeout(() => {
      setI(0);
    }, 300);
  }, [pathName]);

  const changeActiveMenu = useCallback(
    (val: string) => {
      setActiveMenu(val);
    },
    [activeMenu]
  );

  return (
    <Layout style={{ minHeight: "100vh", flexDirection: "row" }}>
      <Sider
        style={{ borderRight: "1px solid #ddd" }}
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <MainMenu changeActiveMenu={changeActiveMenu} collapsed={collapsed} />
      </Sider>
      <Layout className="site-layout" style={{ backgroundColor: "#fff" }}>
        <MainHeader activeMenu={activeMenu} />
        <Content
          className={"animation" + "_" + i}
          style={{ padding: "24px", overflow: "auto" }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
