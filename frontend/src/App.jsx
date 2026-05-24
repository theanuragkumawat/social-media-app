import "./App.css";
import { io } from "socket.io-client"
import { ThemeProvider } from "./components/theme/ThemeProvider";
import { ModeToggle } from "./components/theme/ModeToggle";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createBrowserRouter, RouterProvider } from "react-router";
// import Router from "./Routes/Router";
import { useEffect } from "react";

import { login as storeLogin, setOnlineUsers } from "./store/Auth/AuthSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "./utils/auth.js";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Messages from "./pages/Messages.jsx";
import SelfProfile from "./pages/SelfProfile.jsx";
import UserProfile from "./pages/UserProfile.jsx";
import SettingsLayout from "./components/SettingsLayout.jsx";
import EditProfile from "./components/Auth/EditProfile.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import { connectSocket } from "./utils/socket.js";
function App() {
 const dispatch = useDispatch()
 const { userData, isLoggedIn } = useSelector((state) => state.auth);
    const getUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response) {
          console.log("Logged in data:",response);
          dispatch(storeLogin(response.data.data));
          const newSocket =  connectSocket(response.data.data._id);
          newSocket.on("getOnlineUsers", (userIds) => {
            dispatch(setOnlineUsers(userIds));
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getUser();
    }, []);

    
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
            element: <Messages/>,
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
    


  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={Router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
