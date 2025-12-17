import React from "react";
import {
  ChevronDown,
  Clapperboard,
  Contact,
  Eye,
  Grid3x3,
  Heart,
  MessageCircle,
  UserPlus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router";
import { useEffect } from "react";
import { getUserProfile } from "../utils/config";
import { useSelector, useDispatch } from "react-redux";
import { login as storeLogin } from "../store/Auth/AuthSlice.js";

function Profile() {
  const dispatch = useDispatch();
  
  const getUserProfileInfo = async () => {
    try {
      const response = await getUserProfile();
      if (response) {
        dispatch(storeLogin(response.data.data));
        console.log(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  useEffect(() => {
    getUserProfileInfo();
  }, []);
  
  const userData = useSelector(state => state.auth.userData);
  return (
    <>
      <div className="col-span-12  md:col-span-10 md:col-start-3 lg:col-span-9 lg:col-start-4 xl:col-span-10 xl:col-start-3 mt-4">
        <div className="flex justify-center items-center   flex-col w-full">
          <UserOwnProfile userData={userData} />
        </div>
        <UserUploads />
      </div>
    </>
  );
}

const UserOwnProfile = function ({userData}) {
  return (
    <>
      <div className="flex flex-row mt-6 gap-6 sm:w-xl">
        <div className="active:scale-97 cursor-pointer flex justify-center lg:items-center flex-shrink-0 ">
          <div className="ring-3 ring-rose-600 ring-offset-4 ring-offset-neutral-950 rounded-full size-20 md:size-30 lg:size-40 object-cover  flex-[0_0_5rem] md:flex-[0_0_7.5rem] lg:flex-[0_0_10rem]">
            <img
              src={
                userData && userData.avatar && userData.avatar != ""
                  ? userData.avatar
                  : "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-transparent-600nw-2534623311.jpg"
              }
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col mb-3">
            <h2 className="text-md font-bold sm:text-2xl sm:font-extrabold mb-1 dark:text-white">
              {userData ? userData?.username : "username"}
            </h2>
            <h3 className="hidden sm:block text-sm mb-2">{userData ? userData?.fullname : "Full name"}</h3>
            <div className="flex flex-row gap-4 text-sm">
              <p className="">
                <span className="font-semibold text-sm">567</span> posts
              </p>
              <p className="cursor-pointer active:dark:text-neutral-400">
                <span className="font-semibold text-sm ">{userData ? userData.followersCount : "1"}</span> followers
              </p>
              <p className="cursor-pointer active:dark:text-neutral-400">
                <span className="font-semibold text-sm ">{userData ? userData.followingCount : "1"}</span> following
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="!whitespace-pre-line text-sm">  
              {`${userData ? userData.bio : ""}`}
            </p>

            <p className="text-sm mt-1.5">
              Followed by{" "}
              <span className="font-bold">rjabhinavv, jitendrak1</span> + 2 more
            </p>
          </div>
        </div>
      </div>

      <div className=" flex lg:hidden  flex-col sm:w-xl mt-6">
        <h3 className="sm:hidden text-sm mb-1 font-bold w-fit"> 
          {userData ? userData?.fullname : "Full name"}
        </h3>
        <p className="!whitespace-pre-line text-sm">  
              {`${userData ? userData.bio : ""}`}
            </p>

        <p className="text-sm mt-1.5">
          Followed by <span className="font-bold">rjabhinavv, jitendrak1</span>{" "}
          + 2 more
        </p>
      </div>

      <div className="flex flex-row w-full gap-1.5 mt-6 max-w-xl">
        <Link
          to="/accounts/edit"
          className="cursor-pointer font-bold py-2.5 dark:bg-gray-700 hover:dark:bg-gray-600 active:scale-98 text-sm rounded-lg w-full flex justify-center items-center"
        >
          Edit Profile
        </Link>
        <button className="cursor-pointer font-bold py-2.5 dark:bg-gray-700 hover:dark:bg-gray-600 active:scale-98 text-sm rounded-lg w-full">
          View Archive
        </button>
      </div>
      {/* Highlites */}
      <div className="mt-10 md:gap-1  max-w-full">
        <Carousel
          className=" max-w-xl "
          opts={{
            align: "start",
            slidesToScroll: 6,
          }}
        >
          <CarouselContent className="-ml-1 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7].map((item, index) => (
              <CarouselItem
                key={index}
                className={"pl-1 sm:basis-1/6 basis-1/5"}
              >
                <div className="p-0 md:p-3 w-fit">
                  <Card className="bg-transparent border-none w-fit">
                    <CardContent className="px-0 flex flex-col items-center">
                      <div className="pb-4 cursor-pointer active:scale-97 text-center">
                        <div className="mx-auto w-15 h-15 md:w-20 md:h-20 ring-3 ring-offset-3 ring-offset-neutral-950 ring-neutral-600 rounded-full">
                          <img
                            className="w-full h-full object-cover rounded-full select-none"
                            src="https://images.unsplash.com/photo-1696834137457-8872b6c525f4?..."
                          />
                        </div>

                        <p className="text-center text-xs font-semibold text-neutral-50 mt-3">
                          Meetup
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className={"hidden sm:flex z-30"} />

          <CarouselNext className={"hidden sm:flex"} />
        </Carousel>
      </div>

      {/* posts */}
    </>
  );
};

function UserUploads() {
  return (
    <div className="mt-8 w-full lg:px-10 xl:px-30 2xl:px-50">
      <Tabs defaultValue="posts" className={"w-full bg-transparent"}>
        <TabsList className={"w-xs sm:w-sm md:w-md mx-auto bg-transparent"}>
          <TabsTrigger
            className={
              "border-none !bg-transparent group cursor-pointer active:!text-neutral-500"
            }
            value="posts"
          >
            <div className="flex flex-col justify-center">
              <p>
                <Grid3x3 className="inline-block mb-2" />
              </p>
              <p className="w-16 h-0.5 bg-neutral-50 hidden group-data-[state=active]:block"></p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            className={
              "border-none !bg-transparent group cursor-pointer active:!text-neutral-500"
            }
            value="reels"
          >
            <div className="flex flex-col justify-center">
              <p>
                <Clapperboard className="inline-block mb-2" />
              </p>
              <p className="w-16 h-0.5 bg-neutral-50 hidden group-data-[state=active]:block"></p>
            </div>
          </TabsTrigger>
          <TabsTrigger
            className={
              "border-none !bg-transparent group cursor-pointer active:!text-neutral-500"
            }
            value="mentioned"
          >
            <div className="flex flex-col justify-center">
              <p>
                <Contact className="inline-block mb-2" />
              </p>
              <p className="w-16 h-0.5 bg-neutral-50 hidden group-data-[state=active]:block"></p>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className={" w-full"}>
          <>
            <h2 className="text-center font-bold">Posts</h2>
            <div className="grid grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-0.5">
              <PostCard
                url={
                  "https://images.unsplash.com/photo-1696834137467-e1827c4e400e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
                }
              />
              <PostCard
                url={
                  "https://images.unsplash.com/photo-1760720232713-a60c6a8fb981?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=715"
                }
              />
              <PostCard
                url={
                  "https://images.unsplash.com/photo-1760715658357-57df8f045b8e?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                }
              />
              <PostCard
                url={
                  "https://images.unsplash.com/photo-1760681554254-f8e6f8e2f482?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                }
              />
              <PostCard
                url={
                  "https://images.unsplash.com/photo-1760648149145-560e619098ef?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470"
                }
              />
              <PostCard
                url={
                  "https://images.unsplash.com/photo-1760696156052-71af50b8b269?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=690"
                }
              />
              <PostCard
                url={`https://images.unsplash.com/photo-1664651205193-bfb6bfdd3b09?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470`}
              />
            </div>
          </>
        </TabsContent>
        <TabsContent value="reels" className={"border-1 border-amber-600"}>
          <>
            <h2 className="text-center font-bold">Reels</h2>
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 3xl:grid-cols-5 gap-0.5">
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1736536205394-e949c13d9859?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0OHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1744039016480-1d95040fa25d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1747592771443-e15f155b1faf?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1759434188986-58432949b5a4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=698"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1731531992660-d63e738c0b05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1731531992660-d63e738c0b05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1731531992660-d63e738c0b05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500"
                }
              />
              <ReelCard
                url={
                  "https://images.unsplash.com/photo-1731531992660-d63e738c0b05?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=60&w=500"
                }
              />
            </div>
          </>
        </TabsContent>
        <TabsContent value="mentioned">
          <h1 className="my-2 text-center font-semibold">
            Mentioned posts will display here
          </h1>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostCard({ url }) {
  return (
    <>
      <div className="relative overflow-hidden group cursor-pointer">
        <img className="object-cover aspect-9/11" src={url} />

        <p></p>
        <div className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-black/50 active:bg-black/70">
          <div className="flex justify-center items-center gap-4.5 h-full">
            <div className="flex flex-row gap-1">
              <Heart fill="currentColor" /> <span>912</span>
            </div>
            <div className="flex flex-row gap-1">
              <MessageCircle fill="currentColor" /> <span>45</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ReelCard({ url }) {
  return (
    <div className="relative overflow-hidden group cursor-pointer">
      {/* Your Image */}
      <img className="object-cover aspect-9/13" src={url} alt="" />

      <p className="group-hover:hidden dark:text-neutral-50 absolute bottom-2 left-4 flex flex-row gap-1 text-sm font-semibold z-10">
        <Eye strokeWidth={1.8} /> <span className="self-center">30.5K</span>
      </p>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-70% via-transparent to-black/70"></div>

      <div className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-black/50 active:bg-black/70">
        <div className="flex justify-center items-center gap-4.5 h-full">
          <div className="flex flex-row gap-1">
            <Heart fill="currentColor" /> <span>912</span>
          </div>
          <div className="flex flex-row gap-1">
            <MessageCircle fill="currentColor" /> <span>45</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

// FOllowing Message elements
{
  /* <div className="flex flex-row w-xl gap-1.5 mt-6">
        <button className="cursor-pointer font-bold py-2.5 dark:bg-gray-700 hover:dark:bg-gray-600 active:scale-98 text-sm rounded-lg w-full flex justify-center items-center">
          Following{" "}
          <span>
            <ChevronDown size={19} strokeWidth={1.5} />
          </span>
        </button>
        <button className="cursor-pointer font-bold py-2.5 dark:bg-gray-700 hover:dark:bg-gray-600 active:scale-98 text-sm rounded-lg w-full">
          Message
        </button>
        <button className="cursor-pointer font-bold p-3 flex justify-center items-center dark:bg-gray-700 active:scale-98 hover:dark:bg-gray-600 text-sm rounded-lg hover:scale-105">
          <UserPlus size={16} />
        </button>
      </div> */
}
