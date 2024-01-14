import React, { useEffect, useMemo } from "react";
import { Button, ConfigProvider, Result, theme } from "antd";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  useLocation,
} from "react-router-dom";

// Routes
import { Routes } from "./common";

// Views
import MainLayout from "./modules/Layout/views/MainLayout";
import { Login, SetPassword } from "./modules/Guest/views";
import { Dashboard } from "./modules/Dashboard/views";
import { Request } from "./modules/Request/views";

import { Profile } from "./modules/Profile/views";
import { Password } from "./modules/Password/views";
import { UserManagement } from "./modules/UserManagement/views";

// Controllers
import { LoginController } from "@modules/Guest/controller";

// Models

import { initialState as RequestInitialState } from "./modules/Request/models/RequestModel";

// CSS
import "./App.css";
import GuestLayout from "./modules/Layout/views/GuestLayout";
import ForgotPassword from "./modules/Guest/views/ForgotPassword";

dayjs.extend(utc);
dayjs.extend(timezone);

const student = "student";
const ADMIN = "admin";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  const primaryColor = useSelector((state) => state.global.primaryColor);
  const background = useSelector((state) => state.global.background);
  const dispatch = useDispatch();

  const is_student = useSelector((state) => state.login.user.is_student);
  const menu_access = useSelector((state) => state.login.user.menu_access);
  const is_studentText = is_student ? "student" : "admin";
  let { verifyToken } = LoginController({ dispatch });
  const { token } = theme.useToken();

  document.documentElement.style.setProperty(
    "--fc-border-color",
    background.borderColor
  );
  document.documentElement.style.setProperty("--primary-color", primaryColor);
  document.documentElement.style.setProperty(
    "--background-color",
    background.color
  );
  document.documentElement.style.setProperty(
    "--text-color",
    background.textColor
  );

  const router = useMemo(() => {
    let routes = [
      {
        path: Routes.dashboard,
        element: (
          <>
            <ScrollToTop /> <MainLayout />
          </>
        ),
        shouldRevalidate: () => false,
        allowed: [ADMIN, student],
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return redirect(Routes.login);
          } else {
            return { success: true };
          }
        },
        children: [
          // {
          //   path: Routes.dashboard,
          //   element: <Dashboard />,
          //   allowed: [ADMIN],
          //   keyCode: "DSHBRD",
          //   // loader: ({ request }) => {
          //   //   if (typeof isEmployee === "boolean" && !isEmployee) {
          //   //     return redirect(Routes.feedbackList);
          //   //   }

          //   //   let page = new URL(request.url).searchParams.get("page");
          //   //   let pageSize = new URL(request.url).searchParams.get("pageSize");
          //   //   let search = new URL(request.url).searchParams.get("s");
          //   //   page = page ? page : 1;
          //   //   pageSize = pageSize
          //   //     ? pageSize
          //   //     : TasksListInitialState.paginate.pageSize;

          //   //   return { pagination: { page, pageSize }, search };
          //   // },
          // },

          {
            path: Routes.dashboard,
            allowed: [ADMIN],
            element: <UserManagement />,
            keyCode: "USRMGT",
            loader: ({ request }) => {
              if (is_student) {
                return redirect(Routes.request);
              }

              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : RequestInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },

          {
            path: Routes.request,
            allowed: [student],
            element: <Request />,
            keyCode: "CLNTS",
            loader: ({ request }) => {
              let page = new URL(request.url).searchParams.get("page");
              let pageSize = new URL(request.url).searchParams.get("pageSize");
              let search = new URL(request.url).searchParams.get("s");
              page = page ? page : 1;
              pageSize = pageSize
                ? pageSize
                : RequestInitialState.paginate.pageSize;

              return { pagination: { page, pageSize }, search };
            },
          },
        ],
      },

      {
        path: Routes.login,
        element: <GuestLayout />,
        allowed: [ADMIN, student],
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return true;
          } else {
            return redirect(Routes.dashboard);
          }
        },
        children: [
          {
            path: Routes.login,
            allowed: [ADMIN, student],
            element: <Login />,
            keyCode: "GUEST",
          },
        ],
      },
      {
        path: Routes.setPassword,
        allowed: [ADMIN, student],
        element: <GuestLayout />,
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return true;
          } else {
            return redirect(Routes.dashboard);
          }
        },
        children: [
          {
            path: Routes.setPassword,
            allowed: [ADMIN, student],
            element: <SetPassword />,
            keyCode: "GUEST",
          },
        ],
      },
      {
        path: Routes.accountRecovery,
        element: <GuestLayout />,
        allowed: [ADMIN, student],
        loader: async () => {
          let [data, error] = await verifyToken();
          if (error) {
            return true;
          } else {
            return redirect(Routes.dashboard);
          }
        },
        children: [
          {
            path: Routes.accountRecovery,
            element: <ForgotPassword />,
            allowed: [ADMIN, student],
            keyCode: "GUEST",
          },
        ],
      },
    ];

    routes = routes.map((route) => {
      let newChildren = route?.children?.map((c) => {
        if (!c.allowed.includes(is_studentText)) {
          return {
            ...c,
            element: (
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Button type="primary">Back Home</Button>}
              />
            ),
          };
        }

        return c;
      });

      return { ...route, children: newChildren };
    });

    // // //Give only menu which the user is assigned to
    // routes = routes.filter((route) => {
    //   return route.keyCode === "GUEST";
    // });
    // // // //Give only menu which the user is assigned to
    // // routes = routes.map((route) => {

    // //   let newChildren = route?.children?.filter((c) => {
    // //     let isAllowed = menu_access?.find((menu) => {
    // //       return menu.menu_key_code === c.keyCode;
    // //     });

    // //     //We always allow GUEST keyCode because all of user type should access this routes, sample of this routes are, login resetpasswor and error 404 routes
    // //     return  c.keyCode === "GUEST";
    // //   });

    // //   return { ...route, children: newChildren };
    // // });

    return createBrowserRouter(routes);
  }, [is_student, is_studentText]);

  let isLightMode =
    background.color === "#fff" || background.color === "#dddddd";

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          components: {
            Switch: {
              colorPrimary: token.blue6,
              colorPrimaryHover: token.blue5,
              colorPrimaryBorder: token.blue4,

              colorTextQuaternary: token.green6,
              colorTextTertiary: token.green5,
              colorTextSecondary: token.green4,
            },
          },
          algorithm: isLightMode
            ? [theme.compactAlgorithm]
            : [theme.compactAlgorithm, theme.darkAlgorithm],

          token: {
            colorPrimary: primaryColor,
            // colorPrimary: "#00b96b",
            colorBgBase: background.color,
            // colorBgBase: "#15202b",
            fontFamily: "Poppins",
            colorLink: isLightMode ? "#1677ff" : "#4A90E2",

            colorLinkHover: isLightMode ? "#69b1ff" : "#357EC6",
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </div>
  );
}

export default App;
