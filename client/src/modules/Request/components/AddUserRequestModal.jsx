import { Form, Modal, message } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RequestController } from "../controllers";
import { UserRequestForm } from ".";
import { SetPasswordController } from "../../Guest/controller";
import UserManagementController from "../../UserManagement/controllers/UserManagementController";
import { useMutation, useQueryClient } from "react-query";

function AddUserRequestModal({ form }) {
  const dispatch = useDispatch();
  const addUserRequestModalOpen = useSelector(
    (state) => state.request.addUserRequestModalOpen
  );
  const isUpdatingUser = useSelector((state) => state.request.isUpdatingUser);
  const currentUpdateUser = useSelector(
    (state) => state.request.currentUpdateUser
  );

  const queryRequest = useQueryClient();
  const currentUserRequest = useSelector(
    (state) => state.request.currentUserRequest
  );
  const [messageApi, contextHolder] = message.useMessage();

  const organization_id = useSelector(
    (state) => state.login.user.organization_id
  );

  const { handleUserRequestModalOpen, handlePasswordChange } =
    RequestController({
      dispatch,
    });

  const { handleSubmit } = UserManagementController({
    dispatch,
  });

  const { mutate } = useMutation({
    mutationFn: handleSubmit,
    onSuccess: ([response, error, isUpdate]) => {
      if (error) {
        messageApi.error(error.response.data.message);
      } else {
        handleUserRequestModalOpen(false);

        const CLIENT_USER_KEY = [
          "client_user_management",
          organization_id,
          currentUserRequest.id,
        ];

        console.log(isUpdate, "isUpdate");
        queryRequest.invalidateQueries(CLIENT_USER_KEY);
        messageApi.open({
          type: "success",
          content: isUpdate
            ? "Succesfully updated user client!"
            : "Succesfully added user client!",
        });
      }
    },
  });

  useEffect(() => {
    if (isUpdatingUser) {
      form.setFieldsValue({ ...currentUpdateUser, ...currentUpdateUser.user });
    } else {
      form.resetFields();
    }
  }, [isUpdatingUser]);

  return (
    <>
      {contextHolder}
      <Modal
        title={"Add user client"}
        open={addUserRequestModalOpen}
        footer={null}
        className="w-50"
        destroyOnClose={true}
        onOk={() => handleUserRequestModalOpen(false)}
        onCancel={() => handleUserRequestModalOpen(false)}
      >
        <Form
          className="mt-3"
          layout="vertical"
          name="basic-"
          onFinish={(values) => {
            values = {
              ...values,
              client_id: currentUserRequest.id,
              is_student: false,
            };

            mutate({
              values,
              organization_id,
              isUpdate: isUpdatingUser,
              isRequest: true,
            });
          }}
          form={form}
          // preserve={false}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
          onValuesChange={(values) => {
            if (values.hasOwnProperty("password")) {
              handlePasswordChange(values.password);
            }
          }}
        >
          <Suspense fallback={<></>}>
            <UserRequestForm form={form} />
          </Suspense>
        </Form>
      </Modal>
    </>
  );
}

export default AddUserRequestModal;
