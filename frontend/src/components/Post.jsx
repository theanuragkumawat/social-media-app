import { useEffect, useRef } from "react";

import {
  Bookmark,
  Dot,
  Ellipsis,
  EllipsisVertical,
  Forward,
  Heart,
  MessageCircle,
  MousePointer2,
  Send,
  Share,
  SquareArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import {
  useLikePostMutation,
  useUnlikePostMutation,
} from "../store/api/apiSlice";

function Post({
  postData,
  user,
  postId,
  time,
  media,
  caption,
  likes = 0,
  commentCount = 0,
  hasLiked,
  setCurrentOverlayPost,
  setOpenPostOverlay,
}) {
  const [likePost, { isLoading: isLikeLoading }] = useLikePostMutation();
  const [unlikePost, { isLoading: isUnlikeLoading }] = useUnlikePostMutation();
  const isActionLoading = isLikeLoading || isUnlikeLoading;

  const handleLikeClick = () => {
    // Agar pehle se liked hai, toh Unlike API call karo
    if (hasLiked) {
      unlikePost(postId);
    }
    // Agar liked nahi hai, toh Like API call karo
    else {
      likePost(postId);
    }
  };

  const isVideo = (url) => {
    return url.endsWith(".mp4") || url.includes("/video/");
  };

  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play();
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.6 }, // 60% visible hona chahiye
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="w-md mx-auto text-white rounded-xs overflow-hidden mt-5">
        {/* Header */}
        <div className="flex items-center pb-3">
          <img
            src={user.avatar}
            alt=""
            className="w-9 h-9 rounded-full mr-3 object-cover"
          />
          <div className="flex flex-row">
            <p className="font-semibold text-sm flex justify-center items-center">{`${user.username}`}</p>
            <span className="flex justify-center items-center text-xs text-gray-400">
              <Dot
                size={18}
                strokeWidth={2}
                className="inline"
                fill="currentColor"
              />
            </span>
            <p className="text-sm text-gray-400 flex justify-center items-center">
              {`${time}`}
            </p>
          </div>
          <span className="ml-auto text-lg cursor-pointer">
            <Ellipsis strokeWidth={0.9} />
          </span>
        </div>

        {/* Image */}
        {/* <img
          src={media[0]}
          alt="Post"
          className="w-full object-cover border border-neutral-800"
        /> */}
        {media.length == 1 ? (
          isVideo(media[0]) ? (
            <video
              src={media[0]}
              ref={videoRef}
              className="w-full object-cover"
              controls
              
              loop
            />
          ) : (
            <img
              src={media[0]}
              alt="Post"
              className="w-full object-cover border border-neutral-800"
            />
          )
        ) : (
          <Carousel className="w-full">
            <CarouselContent className={"relative items-center"}>
              {media.map((url, index) => {
                return (
                  <CarouselItem key={index} className={""}>
                    <div>
                      <Card className={"p-0 rounded-none"}>
                        <CardContent className="flex items-center justify-center  p-0">
                          {isVideo(url) ? (
                            <video
                              ref={videoRef}
                              src={url}
                              className="w-full object-cover"
                              controls
                              loop
                            />
                          ) : (
                            <img
                              src={url}
                              alt="Post"
                              className="w-full object-cover border border-neutral-800"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious
              className={
                "absolute top-[50%] left-2 text-black size-6 !bg-white z-50 opacity-75"
              }
            />
            <CarouselNext
              className={
                "absolute top-[50%] right-2 text-black size-6 !bg-white z-50 opacity-75"
              }
            />
          </Carousel>
        )}

        {/* Action & Stats */}
        <div className="py-2 px-1">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-2 cursor-pointer dark:text-neutral-50 ">
              <button
                className=" text-xl cursor-pointer "
                onClick={handleLikeClick}
                disabled={isActionLoading}
              >
                <Heart
                  size={27}
                  strokeWidth={2}
                  className={`${hasLiked ? "text-rose-500 fill-current" : "dark:text-neutral-50"} `}
                />
              </button>
              <button
                className="text-xl cursor-pointer hover:dark:text-neutral-400"
                onClick={() => {
                  setCurrentOverlayPost(postData);
                  setOpenPostOverlay(true);
                }}
              >
                <MessageCircle
                  size={25}
                  strokeWidth={2}
                  className="transform scale-x-[-1]"
                />
              </button>
              <button className=" text-xl cursor-pointer hover:dark:text-neutral-400">
                <Send size={25} strokeWidth={2} className="rotate-16" />
              </button>
            </div>
            <div className="flex items-center">
              <button className=" text-xl cursor-pointer hover:dark:text-neutral-400">
                <Bookmark size={25} strokeWidth={2} className="" />
              </button>
            </div>
          </div>
          <div className="flex justify-start flex-col gap-1">
            <p className="font-semibold text-sm text-start text-neutral-50">
              {likes.toLocaleString()} likes
            </p>
            {caption && (
              <p className="text-start text-sm">
                <span className="font-bold mr-1.5">{user.username}</span>
                {caption}
              </p>
            )}

            {commentCount ? (
              <button
                className="text-sm text-gray-400 text-start"
                onClick={() => {
                  setCurrentOverlayPost(postData);
                  setOpenPostOverlay(true);
                }}
              >
                View all {commentCount} comments
              </button>
            ) : null}

            {/* add comment */}
            {/* <div className="">
              <input
                type="text"
                placeholder="Add a comment..."
                className="text-sm w-full bg-transparent border-b border-gray-700  text-gray-200 focus:outline-none border-none"
              />
            </div> */}
          </div>
        </div>
        <div className="mt-2">
          <Separator />
        </div>
      </div>
    </>
  );
}

export default Post;
