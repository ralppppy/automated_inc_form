import React from "react";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SmileOutlined,
  DownOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import {
  Affix,
  Layout as AntDlayout,
  Badge,
  Button,
  Dropdown,
  Space,
  Typography,
} from "antd";
import "./styles.css";
import { useSelector } from "react-redux";

const { Text } = Typography;

const { Header } = AntDlayout;

const isSame = (prev, next) => {
  return JSON.stringify(prev) === JSON.stringify(next);
};

const LayoutHeader = ({
  collapsed,
  setCollapsed,
  colorBgContainer,
  handleLogout,
}) => {
  const { first_name, last_name } = useSelector((state) => state.login.user);

  return (
    <Affix offsetTop={0.1}>
      <Header
        className="shadow-sm-layout"
        style={{ padding: 0, background: colorBgContainer }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          <div className="d-flex align-items-center">
            <div style={{ marginRight: 20 }}>
              <Dropdown
                menu={{
                  items: [
                    {
                      key: "4",
                      danger: true,
                      onClick: handleLogout,
                      icon: <PoweroffOutlined />,
                      label: "Logout",
                    },
                  ],
                }}
              >
                <Button type="link">
                  <Space>
                    {first_name} {last_name}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
      </Header>
    </Affix>
  );
};

export default React.memo(LayoutHeader, isSame);
