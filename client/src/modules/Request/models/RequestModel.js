import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  clients: [],
  modalOpen: false,

  updateState: {},

  isUpdate: false,

  utilities: {
    modalOpen: false,
  },
  paginate: {
    pageSize: 10,
    page: 1,
  },
  sort: {
    field: "createdAt",
    order: "descend",
  },
  search: {
    s: "",
    searchIndex: "",
  },

  addUserRequestModalOpen: false,
  passwordStrength: null,
  currentUserRequest: {},
  currentUpdateUser: {},
  isUpdatingUser: false,
};

export const RequestModel = createSlice({
  name: "RequestModel",
  initialState,
  reducers: {
    setCurrentUserRequest: (state, { payload }) => {
      state.currentUserRequest = payload;
    },
    setIsUpdatingUser: (state, { payload }) => {
      state.isUpdatingUser = payload;
    },
    setCurrentUpdateUser: (state, { payload }) => {
      state.currentUpdateUser = payload;
    },

    setPasswordStrength: (state, { payload }) => {
      state.passwordStrength = payload;
    },

    setUserRequestModalOpen: (state, { payload }) => {
      state.addUserRequestModalOpen = payload;
    },

    setRequests: (state, { payload }) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.requests = payload;
    },

    setModalOpen: (state, { payload }) => {
      state.modalOpen = payload;
    },

    setRefetchDetails: (state, { payload }) => {
      state.refetchDetails = payload;
    },

    setUpdateState: (state, { payload }) => {
      state.updateState = payload;
    },
    setIsUpdate: (state, { payload }) => {
      state.isUpdate = payload;
    },

    setModalInfo: (state, { payload }) => {
      state.modal = { ...payload.modal };
    },

    setPageSize: (state, { payload }) => {},

    setPage: (state, { payload }) => {
      state.paginate.page = payload;
    },

    setSort: (state, { payload }) => {
      state.sort = payload;
    },

    setSearch: (state, { payload }) => {
      state.search = payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRequests,
  setModalOpen,
  setFilter,
  setRefetchDetails,
  setIsUpdate,
  setUpdateState,
  setModalInfo,
  setPage,
  setSort,
  setSearch,
  setIsUpdatingUser,
  setUserRequestModalOpen,
  setPasswordStrength,
  setCurrentUserRequest,
  setCurrentUpdateUser,
} = RequestModel.actions;

export default RequestModel.reducer;
