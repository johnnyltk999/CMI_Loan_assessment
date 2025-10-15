"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Image from "next/image";

import LOGO from "@/public/cmi_logo.png";

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  path?: string
): MenuItem & { path?: string } {
  return {
    key,
    icon,
    children,
    label,
    path,
  } as MenuItem & { path?: string };
}

const items: (MenuItem & { path?: string })[] = [
  getItem(
    <Link href="/dashboard">Dashboard</Link>,
    "1",
    <PieChartOutlined />,
    undefined,
    "/dashboard"
  ),
  getItem(
    <Link href="/dashboard/loan-assessment">Loan Assessment Form</Link>,
    "2",
    <DesktopOutlined />,
    undefined,
    "/dashboard/loan-assessment"
  ),
  getItem("Users", "sub1", <UserOutlined />, [
    getItem(
      <Link href="/dashboard/users">All users</Link>,
      "3",
      undefined,
      undefined,
      "/dashboard/users"
    ),
    getItem(
      <Link href="/dashboard/users/createUsers">Add User</Link>,
      "4",
      undefined,
      undefined,
      "/dashboard/users/createUsers"
    ),
    // getItem(
    //   <Link href="/dashboard/users/alex">Alex</Link>,
    //   "5",
    //   undefined,
    //   undefined,
    //   "/dashboard/users/alex"
    // ),
  ]),
  getItem("Admin Setting", "sub3", <TeamOutlined />, [
    getItem(
      <Link href="/dashboard/admin/criteria">1. Criteria Management</Link>,
      "6",
      undefined,
      undefined,
      "/dashboard/admin/criteria"
    ),
    getItem(
      <Link href="/dashboard/admin/form-setting">2. Form Setting</Link>,
      "7",
      undefined,
      undefined,
      "/dashboard/admin/form-setting"
    ),
    getItem(
      <Link href="/dashboard/admin/form-management">3. Form Management</Link>,
      "8",
      undefined,
      undefined,
      "/dashboard/admin/form-management"
    ),
  ]),
];

// ฟังก์ชันหา selected key จาก pathname
const getSelectedKey = (pathname: string, items: any[]): string => {
  for (const item of items) {
    if (item.path === pathname) {
      return item.key;
    }
    if (item.children) {
      const found = getSelectedKey(pathname, item.children);
      if (found) return found;
    }
  }
  return "1";
};

// ฟังก์ชันหา default open keys
const getOpenKeys = (pathname: string, items: any[]): string[] => {
  const openKeys: string[] = [];

  const findParent = (items: any[], targetPath: string): boolean => {
    for (const item of items) {
      if (item.children) {
        for (const child of item.children) {
          if (child.path === targetPath) {
            openKeys.push(item.key);
            return true;
          }
        }
        if (findParent(item.children, targetPath)) {
          openKeys.push(item.key);
          return true;
        }
      }
    }
    return false;
  };

  findParent(items, pathname);
  return openKeys;
};

// ฟังก์ชันสร้าง Breadcrumb จาก pathname
const getBreadcrumbs = (pathname: string) => {
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ title: <Link href="/dashboard">Home</Link> }];

  let currentPath = "";
  paths.forEach((path, index) => {
    if (index === 0) return; // ข้าม "dashboard"
    currentPath += `/${path}`;
    const fullPath = `/dashboard${currentPath}`;

    // แปลง path เป็นชื่อที่อ่านง่าย
    const title = path
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    breadcrumbs.push({
      title:
        index === paths.length - 1 ? (
          <span>{title}</span>
        ) : (
          <Link href={fullPath}>{title}</Link>
        ),
    });
  });

  return breadcrumbs;
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const selectedKey = getSelectedKey(pathname, items);
  const defaultOpenKeys = getOpenKeys(pathname, items);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        {/* Logo */}

        <div className="flex items-center p-3">
          <div className="flex-shrink-0 pl-3">
            <Image src={LOGO} height={32} width={32} alt="Logo" />
          </div>

          <div
            className={`
      ml-3 text-lg font-bold text-white transition-opacity duration-300 ease-in-out
      ${collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"}
    `}
          >
            CMIMFI
          </div>
        </div>

        <hr />
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={defaultOpenKeys}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        {/* Navbar */}

        <Navbar></Navbar>

        {/* <Header style={{ padding: 0, background: colorBgContainer }}>
          <div
            style={{
              padding: "0 24px",
              display: "flex",
              alignItems: "center",
              height: "100%",
            }}
          >
            <h2 style={{ margin: 0 }}>Dashboard System</h2>
          </div>
        </Header> */}
        <Content style={{ margin: "0 16px" }}>
          <Breadcrumb style={{ margin: "16px 0" }} items={breadcrumbs} />
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </div>
        </Content>
        {/* <Footer style={{ textAlign: "center" }}>
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer> */}
      </Layout>
    </Layout>
  );
}
