import "./App.css";
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
import Login from "./components/Auth/Login";
import { RouterProvider } from "react-router";
import Router from "./Routes/Router";
import { useEffect } from "react";

import { login as storeLogin } from "./store/Auth/AuthSlice.js";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./utils/auth.js";
function App() {
 const dispatch = useDispatch()
    const getUser = async () => {
      try {
        const response = await getCurrentUser();
        if (response) {
          console.log("Logged in data:",response);
          dispatch(storeLogin(response.data.data));
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    useEffect(() => {
      getUser();
    }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={Router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
