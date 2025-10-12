import { createBrowserRouter } from "react-router";
import { ForgotPassword, Home, Login,Signup } from "../pages";

const Router = createBrowserRouter([
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
    element: <Home />,
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
  // Add more routes as needed
]);

export default Router;