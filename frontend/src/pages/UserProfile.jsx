import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";
import {
  Clapperboard,
  Contact,
  Eye,
  Grid3x3,
  Heart,
  MessageCircle,
  Link as LinkIcon,
  Loader,
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
import {
  getUserProfile,
  getUserStories,
  toggleFollowUser,
} from "../utils/config";
import { login as storeLogin } from "../store/Auth/AuthSlice.js";
import { useGetAllUserPostsQuery } from "../store/api/apiSlice.js";
import StoryViewer from "../components/StoryViewer.jsx";
import PostOverlay from "../components/PostOverlay.jsx";
import UserListOverlay from "../components/UserListOverlay.jsx";

function UserProfile() {
  const { username } = useParams();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [userData, setUserData] = useState(null);
  const [followState, setFollowState] = useState(""); // "loading" | "following" | "not-following"

  const getUserProfileInfo = async () => {
    try {
      const response = await getUserProfile(username);
      if (response) {
        setFollowState(
          !response.data.data.isFollowing && !response.data.data.isFollowedBy
            ? "Follow"
            : response.data.data.isFollowedBy && !response.data.data.isFollowing
              ? "Follow back"
              : "Following",
        );
        // console.log(`Fetched user profile:`, response.data);
        setUserData(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserProfileInfo();
  }, [username]);

  return (
    <>
      <div className="col-span-12  md:col-span-10 md:col-start-3 lg:col-span-9 lg:col-start-4 xl:col-span-10 xl:col-start-3 mt-4">
        <div className="flex justify-center items-center   flex-col w-full">
          {userData && (
            <UserOwnProfile
              userData={userData}
              setUserData={setUserData}
              isLoggedIn={isLoggedIn}
              followState={followState}
              setFollowState={setFollowState}
            />
          )}
        </div>

        {userData && (
          <UserUploads
            userId={userData._id}
            userData={userData}
            totalPosts={userData.postsCount}
          />
        )}
      </div>
    </>
  );
}

const UserOwnProfile = function ({
  userData,
  setUserData,
  isLoggedIn,
  followState,
  setFollowState,
}) {
  const [isFollowUpdating, setIsFollowUpdating] = useState(false);

  const [openUserListOverlay,setOpenUserListOverlay] = useState(false)
  const [userListType,setUserListType] = useState(null)

  async function toggleFollow() {
    if (!isLoggedIn) {
      console.log("user is not authenticated");
      return;
    }
    try {
      setIsFollowUpdating(true);
      const response = await toggleFollowUser(userData?._id);
      if (response) {
        setFollowState((prev) =>
          prev == "Follow" || prev == "Follow back"
            ? "Following"
            : prev == "Following" && userData.isFollowedBy
              ? "Follow back"
              : "Follow",
        );
        console.log(response.data.message);

        if (!userData.isFollowing) {
          setUserData((prev) => ({
            ...prev,
            isFollowing: !userData.isFollowing,
            followersCount: userData.followersCount + 1,
          }));
        } else {
          setUserData((prev) => ({
            ...prev,
            isFollowing: !userData.isFollowing,
            followersCount: userData.followersCount - 1,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsFollowUpdating(false);
  }
  const [stories, setStories] = useState([]);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // console.log("Stories", stories);
  const fetchStories = async function () {
    try {
      const response = await getUserStories(userData._id);
      setStories([
        {
          user: userData,
          stories: response.data.data,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userData?._id) {
      fetchStories();
    }
  }, [userData]);

  return (
    <>
      <div className="flex flex-row mt-6 gap-6 sm:w-xl">
        <div
          onClick={() =>
            stories && stories[0]?.stories?.length > 0
              ? setShowStoryViewer(true)
              : null
          }
          className="active:scale-97 cursor-pointer flex justify-center lg:items-center flex-shrink-0 "
        >
          <div
            className={`${stories && stories[0]?.stories?.length > 0 ? "bg-gradient-to-br from-red-500 via-pink-600 to-amber-500 p-1" : ""} rounded-full`}
          >
            <div className=" border-[5px] border-neutral-900 rounded-full size-20 md:size-30 lg:size-40 object-cover flex-[0_0_5rem] md:flex-[0_0_7.5rem] lg:flex-[0_0_10rem]">
              <img
                src={
                  userData.avatar
                    ? userData.avatar
                    : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
                }
                className="w-full h-full rounded-full object-cover"
                alt="profile"
              />
            </div>
          </div>
        </div>
        <div>
          <div className="flex flex-col mb-3">
            <h2 className="text-md font-bold sm:text-2xl sm:font-extrabold mb-1 dark:text-white">
              {userData.username}
            </h2>
            <h3 className="hidden sm:block text-sm mb-2 dark:text-white">
              {userData ? userData.fullname : "Full Name"}
            </h3>
            <div className="flex flex-row gap-4 text-sm">
              <p className="">
                <span className="font-semibold text-sm">
                  {userData ? userData.postsCount : "zero"}
                </span>{" "}
                posts
              </p>
              <p
              onClick={() => {
                setUserListType("followers")
                setOpenUserListOverlay(true)
              }}
              className="cursor-pointer active:dark:text-neutral-400"
              >
                <span className="font-semibold text-sm ">
                  {userData ? userData.followersCount : "0"}
                </span>{" "}
                followers
              </p>
              <p
              onClick={() => {
                setUserListType("following")
                setOpenUserListOverlay(true)
              }}
              className="cursor-pointer active:dark:text-neutral-400"
              >
                <span className="font-semibold text-sm ">
                  {userData ? userData.followingCount : "0"}
                </span>{" "}
                following
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="!whitespace-pre-line text-sm">
              {`${userData && userData.bio ? userData.bio : ""}`}
            </p>
            {userData && userData.website && (
              <p className="text-blue-400 leading-6 text-sm">
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-start items-center gap-1"
                  href={
                    userData.website.startsWith("http")
                      ? userData.website
                      : `https://${userData.website}`
                  }
                >
                  <LinkIcon size={15} /> {userData.website}
                </a>
              </p>
            )}
            <p className="text-sm mt-1.5">
              Followed by{" "}
              <span className="font-bold">rjabhinavv, jitendrak1</span> + 2 more
            </p>
          </div>
        </div>
      </div>

      <div className=" flex lg:hidden  flex-col sm:w-xl mt-6">
        <h3 className="sm:hidden text-sm mb-1 font-bold w-fit">
          {userData ? userData.fullname : "Full Name"}
        </h3>
        <p className="!whitespace-pre-line text-sm">
          {`${userData && userData.bio ? userData.bio : ""}`}
        </p>

        <p className="text-sm mt-1.5">
          Followed by <span className="font-bold">rjabhinavv, jitendrak1</span>{" "}
          + 2 more
        </p>
      </div>

      <div className="flex flex-row w-full gap-1.5 mt-6 max-w-xl">
        <button
          disabled={isFollowUpdating}
          onClick={toggleFollow}
          className={`${
            followState == "Follow" || followState == "Follow back"
              ? " dark:bg-sky-600 hover:dark:bg-sky-700"
              : "dark:bg-gray-700 hover:dark:bg-gray-600"
          } cursor-pointer font-bold py-3 active:scale-98 text-sm rounded-lg w-full flex justify-center items-center`}
        >
          {isFollowUpdating ? (
            <Loader size={19} className={"motion-safe:animate-spin"} />
          ) : (
            followState
          )}
        </button>
        <button className="cursor-pointer font-bold py-3 dark:bg-gray-700 hover:dark:bg-gray-600 active:scale-98 text-sm rounded-lg w-full">
          Message
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
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
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
                            src="https://images.unsplash.com/photo-1696834137457-8872b6c525f4?q=80&w=200"
                            alt="highlight"
                          />
                        </div>

                        <p className="text-center text-xs font-semibold text-neutral-50 mt-3">
                          Trip '24
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

      {showStoryViewer && (
        <StoryViewer
          data={stories}
          userIndex={activeUserIndex}
          storyIndex={activeStoryIndex}
          setUserIndex={setActiveUserIndex}
          setStoryIndex={setActiveStoryIndex}
          setShowStoryViewer={setShowStoryViewer}
        />
      )}

      <UserListOverlay
      userId={userData._id}
      type={userListType}
      setUserListType={setUserListType}
      openUserListOverlay={openUserListOverlay}
      setOpenUserListOverlay={setOpenUserListOverlay}
      />
    </>
  );
};

{
  /* posts */
}
function UserUploads({ userId, totalPosts, userData }) {
  const [openPostOverlay, setOpenPostOverlay] = useState(false);
  const [currentOverlayPost, setCurrentOverlayPost] = useState(null);
  
  const [activeTab, setActiveTab] = useState("post");
  const [page, setPage] = useState(1);

  const loadMoreRef = useRef(null);

  // Hook logic preserved but result ignored
  const { data, isLoading, isFetching } = useGetAllUserPostsQuery({
    userId,
    type: activeTab,
    page,
  });

  const posts = data?.data || [];
  const hasMore = page * 5 < totalPosts;

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !isFetching) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isFetching]);

  return (
    <>
      <div className="mt-8 w-full lg:px-10 xl:px-30 2xl:px-50">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value)}
          defaultValue="post"
          className={"w-full bg-transparent"}
        >
          <TabsList className={"w-xs sm:w-sm md:w-md mx-auto bg-transparent"}>
            <TabsTrigger
              className={
                "border-none !bg-transparent group cursor-pointer active:!text-neutral-500"
              }
              value="post"
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
              value="reel"
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
          <TabsContent value="post" className={" w-full"}>
            <>
              <h2 className="text-center font-bold">Posts</h2>
              <div className="grid grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 gap-0.5 rounded-md overflow-hidden">
                {posts.map((item) => (
                  <PostCard
                    userData={userData}
                    post={item}
                    setOpenPostOverlay={setOpenPostOverlay}
                    setCurrentOverlayPost={setCurrentOverlayPost}
                    key={item._id}
                  />
                ))}
              </div>
              {(isLoading || isFetching) && (
                <div className="w-full flex justify-center items-center py-7">
                  {" "}
                  <Loader className="animate-spin text-neutral-100" />
                </div>
              )}
              {/* {hasMore && (
              <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={isFetching}
                className="mt-4 px-4 py-2 text-black bg-gray-100 rounded hover:bg-gray-200 w-full"
              >
                Load More
              </button>
            )} */}
              <div ref={loadMoreRef} className="h-10" />
            </>
          </TabsContent>
          <TabsContent value="reel" className={"border-1 border-amber-600"}>
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

      <PostOverlay
        postData={currentOverlayPost}
        userData={userData}
        openPostOverlay={openPostOverlay}
        setOpenPostOverlay={setOpenPostOverlay}
      />
      
    </>
  );
}

function PostCard({
  post,
  userData,
  setCurrentOverlayPost,
  setOpenPostOverlay,
}) {
  return (
    <>
      <div className="relative overflow-hidden group cursor-pointer">
        <img
          className="object-cover aspect-9/11 size-full"
          src={post.media[0]}
          alt="post"
        />

        <p></p>
        <div
          onClick={() => {
            setCurrentOverlayPost(post);
            setOpenPostOverlay(true);
          }}
          className="absolute opacity-0 group-hover:opacity-100 inset-0 bg-black/70 active:bg-black/80"
        >
          <div className="flex justify-center items-center gap-4.5 h-full">
            <div className="flex flex-row gap-1">
              <Heart fill="currentColor" /> <span>{post.totalLikes}</span>
            </div>
            <div className="flex flex-row gap-1">
              <MessageCircle fill="currentColor" />{" "}
              <span>{post.totalComments}</span>
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

export default UserProfile;
