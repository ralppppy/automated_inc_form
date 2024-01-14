import zxcvbn from "zxcvbn";
import {
  initialState,
  setCurrentUpdateUser,
  setCurrentUserRequest,
  setIsUpdatingUser,
  setModalOpen,
  setPasswordStrength,
  setSort,
  setUserRequestModalOpen,
} from "../models/RequestModel";
import RequestServices from "../services/RequestServices";

const RequestController = ({
  dispatch,
  navigate,
  QUERY_KEY,
  messageApi,
  queryRequest,
  isUpdate,
  organization_id,
}) => {
  const {
    getRequestsService,
    getUsersService,
    getRequestsDropdownService,
    updateRequestsService,
    createRequestService,
    getRequestUsersService,
    getRequestsWithProjectsFilter,
  } = RequestServices();

  const handleGetRequests = async (
    organization_id,
    pagingation,
    { isSingle, userId }
  ) => {
    let params = { organization_id, ...pagingation };
    let [{ data }, error] = await getRequestsService(params, {
      isSingle,
      userId,
    });

    let requests = data.data.map((request) => ({
      ...request,
      key: request.id,
    }));

    return { data: requests, total: data.totalData };
  };

  const onTableChange = (pagination, filters, sorter, extra) => {
    switch (extra.action) {
      case "paginate":
        let { current, pageSize } = pagination;
        const queryParams = new URLSearchParams({
          page: current,
          pageSize: pageSize,
        });

        navigate(`?${queryParams.toString()}`, { replace: true });

        break;
      case "sort":
        if (sorter.order) {
          dispatch(
            setSort({
              field: sorter.field,
              order: sorter.order,
            })
          );
        } else {
          dispatch(
            setSort({
              ...initialState.sort,
            })
          );
        }

        break;

      default:
        break;
    }
  };

  const handleGetRequestsDropdown = async (user) => {
    let params = { organization_id: user.organization_id };
    let [{ data }, error] = await getRequestsDropdownService(
      params,
      "/api/clients/dropdown"
    );

    let clients = data.map((client) => ({
      ...request,
      key: client.id,
    }));
    return clients;
  };
  const handleGetUsers = async (user, form, isUpdate) => {
    let params = { organization_id: user.organization_id };
    let [{ data }, error] = await getUsersService(
      params,
      "/api/users/dropdown"
    );

    let users = data.map((client) => ({
      ...request,
      key: client.id,
    }));
    if (isUpdate) {
      let teamIds = form.getFieldValue("team").map((c) => c.user.id);
      return users.filter((c) => !teamIds.includes(c.id));
    }

    return users;
  };

  const handleUpdateRequest = async (values) => {
    console.log(values, "sfdsdfsdfsdfdsf");
    let [client, error] = await updateRequestsService(values);
    if (error) return { success: false, error };
    return { success: true, values };
  };

  const handleUpdateStateOnSuccess = (newData) => {
    if (!newData.success) {
      let message = newData.error.response.data.message;
      messageApi.open({
        type: "error",
        content: message,
      });

      return;
    }

    queryRequest.setQueryData(QUERY_KEY, (prevData) => {
      let updatedData = prevData.data.map((c) => {
        if (c.id === newData.values.id) {
          return { ...c, ...newData.values };
        }

        return c;
      });
      return {
        ...prevData,
        data: updatedData,
      };
    });
  };

  const handleModalOpen = (modalOpen) => {
    dispatch(setModalOpen(modalOpen));
  };

  const getAllQuery = (queryRequest, getQueryType = null) => {
    const queryCache = queryRequest.getQueryCache();

    if (getQueryType) {
      return queryCache
        .getAll()
        .map((cache) => cache.queryKey)
        .filter((c) => c[0] === getQueryType);
    }

    return queryCache.getAll().map((cache) => cache.queryKey);
  };

  const handleSubmit = async (values) => {
    if (isUpdate) {
      let project_id = values.id;

      let data = formatDataForUpdate(values, project_id);

      let [client, error] = await updateProjectService(data, {
        organization_id,
        project_id,
      });

      if (error) return { success: false, error };
      return { success: true, values: data };
    } else {
      let data = {
        ...values,
        organization_id: organization_id,
        status: 1, //Always active at first
      };

      let [client, error] = await createRequestService(data);

      if (error) return { success: false, error };
      return { success: true, values: client };
    }
  };

  const handleSuccess = (newData) => {
    if (!newData.success) {
      let message = newData.error.response.data.message;
      messageApi.open({
        type: "error",
        content: message,
      });

      return;
    }

    let allQuery = getAllQuery(queryRequest, QUERY_KEY[0]);

    allQuery.forEach((query) => {
      queryRequest.invalidateQueries(query);
    });
    handleModalOpen(false);

    /**Update the  project details*/
    // queryRequest.invalidateQueries(["project_details"]);
  };

  const formatFilterData = (data, showTask, showModuleAll) => {
    let newData = data.map((d) => {
      let newChildren = d.projects.map((c) => {
        if (!showTask) {
          return {
            ...c,
            key: `${d.id}-${c.id}`,
            label: c.name,
          };
        }

        let moduleChildren = c.modules.map((m) => {
          return {
            ...m,
            key: `${d.id}-${c.id}-${m.id}`,
            label: m.name,
          };
        });
        moduleChildren.unshift({
          id: `${d.id}-${c.id}-All`,
          key: `${d.id}-${c.id}-All`,
          label: "All",
        });

        delete c.modules;

        return {
          ...c,
          key: `${d.id}-${c.id}`,
          label: c.name,
          children: moduleChildren,
        };
      });

      if (showModuleAll) {
        newChildren.unshift({
          id: `${d.id}-All`,
          key: `${d.id}-All`,
          label: "All",
        });
      }

      return {
        ...d,
        key: d.id,
        label: d.name,
        children: newChildren,
      };
    });

    newData.unshift({
      id: `All`,
      key: `All`,
      label: "All",
    });

    return newData;
  };

  const handleGetRequestsWithProjectsFilter = async (
    organization_id,
    showTask,
    showModuleAll
  ) => {
    let [clients, error] = await getRequestsWithProjectsFilter(
      organization_id,
      showTask
    );

    let data = formatFilterData(clients.data, showTask, showModuleAll);

    return data;
  };

  const getRequestUser = async ({ organization_id, record }) => {
    let [response, error] = await getRequestUsersService({
      organization_id,
      record,
    });
    if (!error) {
      return response;
    }
  };

  const handleUserRequestModalOpen = ({
    addUserRequestModalOpen,
    record,
    client,
    isUpdate = false,
  }) => {
    dispatch(setCurrentUserRequest(record));
    dispatch(setUserRequestModalOpen(addUserRequestModalOpen));

    if (isUpdate) {
      dispatch(setCurrentUpdateUser(client));
      dispatch(setIsUpdatingUser(true));
    }

    if (!addUserRequestModalOpen) {
      dispatch(setIsUpdatingUser(false));
    }
  };

  const handlePasswordChange = (password) => {
    const result = zxcvbn(password);
    dispatch(setPasswordStrength(result.score)); // zxcvbn returns a score from 0 to 4
  };

  return {
    handleGetRequestsDropdown,
    handleGetUsers,
    handleGetRequests,
    onTableChange,
    handleUpdateRequest,
    handleUpdateStateOnSuccess,
    handleModalOpen,
    handleSubmit,
    handleSuccess,
    handleGetRequestsWithProjectsFilter,
    getRequestUser,
    handleUserRequestModalOpen,
    handlePasswordChange,
  };
};

export default RequestController;
