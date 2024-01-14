import React from "react";
import { Row, Col, Typography, Divider, Space, theme } from "antd";
import { Link } from "react-router-dom";

const TOTAL_SPAN = 24;

const { Title, Text } = Typography;

function Footer() {
  const { token } = theme.useToken();

  return (
    <Row
      className="h-100 p-4"
      style={{
        backgroundColor: token.colorPrimary,
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
      }}
    >
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 6 }}
        lg={{ span: 6 }}
        xl={{ span: 6 }}
        xxl={{ span: 6 }}
      >
        <Title style={{ color: token.colorBgBase }} level={2}>
          exactplace
        </Title>

        <Divider />

        <Space direction="vertical">
          <Text style={{ color: token.colorBgBase }}>
            Track Feedbacks from clients with exactplace
          </Text>

          <Text style={{ color: token.colorBgBase }} strong>
            © 2023 exactplace, All Rights Reserved.
          </Text>
        </Space>
      </Col>
      <Col
        xs={{ span: TOTAL_SPAN }}
        sm={{ span: TOTAL_SPAN }}
        md={{ span: 18 }}
        lg={{ span: 18 }}
        xl={{ span: 18 }}
        xxl={{ span: 18 }}
      >
        <Row gutter={[10, 10]}>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 4 }}
            lg={{ span: TOTAL_SPAN / 4 }}
            xl={{ span: TOTAL_SPAN / 4 }}
            xxl={{ span: TOTAL_SPAN / 4 }}
          >
            <Space direction="vertical">
              <Title style={{ color: token.colorBgBase }} level={4}>
                Produkte
              </Title>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                exactfinance.ch
              </Link>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                Risikomatrix-Tool
              </Link>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                Beschwerdemanagement-Tool
              </Link>
            </Space>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 4 }}
            lg={{ span: TOTAL_SPAN / 4 }}
            xl={{ span: TOTAL_SPAN / 4 }}
            xxl={{ span: TOTAL_SPAN / 4 }}
          >
            <Space direction="vertical">
              <Title style={{ color: token.colorBgBase }} level={4}>
                {" "}
                Dienstleistungen
              </Title>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                excel-hilfe.ch
              </Link>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                exactflow.ch
              </Link>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                exact-construct.ch
              </Link>
            </Space>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 4 }}
            lg={{ span: TOTAL_SPAN / 4 }}
            xl={{ span: TOTAL_SPAN / 4 }}
            xxl={{ span: TOTAL_SPAN / 4 }}
          >
            <Space direction="vertical">
              <Title style={{ color: token.colorBgBase }} level={4}>
                Social Media
              </Title>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                LinkedIn
              </Link>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                Facebook
              </Link>
              <Link
                style={{ color: token.colorBgBase }}
                to={"https://app.exactplace.ch/"}
              >
                Xing
              </Link>
            </Space>
          </Col>
          <Col
            xs={{ span: TOTAL_SPAN }}
            sm={{ span: TOTAL_SPAN }}
            md={{ span: TOTAL_SPAN / 4 }}
            lg={{ span: TOTAL_SPAN / 4 }}
            xl={{ span: TOTAL_SPAN / 4 }}
            xxl={{ span: TOTAL_SPAN / 4 }}
          >
            <Space direction="vertical">
              <Title style={{ color: token.colorBgBase }} level={4}>
                Contact
              </Title>
              <Text style={{ color: token.colorBgBase }}>
                exact construct GmbH
              </Text>
              <Text style={{ color: token.colorBgBase }}>
                Hungerbüelstrasse 22
              </Text>
              <Text style={{ color: token.colorBgBase }}>8500 Frauenfeld</Text>
              <Text style={{ color: token.colorBgBase }}>
                + 41 (0) 52 511 05 25
              </Text>
            </Space>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

export default Footer;
