import React, { useState } from "react";
import { Affix, Layout, Menu } from "antd";
import style from "./style.module.css";
import { Link, useResolvedPath } from "react-router-dom";
import { Routes } from "../../../common";
import LayoutController from "../controller/LayoutController";
import "./styles.css";
import {
  CommentOutlined,
  CalendarOutlined,
  DashboardOutlined,
  FolderOpenOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";

const { Sider } = Layout;

const student = "student";
const ADMIN = "admin";

/**
 * Configuration for navigation items.
 * Each item represents a section in the application with associated routes and permissions.
 * The keys play a crucial role in uniquely identifying and persistently storing each item in the database.
 * These keys should not be altered by developers to maintain consistency in the database.
 */
export const items = [
  // {
  //   label: <Link to={Routes.dashboard}>Dashboard</Link>,
  //   labelText: "Dashboard",
  //   icon: React.createElement(DashboardOutlined),
  //   key: "dashboard",
  //   keyCode: "DSHBRD",
  //   allowed: [ADMIN],
  // },
  {
    label: <Link to={Routes.dashboard}>Dashboard</Link>,
    icon: React.createElement(UserOutlined),
    labelText: "Dashboard",
    key: "dashboard",
    keyCode: "USRMGT",
    allowed: [ADMIN],
  },
  {
    label: <Link to={Routes.request}>Request</Link>,
    icon: React.createElement(TeamOutlined),
    labelText: "Request",
    key: "request",
    allowed: [student],
  },
];

const SideBarMenu = ({ collapsed, setCollapsed, router }) => {
  const { getKeyByValue } = LayoutController();

  const menu_access = useSelector((state) => state.login.user.menu_access);

  const is_student = useSelector((state) => state.login.user.is_student);
  const is_studentText = is_student ? "student" : "admin";

  let menuItems = items.filter((item) => {
    if (item.allowed.includes(is_studentText)) {
      return true;
    }

    return false;
  });

  return (
    <Sider
      theme="light"
      style={{ minHeight: "100vh" }}
      breakpoint="lg"
      // collapsedWidth="0"
      collapsible
      collapsed={collapsed}
      onBreakpoint={(broken) => {
        // console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        setCollapsed(collapsed);

        // console.log(collapsed, type);
      }}
      trigger={null}
    >
      <Affix className="w-100" offsetTop={0.1}>
        <div>
          <div className={style.logo} />
          <Menu
            selectedKeys={[
              getKeyByValue(Routes, `/${router.pathname.split("/")[1]}`),
            ]}
            theme="light"
            mode="inline"
            items={menuItems}
          />
        </div>
      </Affix>
    </Sider>
  );
};

export default React.memo(SideBarMenu);
