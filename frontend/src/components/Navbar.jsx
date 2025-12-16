import React, { useState } from "react";
import {
  House,
  Search,
  Compass,
  CirclePlus,
  Clapperboard,
  MessageSquareText,
  Heart,
  User,
  ImagePlay,
  Aperture,
  Radio,
  XIcon,
  Images,
  Loader,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import { GoHome, GoHomeFill } from "react-icons/go";
import { MdExplore, MdOutlineExplore } from "react-icons/md";
import { IoSearchOutline, IoSearch } from "react-icons/io5";
import { PiFilmSlateDuotone, PiFilmSlateFill } from "react-icons/pi";
import { RiMessage3Line, RiMessage3Fill } from "react-icons/ri";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { PiPlusCircleBold } from "react-icons/pi";
import { RiUser3Line, RiUser3Fill } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { createPost } from "../utils/config";

function Navbar() {
  const navItems = [
    {
      icon: GoHome,
      fillIcon: GoHomeFill,
      name: "Home",
      to: "/",
    },
    {
      icon: IoSearchOutline,
      fillIcon: IoSearch,
      name: "Search",
      to: "/search",
    },
    {
      icon: MdOutlineExplore,
      fillIcon: MdExplore,
      name: "Explore",
      to: "/explore",
    },
    {
      icon: PiFilmSlateDuotone,
      fillIcon: PiFilmSlateFill,
      name: "Reels",
      to: "/reels",
    },
    {
      icon: RiMessage3Line,

      fillIcon: RiMessage3Fill,
      name: "Messages",
      to: "/messages",
    },
    {
      icon: FaRegHeart,

      fillIcon: FaHeart,
      name: "Notifications",
      to: "/activity",
    },
    {
      icon: PiPlusCircleBold,

      fillIcon: PiPlusCircleBold,
      name: "Create",
      to: "/create",
    },
    {
      icon: RiUser3Line,

      fillIcon: RiUser3Fill,
      name: "Profile",
      to: "/profile",
    },
    {
      icon: RxHamburgerMenu,

      fillIcon: RxHamburgerMenu,
      name: "More",
      to: "/more",
    },
  ];
  const { isLoggedIn, userData } = useSelector((state) => state.auth);

  const [activeDialog, setActiveDialog] = useState(null);

  return (
    <>
    
    <div className="hidden lg:block lg:col-span-2" ></div>
    
      <div className="left-part hidden md:block border-r h-screen pt-4 box-border fixed lg:w-[16.6667%]" >
        <div className="pl-2 pr-2 lg:pl-4 mt-7">
          <div>
            <h2 className="ml-2 text-3xl font-anuraga font-medium hidden lg:block">
              SocialSnap
            </h2>
          </div>
          <div className="flex flex-col gap-2 mt-3 md:mt-9">
            <NavLink
              className={
                "px-2 flex flex-row items-center justify-center gap-2.5"
              }
            >
              <h2 className="text-3xl font-anuraga font-medium lg:hidden">S</h2>
            </NavLink>
            {navItems.map((item) => {
              return (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger
                    asChild
                    className={"active:scale-96 rounded-xl px-2"}
                  >
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        `${
                          isActive ? "dark:text-neutral-50" : ""
                        } flex flex-row items-center gap-2.5 hover:dark:bg-neutral-800 py-2.5 pl-2`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="">
                            {isActive ? (
                              <item.fillIcon className="size-6.5 box-border" />
                            ) : (
                              <item.icon className="size-6.5 box-border" />
                            )}
                          </div>
                          <h3
                            className={`${
                              isActive ? "font-bold" : ""
                            } text-md hidden lg:block`}
                          >
                            {item.name}
                          </h3>
                        </>
                      )}
                    </NavLink>
                  </DropdownMenuTrigger>
                  {item.to == "/create" && (
                    <DropdownMenuContent className={"w-45 p-1.5 rounded-sm "}>
                      <DropdownMenuItem
                        className={"h-10 "}
                        onSelect={() =>
                          activeDialog == null && setActiveDialog("post")
                        }
                      >
                        <div className="flex flex-row justify-between w-full dark:text-neutral-50">
                          <span>Post</span>
                          <span className="flex justify-center items-center">
                            <ImagePlay
                              className="dark:text-neutral-50 size-5"
                              strokeWidth={2}
                            />
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={"h-10"}
                        onSelect={() => setActiveDialog("story")}
                      >
                        <div className="flex flex-row justify-between w-full dark:text-neutral-50">
                          <span>Story</span>
                          <span className="flex justify-center items-center">
                            <Aperture
                              className="dark:text-neutral-50 size-5"
                              strokeWidth={2}
                            />
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={"h-10"}
                        onSelect={() => setActiveDialog("reel")}
                      >
                        <div className="flex flex-row justify-between w-full dark:text-neutral-50">
                          <span>Reel</span>
                          <span className="flex justify-center items-center">
                            <Clapperboard
                              className="dark:text-neutral-50 size-5"
                              strokeWidth={2}
                            />
                          </span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className={"h-10"}
                        onSelect={() => setActiveDialog("live")}
                      >
                        <div className="flex flex-row justify-between w-full dark:text-neutral-50">
                          <span>Live Video</span>
                          <span className="flex justify-center items-center">
                            <Radio
                              className="dark:text-neutral-50 size-5"
                              strokeWidth={2}
                            />
                          </span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  )}
                </DropdownMenu>
              );
            })}

            {/* Dialog components */}
            <Dialog
              modal={true} // low opacity black background
              open={activeDialog === "post"}
              className={"p-0"}
              // onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}
            >
              <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl p-0">
                <PostWizard setActiveDialog={setActiveDialog} />
              </DialogContent>
            </Dialog>
            <Dialog
              modal={true} // low opacity black background
              open={activeDialog === "story"}
              className={"p-0"}
              // onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}
            >
              <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl p-0">
                <XIcon
                  className="right-0 top-0 absolute mr-2 mt-2 size-6"
                  onClick={() => {
                    setActiveDialog(null);
                  }}
                />
                <DialogHeader className={"gap-0"}>
                  <DialogTitle
                    className={
                      "text-center bg-neutral-950 py-2 rounded-t-3xl text-base"
                    }
                  >
                    Create new Story
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                  <div className={"text-center my-19"}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-center items-center ">
                        <Images
                          className="dark:text-neutral-50"
                          size={80}
                          strokeWidth={0.9}
                        />
                      </div>
                      <div>
                        <h3 className=" dark:text-neutral-50 text-lg">
                          Drag photos and videos here
                        </h3>
                      </div>
                      <div>
                        <button className="bg-sky-600 rounded-lg px-3 py-1.5 dark:text-neutral-50 text-sm font-semibold">
                          Select from Device
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog
              modal={true} // low opacity black background
              open={activeDialog === "reel"}
              className={"p-0"}
              // onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}
            >
              <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl p-0">
                <XIcon
                  className="right-0 top-0 absolute mr-2 mt-2 size-6"
                  onClick={() => {
                    setActiveDialog(null);
                  }}
                />
                <DialogHeader className={"gap-0"}>
                  <DialogTitle
                    className={
                      "text-center bg-neutral-950 py-2 rounded-t-3xl text-base"
                    }
                  >
                    Create new Reel
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                  <div className={"text-center my-19"}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-center items-center ">
                        <Images
                          className="dark:text-neutral-50"
                          size={80}
                          strokeWidth={0.9}
                        />
                      </div>
                      <div>
                        <h3 className=" dark:text-neutral-50 text-lg">
                          Drag photos and videos here
                        </h3>
                      </div>
                      <div>
                        <button className="bg-sky-600 rounded-lg px-3 py-1.5 dark:text-neutral-50 text-sm font-semibold">
                          Select from Device
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <Dialog
              modal={true} // low opacity black background
              open={activeDialog === "live"}
              className={"p-0"}
              // onOpenChange={(isOpen) => !isOpen && setActiveDialog(null)}
            >
              <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl p-0">
                <XIcon
                  className="right-0 top-0 absolute mr-2 mt-2 size-6"
                  onClick={() => {
                    setActiveDialog(null);
                  }}
                />
                <DialogHeader className={"gap-0"}>
                  <DialogTitle
                    className={
                      "text-center bg-neutral-950 py-2 rounded-t-3xl text-base"
                    }
                  >
                    Go Live
                  </DialogTitle>
                  <DialogDescription></DialogDescription>
                  <div className={"text-center my-19"}>
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-center items-center ">
                        <Images
                          className="dark:text-neutral-50"
                          size={80}
                          strokeWidth={0.9}
                        />
                      </div>
                      <div>
                        <h3 className=" dark:text-neutral-50 text-lg">
                          Drag photos and videos here
                        </h3>
                      </div>
                      <div>
                        <button className="bg-sky-600 rounded-lg px-3 py-1.5 dark:text-neutral-50 text-sm font-semibold">
                          Select from Device
                        </button>
                      </div>
                    </div>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
          <div></div>
        </div>
      </div>
      
   </>
  );
}

