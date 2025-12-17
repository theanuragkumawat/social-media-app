import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { useEffect } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
// import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { Post } from "../components";
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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { getCurrentUser } from "../utils/auth.js";
import { createPost } from "../utils/config";
import Navbar from "../components/Navbar";
import {login as storeLogin} from "../store/Auth/AuthSlice.js"
function Home() {
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state) => state.auth);

    const getUser = async () => {
        try {
          const response = await getCurrentUser();
          if (response) {
            console.log(response);
            dispatch(storeLogin(response.data.data));
          }
        } catch (error) {
          console.log(error);
        }
      };

    useEffect(() => {
      getUser();
    }, []);
  
  const [activeDialog, setActiveDialog] = useState(null);
  console.log(activeDialog);

  const time = "2d";
  const likes = 106437;
  const commentCount = 134;
  const imageUrl =
    "https://images.unsplash.com/photo-1696834137451-f52f471a58bc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  // Upload Post

  return (
    <>
          {/* //left */}
          {/* <Navbar/> */}
          <div className="middle-part col-span-12 lg:col-start-3 xl:col-start-4 xl:col-span-6 text-center mt-4">
            {/* stories */}
            <div className="flex justify-center">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 6,
                }}
                className="w-full max-w-xl"
              >
                <CarouselContent className={"py-1.5 border-none md:px-1"}>
                  {Array.from({ length: 40 }).map((_, index) => (
                    <CarouselItem
                      key={index}
                      className="basis-1/6 border-none outline-none py-5"
                    >
                      <div className="outline-0 border-0 ring-0">
                        <Card
                          className={
                            "rounded-full size-23 flex justify-center items-center border-none bg-transparent"
                          }
                        >
                          <CardContent className="aspect-square flex flex-col items-center justify-center bg-transparent border-none">
                            <div className="cursor-pointer active:scale-97 size-19 flex items-center justify-center rounded-full ring-3 ring-red-500 ring-offset-4 ring-offset-neutral-950 bg-sky-700">
                              {/* <span className="text-3xl font-semibold">{index+1}</span> */}
                              <img
                                className=" size-19 object-cover rounded-full select-none"
                                src="https://images.unsplash.com/photo-1696834137451-f52f471a58bc?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt=""
                              />
                            </div>
                              <p className="text-xs mt-2 text-neutral-50 select-none">palaksolanki</p>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className={
                    "hidden sm:flex ml-11 lg:ml-9 dark:bg-neutral-100 hover:dark:text-neutral-900 hover:dark:bg-neutral-300 text-neutral-950 size-7"
                  }
                />
                <CarouselNext
                  className={
                    "hidden sm:flex mr-11 lg:mr-9 dark:bg-neutral-100 hover:dark:text-neutral-900 hover:dark:bg-neutral-300 text-neutral-950 size-7"
                  }
                />
              </Carousel>
            </div>

            {/* posts */}
            <div className=" flex items-center justify-center flex-col mt-3">
              <Post
                user={{
                  username: "kedi.kopek.sevenler",
                  avatar:
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                time={time}
                imageUrl={imageUrl}
                likes={likes}
                commentCount={commentCount}
              />
              <Post
                user={{
                  username: "kedi.kopek.sevenler",
                  avatar:
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                time={time}
                imageUrl={
                  "https://images.unsplash.com/flagged/photo-1578288399681-afc560fdf8f8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                likes={likes}
                commentCount={commentCount}
              />
              <Post
                user={{
                  username: "kedi.kopek.sevenler",
                  avatar:
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                time={time}
                imageUrl={
                  "https://images.unsplash.com/photo-1758846182772-26919ad3c4cf?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                likes={likes}
                commentCount={commentCount}
              />
            </div>
          </div>
          <div className="right-part col-span-3 hidden xl:block lg:px-2 mt-2">
            <div className="flex flex-col justify-center">
              <div className="lg:w-70 flex flex-col gap-5">
                <div className="mt-8">
                  <UserCard
                    username={userData ? userData.username : "yuvisofficial"}
                    avatar={
                      "https://images.unsplash.com/photo-1648183185045-7a5592e66e9c?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    name={userData ? userData.fullname : "No name"}
                  />
                </div>
                <div className="flex justify-between">
                  <h3 className="text-sm text-neutral-300 font-semibold">
                    Suggested for you
                  </h3>
                  <button className="text-neutral-50 text-xs font-semibold hover:dark:text-neutral-400 cursor-pointer">
                    See All
                  </button>
                </div>
                <SuggestionCard
                  username={"nainaverma1062"}
                  avatar={
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  text={"Suggested for you"}
                />
                <SuggestionCard
                  username={"nainaverma1062"}
                  avatar={
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  text={"Suggested for you"}
                />
                <SuggestionCard
                  username={"nainaverma1062"}
                  avatar={
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  text={"Suggested for you"}
                />
                <SuggestionCard
                  username={"nainaverma1062"}
                  avatar={
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  text={"Suggested for you"}
                />
                <SuggestionCard
                  username={"nainaverma1062"}
                  avatar={
                    "https://plus.unsplash.com/premium_photo-1757423356231-4b51742cccf6?q=80&w=200&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  }
                  text={"Suggested for you"}
                />
              </div>
            </div>
          </div>
    </>
  );
}

function SuggestionCard({ username, avatar, text }) {
  return (
    <div className="w-full flex flex-row justify-between">
      <div className="flex flex-row gap-3">
        <img src={avatar} className="rounded-full size-10 object-cover" />
        <div className="">
          <p className="text-white font-semibold text-sm">{username}</p>
          <p className="text-neutral-300 text-xs">{text}</p>
        </div>
      </div>
      <div className="flex justify-center items-center text-xs">
        <button className="text-sky-400 font-semibold cursor-pointer hover:dark:text-sky-300">
          Follow
        </button>
      </div>
    </div>
  );
}

function UserCard({ username, avatar, name }) {
  return (
    <div className="w-full flex flex-row justify-between">
      <div className="flex flex-row gap-3">
        <img src={avatar} className="rounded-full size-10 object-cover" />
        <div className="">
          <p className="text-white font-semibold text-sm">{username}</p>
          <p className="text-neutral-300 text-xs">{name}</p>
        </div>
      </div>
      <div className="flex justify-center items-center text-xs">
        <button className="text-sky-400 font-semibold cursor-pointer hover:dark:text-sky-300">
          Switch
        </button>
      </div>
    </div>
  );
}


export default Home;
