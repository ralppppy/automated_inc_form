import { Button, Form, Input, Modal } from "antd";
import React from "react";
import { RequestController } from "../controllers";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQueryClient } from "react-query";

function RequestModalForm({ QUERY_KEY }) {
  const dispatch = useDispatch();
  const queryRequest = useQueryClient();
  const [form] = Form.useForm();
  const isUpdate = useSelector((state) => state.request.isUpdate);
  const modalOpen = useSelector((state) => state.request.modalOpen);
  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );
  const userId = useSelector((state) => state.login.user.id);

  const { handleModalOpen, handleSubmit, handleSuccess } = RequestController({
    dispatch,
    isUpdate,
    organization_id,
    QUERY_KEY,
    queryRequest,
  });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: handleSuccess,
  });

  return (
    <Modal
      title={isUpdate ? "Update Request" : "Add Request"}
      open={modalOpen}
      footer={null}
      destroyOnClose={true}
      onOk={() => handleModalOpen(false)}
      onCancel={() => handleModalOpen(false)}
    >
      <Form
        className="mt-3"
        layout="vertical"
        name="basic-"
        onFinish={mutate}
        form={form}
        preserve={false}
        initialValues={{
          requester_id: userId,
        }}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item hidden name="requester_id">
          <Input />
        </Form.Item>
        <Form.Item
          label="Fullname"
          name="full_name"
          rules={[
            {
              required: true,
              message: "Fullname is required",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Subject"
          name="subject"
          rules={[
            {
              required: true,
              message: "Subject is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Semester"
          name="semester"
          rules={[
            {
              required: true,
              message: "Semester is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="School Year"
          name="school_year"
          rules={[
            {
              required: true,
              message: "School Year is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Course"
          name="course"
          rules={[
            {
              required: true,
              message: "Course is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Rating"
          name="rating"
          rules={[
            {
              required: true,
              message: "Rating is required",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button className="w-100" type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default React.memo(RequestModalForm);