function PostWizard({ setActiveDialog }) {
  const steps = ["Upload", "Details"];
  const [activeStep, setActiveStep] = useState(0);

  const next = () => setActiveStep((prev) => prev + 1);
  const back = () => setActiveStep((prev) => prev - 1);

  const [files, setFiles] = useState([]);
  console.log(files);

  const handleChange = (e) => {
    setFiles([...e.target.files]);
  };

  return (
    <>
      {/* <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper> */}

      {activeStep === 0 && (
        <UploadStep
          onNext={next}
          setActiveDialog={setActiveDialog}
          files={files}
          setFiles={setFiles}
          handleChange={handleChange}
        />
      )}
      {activeStep === 1 && (
        <DetailsStep
          setActiveDialog={setActiveDialog}
          onBack={back}
          files={files}
        />
      )}
    </>
  );
}

function UploadStep({
  onNext,
  setActiveDialog,
  files,
  setFiles,
  handleChange,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e) => {
    e.preventDefault(); // This is crucial
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files; // Get files from the drop event
    if (droppedFiles && droppedFiles.length > 0) {
      const newFiles = Array.from(droppedFiles);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]); // Add to existing files
    }
  };

  const removeFile = (indexToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className={`${isDragging ? "dark:bg-sky-800/20" : ""}  rounded-3xl`}>
      <XIcon
        className="right-0 top-0 absolute mr-2 mt-2 size-6"
        onClick={() => {
          setActiveDialog(null);
        }}
      />
      <DialogHeader className={"gap-0"}>
        <DialogTitle
          className={
            "text-center dark:bg-neutral-950 py-2 rounded-t-3xl text-base"
          }
        >
          Create new post
        </DialogTitle>
        <DialogDescription></DialogDescription>
        <div className={"text-center my-19 00"}>
          {files && files.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-3.5 justify-center">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      className="w-32 h-32 object-cover rounded-sm"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="top-0.5 right-0.5 absolute border-2"
                    >
                      <XIcon className="size-6 dark:text-neutral-50" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col gap-3 ">
                <div>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </div>  
                <label
                  htmlFor="file-upload"
                  className=""
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="flex justify-center items-center ">
                    <Images
                      className={`${
                        isDragging
                          ? "dark:text-sky-600"
                          : "dark:text-neutral-50"
                      }`}
                      size={80}
                      strokeWidth={0.9}
                    />
                  </div>
                  <div>
                    <h3 className=" dark:text-neutral-50 text-lg">
                      Drag photos and videos here
                    </h3>
                  </div>
                  <div className="mt-3 flex justify-center items-center">
                    <p className="bg-sky-600 rounded-lg px-3 py-1.5 dark:text-neutral-50 text-sm font-semibold w-40 active:dark:scale-98 cursor-pointer">
                      Select from Device
                    </p>
                  </div>
                </label>
              </div>
            </>
          )}
        </div>
        {files && files.length > 0 && (
            <div className="flex justify-end">

          <button
            onClick={onNext}
            disabled={false}
            className={" hover:bg-transparent cursor-pointer w-fit pr-4 pb-2"}
            >
            <span className={"dark:text-sky-500 text-sm hover:underline underline-offset-2"}>Next</span>
          </button>
              </div>
        )}
      </DialogHeader>
    </div>
  );
}

function DetailsStep({ onBack, files, setActiveDialog }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [caption, setCaption] = useState("");

  const handleSubmit = async () => {
    setIsDisabled(true);
    const formData = new FormData();

    formData.append("caption", caption);
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        // Use the *same key* ('images' in this case)
        formData.append("media", files[i]);
      }
    }

    try {
      const response = await createPost(formData);
      if (response) {
        console.log(response);
        setActiveDialog(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <textarea
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        className="w-full p-2 rounded-lg dark:bg-neutral-800 dark:text-neutral-50 text-sm "
        placeholder="Write a caption, add mentions or hashtags..."
        rows={4}
      />
      <div className="flex justify-between">
        <Button
          onClick={onBack}
          className="text-sm font-semibold hover:underline underline-offset-2 dark:text-sky-500 cursor-pointer bg-transparent p-0 h-full hover:bg-transparent"
          disabled={isDisabled}
        >
          <span className={""}>Back</span>
        </Button>
        <Button
          onClick={handleSubmit}
          className={
            "text-sm font-semibold hover:underline underline-offset-2 dark:text-sky-500 cursor-pointer bg-transparent p-0 h-full hover:bg-transparent"
          }
          disabled={isDisabled}
        >
          Share
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
