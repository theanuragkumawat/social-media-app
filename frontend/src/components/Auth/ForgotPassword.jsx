import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ModeToggle } from "../theme/ModeToggle";
import { Lock } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

function ForgotPassword() {

    const navigate = useNavigate()
  const [dialogOpen, setDialogOpen] = useState(false);
  return (
    <>
      <Dialog
        modal={true}
        open={dialogOpen}

        // onOpenChange={() => setDialogOpen(false)}
      >
        <div className="h-screen flex items-center justify-center ">
          <div className="mb-40 w-full ">
            <div className="sm:border sm:px-8 sm:py-5">
              <div className="flex justify-center items-center">
                <Lock size={85} strokeWidth={0.75} />
              </div>
              <h3 className="text-center text-md font-semibold mt-0 mb-2">
                Forgot Password?
              </h3>
              <p className="text-sm text-center dark:text-gray-300 mb-2 leading-4.5">
                Enter your email and we'll send you a link to get back into your
                account.
              </p>
              <Input
                className={"placeholder:text-xs mb-3"}
                placeholder="Email"
              />

              <Button
                onClick={() => setDialogOpen(true)}
                size={"sm"}
                variant="main"
                className={"w-full cursor-pointer text-white"}
              >
                Send login link
              </Button>

              <Separator className={"my-5 relative"}>
                {/* The span is now positioned relative to the Separator */}
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background px-4 text-xs dark:text-gray-300">
                  OR
                </span>
              </Separator>
              <Button
                size={"sm"}
                className={
                  "w-full cursor-pointer text-gray-950 dark:text-white bg-transparent hover:bg-transparent hover:text-sky-400"
                }
              >
                <Link to="/signup">Create new account</Link>
              </Button>
            </div>
            <div className="sm:border sm:px-8 sm:py-4 mt-2">
              <div className="flex justify-center flex-col">
                <Link
                  to="/login"
                  className="cursor-pointer hover:underline underline-offset-1 dark:text-white text-sm text-center border-b-0 mx-auto"
                >
                  Back to login
                </Link>
              </div>
            </div>
            <div className="mt-6">
              <ModeToggle />
            </div>
          </div>
        </div>
        <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl">
          <DialogHeader>
            <DialogTitle className={"text-center"}>Email Sent</DialogTitle>
            <DialogDescription className={"text-center"}>
              We sent an email to anurag.kmwt7851@gmail.com with a link to get
              back into your account.
            </DialogDescription>
          </DialogHeader>
          <Separator className={"w-max z-50"} />
          <DialogFooter className={"flex !justify-center items-center"}>
            <DialogClose asChild>
              <button
                className="w-full dark:text-sky-500"
                onClick={() => {
                    setDialogOpen(false)
                }}
                type="button"
                variant="secondary"
              >
                OK
              </button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ForgotPassword;
