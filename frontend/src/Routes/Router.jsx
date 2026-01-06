import { createBrowserRouter } from "react-router";
import { ForgotPassword, Home, Login, UserProfile, SelfProfile, Signup,  } from "../pages";
import Layout from "../components/Layout";
import SettingsLayout from "../components/SettingsLayout";
import EditProfile from "../components/Auth/EditProfile";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/search",
        element: <Home />,
      },
      {
        path: "/explore",
        element: <Home />,
      },
      {
        path: "/activity",
        element: <Home />,
      },
      {
        path: "/reels",
        element: <Home />,
      },
      {
        path: "/messages",
        element: <Home />,
      },
      {
        path: "/create",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <SelfProfile />,
      },
      {
        path: "/:username",
        element: <UserProfile />,
      },
      {
        path: "/accounts",
        element: <SettingsLayout />,
        children: [
          {
            path: "edit",
            element: <EditProfile />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);

export default Router;
