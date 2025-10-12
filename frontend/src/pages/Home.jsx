import React, { useState } from "react";
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
import { useSelector } from "react-redux";

function Home() {
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
  console.log(activeDialog);

  const time = "2d";
  const likes = 106437;
  const commentCount = 134;
  const imageUrl =
    "https://images.unsplash.com/photo-1696834137451-f52f471a58bc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <>
      <div className="">
        <div className="grid grid-cols-12 divide-neutral-800 gap-1">
          <div className="left-part md:col-span-2 hidden md:block fixed border-r h-screen mt-4">
            <div className="pl-4 pr-4 mt-7 lg:w-3xs">
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
                  <h2 className="text-3xl font-anuraga font-medium lg:hidden">
                    S
                  </h2>
                </NavLink>
                {navItems.map((item) => {
                  return (
                    <DropdownMenu key={item.name}>
                      <DropdownMenuTrigger>
                        <NavLink
                          key={item.name}
                          to={item.to}
                          className={({ isActive }) =>
                            `${
                              isActive ? "dark:text-neutral-50" : ""
                            } flex flex-row items-center gap-2.5 hover:dark:bg-neutral-800 py-2.5 px-2 rounded-xl active:scale-96`
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
                        {item.to == "/create" && (
                          <DropdownMenuContent
                            className={"w-45 p-1.5 rounded-sm "}
                          >
                            <DropdownMenuItem
                              className={"h-10 "}
                              onSelect={() => setActiveDialog("post")}
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
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  );
                })}

                {/* Dialog components */}
                <Dialog
                  modal={true} // low opacity black background
                  open={activeDialog === "post"}
                  className={'p-0'}
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
                      <DialogTitle className={"text-center bg-neutral-950 py-2 rounded-t-3xl"}>
                        <h3 className="text-base ">
                          Create new post
                          </h3>
                      </DialogTitle>
                      <DialogDescription className={"text-center my-19"}>
                        <div className="flex flex-col gap-4">
                          <div className="flex justify-center items-center ">
                            <Images className="dark:text-neutral-50" size={80} strokeWidth={0.9} />
                          </div>
                          <div>
                            <h3 className=" dark:text-neutral-50 text-lg">Drag photos and videos here</h3>
                          </div>
                          <div>
                            <button className="bg-sky-600 rounded-lg px-3 py-1.5 dark:text-neutral-50 text-sm font-semibold">Select from Device</button>
                          </div>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    {/* <Separator className={"w-max z-50"} />
                    <DialogFooter
                      className={"flex !justify-center items-center"}
                    >
                      <DialogClose asChild>
                        <button
                          className="w-full dark:text-sky-500"
                          onClick={() => {
                            setActiveDialog(null);
                          }}
                          type="button"
                          variant="secondary"
                        >
                          OK
                        </button>
                      </DialogClose>
                    </DialogFooter> */}
                  </DialogContent>
                </Dialog>
                <Dialog
                  modal={true}
                  open={activeDialog === "story"}
                  // onOpenChange={(isOpen) => isOpen && setActiveDialog(null)}
                >
                  <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl">
                    <XIcon
                      className="right-0 top-0 absolute mr-2 mt-2 size-6"
                      onClick={() => {
                        setActiveDialog(null);
                      }}
                    />
                    <DialogHeader>
                      <DialogTitle className={"text-center"}>
                        Email Sent
                      </DialogTitle>
                      <DialogDescription className={"text-center"}>
                        We sent an email to anurag.kmwt7851@gmail.com with a
                        link to get back into your account.
                      </DialogDescription>
                    </DialogHeader>
                    <Separator className={"w-max z-50"} />
                    <DialogFooter
                      className={"flex !justify-center items-center"}
                    >
                      <DialogClose asChild>
                        <button
                          className="w-full dark:text-sky-500"
                          onClick={() => {
                            setActiveDialog(null);
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
                <Dialog
                  modal={true}
                  open={activeDialog === "reel"}
                  // onOpenChange={(isOpen) => isOpen && setActiveDialog(null)}
                >
                  <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl">
                    <XIcon
                      className="right-0 top-0 absolute mr-2 mt-2 size-6"
                      onClick={() => {
                        setActiveDialog(null);
                      }}
                    />
                    <DialogHeader>
                      <DialogTitle className={"text-center"}>
                        Email Sent
                      </DialogTitle>
                      <DialogDescription className={"text-center"}>
                        We sent an email to anurag.kmwt7851@gmail.com with a
                        link to get back into your account.
                      </DialogDescription>
                    </DialogHeader>
                    <Separator className={"w-max z-50"} />
                    <DialogFooter
                      className={"flex !justify-center items-center"}
                    >
                      <DialogClose asChild>
                        <button
                          className="w-full dark:text-sky-500"
                          onClick={() => {
                            setActiveDialog(null);
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
                <Dialog
                  modal={true}
                  open={activeDialog === "live"}
                  // onOpenChange={(isOpen) => isOpen && setActiveDialog(null)}
                >
                  <DialogContent className="sm:max-w-md dark:bg-neutral-900 rounded-3xl">
                    <XIcon
                      className="right-0 top-0 absolute mr-2 mt-2 size-6"
                      onClick={() => {
                        setActiveDialog(null);
                      }}
                    />
                    <DialogHeader>
                      <DialogTitle className={"text-center"}>
                        Email Sent
                      </DialogTitle>
                      <DialogDescription className={"text-center"}>
                        We sent an email to anurag.kmwt7851@gmail.com with a
                        link to get back into your account.
                      </DialogDescription>
                    </DialogHeader>
                    <Separator className={"w-max z-50"} />
                    <DialogFooter
                      className={"flex !justify-center items-center"}
                    >
                      <DialogClose asChild>
                        <button
                          className="w-full dark:text-sky-500"
                          onClick={() => {
                            setActiveDialog(null);
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
              </div>
              <div></div>
            </div>
          </div>
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
                      className="basis-1/6 border-none outline-none"
                    >
                      <div className="outline-0 border-0 ring-0">
                        <Card
                          className={
                            "rounded-full size-23 flex justify-center items-center border-none bg-transparent"
                          }
                        >
                          <CardContent className="aspect-square flex items-center justify-center bg-transparent border-none">
                            <div className="size-19 flex items-center justify-center rounded-full ring-3 ring-rose-600 ring-offset-2 ring-offset-white bg-sky-700">
                              {/* <span className="text-3xl font-semibold">{index+1}</span> */}
                              <img
                                className=" size-19 object-cover rounded-full"
                                src="https://images.unsplash.com/photo-1696834137451-f52f471a58bc?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt=""
                              />
                            </div>
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
