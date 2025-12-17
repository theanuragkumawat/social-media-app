import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../theme/ModeToggle";
import { useForm } from "react-hook-form";
import { loginUser } from "../../utils/auth.js";
import { Loader } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux'
import { login as storeLogin } from "../../store/Auth/AuthSlice.js";

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {isLoggedIn,userData} = useSelector(state => state.auth)
  const {
    register,
    handleSubmit,
    watch,
  } = useForm();
  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const login = async function (data) {
    setIsLoading(true);
    setError("");
    try {
      const response = await loginUser(data);
      if (response) {
        console.log(response);
        dispatch(storeLogin(response.data.data.user))
        navigate("/")
      }
    } catch (error) {
      setError(error.response.data.message);
      console.log(error);
      
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center">
      <div className="lg:mb-40">
        <h1 className="text-center font-anuraga text-5xl mb-7">SocialSnap</h1>
        <form onSubmit={handleSubmit(login)}>
          <Input
            className={"placeholder:text-xs mb-2"}
            placeholder="Enter your email"
            type={"email"}
            {...register("email", { required: true })}
          />
          <Input
            className={"placeholder:text-xs mb-3"}
            placeholder="Enter your password"
            type={"password"}
            {...register("password", { required: true })}
          />
          {error && (
            <p className="text-red-500 text-xs mb-2 text-center">{error}</p>
          )}
          <Button
            size={"sm"}
            variant="main"
            className={"w-full cursor-pointer text-white"}
            type={"submit"}
          >
            {isloading ? (
              <Loader className="motion-safe:animate-spin" />
            ) : (
              "Log in"
            )}
          </Button>
        </form>
        <Separator className={"my-4 relative"}>
          {/* The span is now positioned relative to the Separator */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 dark:bg-background px-4 text-xs dark:text-gray-300">
            OR
          </span>
        </Separator>
        <div className="flex justify-center mt-3">
          <Link
            to="/forgot-password"
            className="inline-block cursor-pointer text-sm font-semibold text-center hover:underline underline-offset-1 mx-auto"
          >
            Forgot password?
          </Link>
        </div>
        <div className="flex justify-center mt-8">
          <p className="inline-block text-sm text-center border-b-0 mx-auto">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="cursor-pointer hover:underline underline-offset-1 text-sky-500"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="mt-6">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}

export default Login;
