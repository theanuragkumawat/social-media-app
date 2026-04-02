import { useEffect, useState, useRef, useCallback } from "react";
import { Post, PostOverlay, StoryViewer } from "../components";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { useSelector, useDispatch } from "react-redux";
import { getCurrentUser } from "../utils/auth.js";
import { login as storeLogin } from "../store/Auth/AuthSlice.js";
import { CornerLeftUpIcon } from "lucide-react";
import { getAllFeedStories } from "../utils/config.js";
import { useGetUserFeedQuery, useLikePostMutation,useUnlikePostMutation } from "../store/api/apiSlice.js";
import moment from "moment";

function Home() {
  const dispatch = useDispatch();
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const [showStoryViewer, setShowStoryViewer] = useState(false);
  const [stories, setStories] = useState([]);
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  async function fetchStories() {
    if (!isLoggedIn) return;
    try {
      const response = await getAllFeedStories();
      if (response) {
        console.log("STORIES:", response.data.data.docs); // monggose-aggregatep-paginate-v2

        setStories(response.data.data.docs);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchStories();
  }, [isLoggedIn]);

  useEffect(() => {
    if (showStoryViewer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showStoryViewer]);

  // const getUser = async () => {
  //   try {
  //     const response = await getCurrentUser();
  //     if (response) {
  //       console.log(response);
  //       dispatch(storeLogin(response.data.data));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   getUser();
  // }, []);
  const [cursor, setCursor] = useState(null);
  const { data, isLoading, isFetching } = useGetUserFeedQuery({ cursor });
  const feedPosts = data?.data?.posts;
  const hasNextPage = data?.data?.hasNextPage;
  const nextCursor = data?.data?.nextCursor;

  const observer = useRef();
  const lastPostElementRef = useCallback(
    (node) => {
      if (isFetching) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          setCursor(nextCursor);
        }
      });

      if (node) observer.current.observe(node);
    },
    [isFetching, hasNextPage, nextCursor],
  );

  const handleLoadMore = () => {
    if (hasNextPage && nextCursor) {
      setCursor(nextCursor);
    }
  };

  console.log("Feed data:", feedPosts);

 const [openPostOverlay,setOpenPostOverlay] = useState(false)
 const [currentOverlayPost, setCurrentOverlayPost] = useState(null);

  return (
    <>
      {/* //left */}
      {/* <Navbar/> */}
      <div className="middle-part col-span-12 lg:col-start-3 xl:col-start-4 xl:col-span-6 text-center mt-4">
        {/* stories */}
        {stories && stories.length > 0 && (
          <div className="flex justify-center">
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: 6,
              }}
              className="w-full max-w-xl"
            >
              <CarouselContent className={"py-1.5 border-none md:px-1"}>
                {stories?.map((item, index) => (
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
                        <CardContent className="aspect-square flex flex-col items-center justify-center bg-transparent border-none ">
                          <div
                            onClick={() => {
                              setActiveUserIndex(index);
                              setActiveStoryIndex(0);
                              setShowStoryViewer(true);
                            }}
                            className="cursor-pointer active:scale-97  flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-500 p-[3px]"
                          >
                            {/* <span className="text-3xl font-semibold">{index+1}</span> */}
                            <div className="size-19 bg-black p-[3px] rounded-full">
                              <img
                                className=" size-full object-cover rounded-full select-none   "
                                src={item.user.avatar}
                                alt=""
                              />
                            </div>
                          </div>
                          <p className="text-xs mt-2 text-neutral-50 select-none w-20 truncate mx-auto">
                            {item.user.username}
                          </p>
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
        )}

        {/* posts */}
        <div className=" flex items-center justify-center flex-col mt-3">
          {isLoading && !feedPosts?.length ? (
            <>
              <PostSkeleton />
              <PostSkeleton />
            </>
          ) : (
            feedPosts?.map((post, index) => {
              const isLastPost = feedPosts.length === index + 1;

              return (
                <div
                  key={index}
                  // Agar aakhri post hai, toh ref attach karo
                  ref={isLastPost ? lastPostElementRef : null}
                  className="w-full flex justify-center"
                >
                  <Post
                  postData={post}
                    user={{
                      username: post.owner.username,
                      avatar: post.owner.avatar,
                    }}
                    postId={post._id}
                    time={moment(post.createdAt).fromNow()}
                    media={post.media}
                    likes={post.totalLikes}
                    commentCount={post.totalComments}
                    hasLiked={post.hasLiked}
                    caption={post.caption ? post.caption : null}

                    setOpenPostOverlay={setOpenPostOverlay}
                    setCurrentOverlayPost={setCurrentOverlayPost}


                  />
                </div>
              );
            })
          )}

          {/* Loaders & Messages */}
          {isFetching && feedPosts?.length > 0 && (
            <div className="w-full flex justify-center mt-2">
              <PostSkeleton />
            </div>
          )}
          {!hasNextPage && feedPosts?.length > 0 && (
            <h4 className="my-4 text-neutral-400 text-sm">
              You're all caught up!
            </h4>
          )}

          {/* //button */}
          {hasNextPage && (
            <button
              onClick={handleLoadMore}
              disabled={isFetching} // API call chalu ho toh disable kar do
              className={`mt-2 text-sm text-white font-bold px-5 py-2 rounded-2xl border-2 border-neutral-600 hover:text-gray-300 cursor-pointer active:scale-95 transition-all ${isFetching ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isFetching ? "Loading..." : "More"}
            </button>
          )}
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
      {/* story viewer */}

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

      <PostOverlay
              postData={currentOverlayPost}
              // userData={""}
              openPostOverlay={openPostOverlay}
              setOpenPostOverlay={setOpenPostOverlay}
            />
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

// Skeleton component - Tailwind ka use karke
function PostSkeleton() {
  return (
    <div className="w-full max-w-[470px] mx-auto mb-6 bg-transparent border-b border-neutral-800 pb-4 animate-pulse flex flex-col items-center">
      {/* Post Header */}
      <div className="w-full flex items-center gap-3 mb-3 px-2">
        <div className="size-10 rounded-full bg-neutral-800"></div>{" "}
        {/* Avatar Skeleton */}
        <div className="flex flex-col gap-2">
          <div className="w-24 h-3 bg-neutral-800 rounded"></div>{" "}
          {/* Username Skeleton */}
          <div className="w-16 h-2 bg-neutral-800 rounded"></div>{" "}
          {/* Time Skeleton */}
        </div>
      </div>

      {/* Post Image */}
      <div className="w-full aspect-[4/5] sm:aspect-square bg-neutral-800 rounded-sm mb-3"></div>

      {/* Post Actions (Like, Comment, etc) */}
      <div className="w-full flex gap-4 mb-3 px-2">
        <div className="size-6 bg-neutral-800 rounded-full"></div>
        <div className="size-6 bg-neutral-800 rounded-full"></div>
        <div className="size-6 bg-neutral-800 rounded-full"></div>
      </div>

      {/* Likes and Text Skeleton */}
      <div className="w-full px-2 flex flex-col gap-2">
        <div className="w-1/4 h-3 bg-neutral-800 rounded"></div>
        <div className="w-1/3 h-3 bg-neutral-800 rounded"></div>
      </div>
    </div>
  );
}

export default Home;
