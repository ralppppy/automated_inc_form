import { lazy } from "react";

const TableHeader = lazy(() => import("./TableHeader"));
const RequestModalForm = lazy(() => import("./RequestModalForm"));
const RequestTable = lazy(() => import("./RequestTable"));
const ProjectDetails = lazy(() => import("./ProjectDetails"));
const AddUserRequestModal = lazy(() => import("./AddUserRequestModal"));
const UserRequestForm = lazy(() => import("./UserRequestForm"));
const RequestUserManagementTable = lazy(() =>
  import("./RequestUserManagementTable")
);

export {
  TableHeader,
  RequestModalForm,
  RequestTable,
  ProjectDetails,
  AddUserRequestModal,
  RequestUserManagementTable,
  UserRequestForm,
};
