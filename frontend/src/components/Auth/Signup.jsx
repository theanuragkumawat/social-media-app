import React, { useState } from "react";
import axios from "../../utils/api.js";
import { signupUser, dobChangeUser, otpVerify} from "../../utils/auth.js";
import { Link, useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../theme/ModeToggle";
import { Cake, Loader, Mail } from "lucide-react";
import DOBPicker from "./Calender";
import { useForm } from "react-hook-form";

function Signup() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
  } = useForm();
  const [error, setError] = useState("");
  const [isloading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("register");
  const [date, setDate] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleDOBChange = (date) => {
    setDate(date);
  };

  const signup = async function (data) {
    setIsLoading(true)
    setError("");
    try {
      const response = await signupUser(data);
      if (response) {
        console.log(response);
        setUserData(response.data.data);
        setActiveTab("dob-register");
      }
    } catch (error) {
      if (error) {
        setError(error.response.data.message);
      }
      console.log(error);
    } finally{
      setIsLoading(false)
    }
  };

  const dobChange = async function (data) {
    setIsLoading(true)
    setError("");
    try {
      const response = await dobChangeUser({
        userId: userData?._id,
        dob: date,
      });
      if (response) {
        console.log(response);
        setActiveTab("email-confirmation");
      }
    } catch (error) {
      setError(error.response.data.message)
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  };

  const verify = async function (data) {
    setIsLoading(true)
    setError("");
    try {
      const response = await otpVerify(data);
      if (response) {
        console.log(response)
        navigate("/login")
      }
    } catch (error) {
      setError(error.response.data.message)
      console.log(error);
    }finally{
      setIsLoading(false)
    }
  };

  return (
    <div className="h-screen flex items-center justify-center ">
      <div className="2xl:mb-40 w-full ">
        {activeTab == "register" && (
          <>
            <div className="sm:border sm:px-8 sm:py-5">
              <h1 className="text-center font-anuraga text-5xl mb-4">
                SocialSnap
              </h1>
              <p className="dark:text-gray-300 text-sm text-center">
                Sign up to see photos and videos from your friends.
              </p>
              <Separator className={"my-5 relative"}>
                {/* The span is now positioned relative to the Separator */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background px-4 text-xs dark:text-gray-300">
                  OR
                </span>
              </Separator>

              <form onSubmit={handleSubmit(signup)}>
                <Input
                  className={"placeholder:text-xs mb-3"}
                  placeholder="Email"
                  type={"email"}
                  {...register("email", { required: true })}
                />
                <Input
                  className={"placeholder:text-xs mb-3"}
                  placeholder="Password"
                  type={"password"}
                  {...register("password", { required: true })}
                />
                <Input
                  className={"placeholder:text-xs mb-3"}
                  placeholder="Fullname"
                  type={"text"}
                  {...register("fullname", { required: true })}
                />
                <Input
                  className={"placeholder:text-xs mb-3"}
                  placeholder="Username"
                  type={"text"}
                  {...register("username", { required: true })}
                />
                {/* error display */}
                {error && (
                  <p className="text-red-500 text-xs mb-2 text-center">
                    {error}
                  </p>
                )}

                <Button
                  type="submit"
                  size={"sm"}
                  variant="main"
                  className={"w-full cursor-pointer text-white"}
                >
                  {
                    isloading ? <Loader className="motion-safe:animate-spin" /> : "Sign up"
                  }
                </Button>
              </form>
            </div>
            <div className="sm:border sm:px-8 sm:py-4 mt-2">
              <div className="flex justify-center flex-col">
                <p className="inline-block text-sm text-center border-b-0 mx-auto">
                  Have an account?
                </p>
                <Link
                  to="/login"
                  className="cursor-pointer hover:underline underline-offset-1 text-sky-500 text-sm text-center border-b-0 mx-auto"
                >
                  Log in
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <ModeToggle />
            </div>
          </>
        )}
        {activeTab == "dob-register" && (
          <>
            <div className="sm:border sm:px-8 sm:py-2">
              <div className="flex items-center justify-center -rotate-6">
                <Cake size={95} strokeWidth={0.75} />
              </div>
              <h3 className="text-center text-md font-semibold mt-0 mb-3">
                Add Your Birthday
              </h3>
              <p className="text-sm text-center">
                This won't be a part of your public profile.
              </p>
              <p className="text-sm text-center text-sky-500 cursor-pointer">
                Why do i need to provide my birthday?
              </p>

              <div className="flex items-center justify-center my-3">
                <DOBPicker onChange={handleDOBChange} value={date} />
              </div>
              <p className="text-xs text-center dark:text-gray-300 mb-2 ">
                You need to enter the date you were born
              </p>
              {error && (
                  <p className="text-red-500 text-xs mb-2 text-center">
                    {error}
                  </p>
                )}
              <Button
                onClick={dobChange}
                size={"sm"}
                variant="main"
                className={"w-full cursor-pointer text-white mb-1"}
              >
                
                {
                    isloading ? <Loader className="motion-safe:animate-spin" /> : "Next"
                  }
              </Button>
              <Button
                onClick={() => {
                  setActiveTab("register");
                }}
                size={"sm"}
                className={
                  "w-full cursor-pointer text-sky-500 bg-transparent hover:bg-transparent hover:text-sky-400"
                }
              >
                Go back
              </Button>
            </div>
            <div className="sm:border sm:px-8 sm:py-4 flex flex-col justify-center items-center mt-2">
              <p className="inline-block text-sm text-center border-b-0 mx-auto">
                Have an account?
              </p>
              <Link
                to="/login"
                className="cursor-pointer hover:underline underline-offset-1 text-sky-500 text-sm text-center border-b-0 mx-auto"
              >
                Log in
              </Link>
            </div>
          </>
        )}
        {activeTab == "email-confirmation" && (
          <>
            <div className="sm:border sm:px-8 sm:py-2">
              <div className="flex items-center justify-center">
                <Mail size={95} strokeWidth={0.75} />
              </div>
              <h3 className="text-center text-md font-semibold mt-0 mb-3">
                Enter Confirmation Code
              </h3>
              <p className="text-sm text-center">
                Enter the confirmation code we sent to
                anurag.kmwt7851@gmail.com.
              </p>
              <p className="text-sm text-center text-sky-500 cursor-pointer">
                Resend Code
              </p>
              <form onSubmit={handleSubmit(verify)}>
                <div className="flex items-center justify-center mt-3">
                  <Input
                  type={"text"}
                    className={"placeholder:text-xs mb-3"}
                    placeholder="Confirmation Code"
                    {...register("otp", { required: true })}
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-xs mb-2 text-center">
                    {error}
                  </p>
                )}
                <Button
                  size={"sm"}
                  variant="main"
                  className={"w-full cursor-pointer text-white"}
                >
                  {
                    isloading ? <Loader className="motion-safe:animate-spin" /> : "Next"
                  }
                </Button>
              </form>
              <Button
                onClick={() => {
                  setActiveTab("dob-register");
                }}
                size={"sm"}
                className={
                  "mt-1 w-full cursor-pointer text-sky-500 bg-transparent hover:bg-transparent hover:text-sky-400"
                }
              >
                Go back
              </Button>
            </div>
            <div className="sm:border sm:px-8 sm:py-4 flex flex-col justify-center items-center mt-2">
              <p className="inline-block text-sm text-center border-b-0 mx-auto">
                Have an account?
              </p>
              <Link
                to="/login"
                className="cursor-pointer hover:underline underline-offset-1 text-sky-500 text-sm text-center border-b-0 mx-auto"
              >
                Log in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
