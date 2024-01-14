import axios from "axios";

const API_PATH = "/api/requests";

const RequestServices = () => {
  const createRequestService = async (data) => {
    try {
      let response = await axios.post(API_PATH, data);
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getRequestsService = async (params, { isSingle, userId }) => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(`${API_PATH}/${organization_id}`, {
        params: {
          ...params,
          isSingle,
          userId,
        },
      });
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const getRequestsDropdownService = async (params, apiPath = "") => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `${apiPath ? apiPath : API_PATH}/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getUsersService = async (params, apiPath = "") => {
    try {
      let organization_id = params.organization_id;

      delete params.organization_id;
      let response = await axios.get(
        `${apiPath ? apiPath : API_PATH}/${organization_id}`,
        {
          params,
        }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };
  const updateRequestsService = async (params) => {
    try {
      let organization_id = params.organization_id;
      let id = params.id;

      delete params.organization_id;
      let response = await axios.put(
        `${API_PATH}/${organization_id}/${id}`,
        params
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getRequestsWithProjectsFilter = async (organization_id, showTask) => {
    try {
      let response = await axios.get(
        `${API_PATH}/filter_client_project/${organization_id}`,
        { params: { showTask } }
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  const getRequestUsersService = async ({ organization_id, record }) => {
    try {
      let clientId = record.id;

      let response = await axios.get(
        `/api/users/client/${organization_id}/${clientId}`
      );
      return [response.data, null];
    } catch (error) {
      return [null, error];
    }
  };

  return {
    createRequestService,
    getRequestsService,
    updateRequestsService,
    getUsersService,
    getRequestsDropdownService,
    getRequestsWithProjectsFilter,
    getRequestUsersService,
  };
};

export default RequestServices;
