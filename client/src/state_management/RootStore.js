import { configureStore } from "@reduxjs/toolkit";

import { ProfileModel } from "@modules/Profile/models";
import { LoginModel } from "@modules/Guest/models";
import Global from "./Global";
import { RequestModel } from "@modules/Request/models";

import { ExactPlaceTableModel } from "@modules/Common/ExactPlaceTable/models";
import { CommonModel } from "../modules/Common/models";
import { UserManagementModel } from "../modules/UserManagement/models";

export const store = configureStore({
  reducer: {
    global: Global,
    login: LoginModel,
    profile: ProfileModel,
    request: RequestModel,

    table: ExactPlaceTableModel,
    common: CommonModel,
    userManagement: UserManagementModel,
  },
});
