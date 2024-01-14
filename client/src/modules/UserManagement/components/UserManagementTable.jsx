import { Button, Drawer, Space, Table, Tag, Typography, message } from "antd";
import React, { Suspense, useMemo } from "react";
import { EditableCell, EditableRow } from "../../Common/components";
// import { TableHeader } from ".";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

import ColumnSearchProps from "@modules/common/components/ColumnSearchProps";
import {
  setSearch,
  setShowRequest,
} from "../../UserManagement/models/UserManagementModel";
import UserManagementController from "../controllers/UserManagementController";
import { EditOutlined } from "@ant-design/icons";
import { TableHeader } from ".";
import { RequestTable } from "../../Request/components";

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

const { Text } = Typography;

function UserManagementTable() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableQuery = useLoaderData();
  const queryClient = useQueryClient();

  // const [messageApi, contextHolder] = message.useMessage();
  const { organization_id, id: user_id } = useSelector(
    (state) => state.login.user
  );
  const [messageApi, contextHolder] = message.useMessage();

  const sort = useSelector((state) => state.userManagement.sort);
  const showRequest = useSelector((state) => state.userManagement.showRequest);
  const search = useSelector((state) => state.userManagement.search);
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);
  const updateState = useSelector((state) => state.userManagement.updateState);

  const QUERY_KEY = [
    "user_management",
    organization_id,
    { paginate: { pageSize, page } },
    { sort },
    { search },
  ];

  const {
    handleGetUsers,
    onTableChange,
    handleModalOpen,
    handleChangeIsUpdateState,
    handleShowSingleUsersRequest,
  } = UserManagementController({
    dispatch,
    navigate,
    QUERY_KEY,
    messageApi,
    queryClient,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetUsers(organization_id, {
        paginate: { pageSize, page },
        sort,
        search,
      }),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        editable: true,
        sorter: true,
        width: "10%",

        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "First Name",
        dataIndex: "first_name",
        key: "first_name",
        editable: true,
        width: "20%",
        sorter: true,

        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
        key: "last_name",
        editable: true,
        width: "20%",
        sorter: true,

        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        editable: true,
        width: "20%",
        render: (email) => {
          return <a href={`mailto: ${email}`}>{email}</a>;
        },
        sorter: true,

        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },

      {
        title: "Phone Number",
        dataIndex: "phone_number",
        key: "phone_number",
        editable: true,
        width: "20%",

        sorter: true,

        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
      },

      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        sorter: true,
        width: "5%",
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        render: (_, user) => {
          let { active } = user;

          return (
            <Space>
              <Button
                onClick={() => {
                  handleChangeIsUpdateState(true, user);
                  handleModalOpen(true);
                }}
                size="small"
                type="primary"
              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  handleShowSingleUsersRequest(true, user);
                }}
                size="small"
              >
                View Requests
              </Button>
            </Space>
          );
        },
      },
    ],
    []
  );

  return (
    <div>
      {contextHolder}
      <Table
        components={components}
        title={() => {
          return <TableHeader QUERY_KEY={QUERY_KEY} />;
        }}
        scroll={{ x: 1300 }}
        loading={isFetching}
        dataSource={data?.data}
        columns={columns}
        onChange={onTableChange}
        pagination={{
          position: ["bottomRight"],
          hideOnSinglePage: true,
          current: page,
          pageSize: pageSize,
          page: page,
          total: data?.total,
        }}
      />

      <Drawer
        width={"100%"}
        title={`${updateState?.first_name} ${updateState.last_name}`}
        onClose={() => {
          dispatch(setShowRequest(false));
        }}
        open={showRequest}
      >
        {showRequest && (
          <Suspense fallback={<></>}>
            <RequestTable isSingle={true} userId={updateState.id} />
          </Suspense>
        )}
      </Drawer>
    </div>
  );
}

export default UserManagementTable;
