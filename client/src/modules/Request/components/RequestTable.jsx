import { Button, Form, Space, Table, Tag, message } from "antd";
import React, { Suspense, useMemo } from "react";
import { EditableCell, EditableRow } from "../../Common/components";
import {
  AddUserRequestModal,
  RequestUserManagementTable,
  TableHeader,
} from ".";
import { RequestController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "react-query";

const components = {
  body: {
    row: EditableRow,
    cell: EditableCell,
  },
};

function RequestTable({ isSingle, userId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tableQuery = useLoaderData();
  const queryRequest = useQueryClient();

  // const [messageApi, contextHolder] = message.useMessage();
  const {
    organization_id,
    id: user_id,
    is_student,
  } = useSelector((state) => state.login.user);
  const [messageApi, contextHolder] = message.useMessage();

  const sort = useSelector((state) => state.request.sort);
  const search = useSelector((state) => state.request.search);
  const pageSize = parseInt(tableQuery.pagination.pageSize);
  const page = parseInt(tableQuery.pagination.page);

  const QUERY_KEY = [
    "requests",
    organization_id,
    { paginate: { pageSize, page } },
    { sort },
    { search },
    isSingle,
    userId,
  ];
  const {
    handleGetRequests,
    onTableChange,
    handleUpdateRequest,
    handleUpdateStateOnSuccess,
  } = RequestController({
    dispatch,
    navigate,
    QUERY_KEY,
    messageApi,
    queryRequest,
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: () =>
      handleGetRequests(
        organization_id,
        {
          paginate: { pageSize, page },
          sort,
          search,
        },
        { isSingle, userId }
      ),
    enabled: !!organization_id,
    keepPreviousData: true,
    staleTime: Infinity,
  });

  const { mutate } = useMutation({
    mutationFn: handleUpdateRequest,
    onSuccess: handleUpdateStateOnSuccess,
  });

  const [form] = Form.useForm();

  const columns = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "id",
        key: "id",
        editable: true,
        sorter: true,
        width: "10%",
        // ...ColumnSearchProps(
        //   "client_id_text",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),

        // onCell: (record) => ({
        //   record,
        //   editable: true,
        //   dataIndex: "client_id_text",
        //   title: "ID",

        //   handleSave: mutate,
        // }),
      },
      {
        title: "Full name",
        dataIndex: "full_name",
        key: "full_name",
        editable: true,
        width: "15%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "full_name",
          title: "Full name",

          handleSave: mutate,
        }),
      },
      {
        title: "Subject",
        dataIndex: "subject",
        key: "subject",
        editable: true,
        width: "15%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "subject",
          title: "Subject",

          handleSave: mutate,
        }),
      },

      {
        title: "Semester",
        dataIndex: "semester",
        key: "semester",
        editable: true,
        width: "15%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "semester",
          title: "Semester",

          handleSave: mutate,
        }),
      },

      {
        title: "School year",
        dataIndex: "school_year",
        key: "school_year",
        editable: true,
        width: "15%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "school_year",
          title: "School year",

          handleSave: mutate,
        }),
      },
      {
        title: "Course",
        dataIndex: "course",
        key: "course",
        editable: true,
        width: "15%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "course",
          title: "Course",

          handleSave: mutate,
        }),
      },

      {
        title: "Rating",
        dataIndex: "rating",
        key: "rating",
        editable: true,
        width: "10%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        onCell: (record) => ({
          record,
          editable: true,
          dataIndex: "rating",
          title: "Rating",

          handleSave: mutate,
        }),
      },

      {
        title: "Status",
        dataIndex: "approve",
        key: "approve",
        editable: true,
        width: "20%",
        sorter: true,
        // ...ColumnSearchProps(
        //   "name",
        //   dispatch,
        //   setSearch,
        //   {
        //     pageSize,
        //     page,
        //   },
        //   navigate
        // ),
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),
        render: (approve) => {
          let color = {};
          let text = "Pending";
          if (approve !== null) {
            color = approve ? { color: "green" } : { color: "red" };
            text = approve ? "Approved" : "Rejected";
          }

          return <Tag {...color}>{text}</Tag>;
        },
      },
      // {
      //   title: "Open Projects",
      //   dataIndex: "open_projects",
      //   key: "open_projects",
      //   width: "10%",
      //   shouldCellUpdate: (record, prev) =>
      //     JSON.stringify(record) !== JSON.stringify(prev),
      // },
      {
        title: "Action",
        dataIndex: "action",
        key: "action",
        // width: "10%",
        shouldCellUpdate: (record, prev) =>
          JSON.stringify(record) !== JSON.stringify(prev),

        render: (_, row) => {
          let approve = true;

          let color = {};
          let text = "Approve";

          if (row.approve !== null) {
            approve = !row.approve;
            text = approve ? "Approved" : "Reject";
          }
          return (
            <Space>
              {!is_student && (
                <Button
                  disabled={row.approve}
                  type="primary"
                  onClick={() => {
                    mutate({ approve: true, id: row.id, organization_id });
                  }}
                >
                  Approve
                </Button>
              )}

              {!is_student && (
                <Button
                  disabled={!row.approve}
                  type="primary"
                  danger
                  onClick={() => {
                    console.log({ approve: approve }, "{ approve: approve }");
                    mutate({ approve: false, id: row.id, organization_id });
                  }}
                >
                  Reject
                </Button>
              )}

              {is_student && (row.approve === null || row.approve === false) ? (
                <Button disabled={true} type="link">
                  Download
                </Button>
              ) : (
                <a download href={`/api/requests/pdf/generate/${row.id}`}>
                  Download
                </a>
              )}
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
          return isSingle ? null : <TableHeader QUERY_KEY={QUERY_KEY} />;
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
      <Suspense fallback={<></>}>
        <AddUserRequestModal form={form} />
      </Suspense>
    </div>
  );
}

export default RequestTable;
