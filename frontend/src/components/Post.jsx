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
import React from "react";
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
  imageUrl,
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
        <img
          src={imageUrl}
          alt="Post"
          className="w-full object-cover border border-neutral-800"
        />

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
              <button className="text-sm text-gray-400 text-start"
              onClick={() => {
                  setCurrentOverlayPost(postData);
                  setOpenPostOverlay(true);
                }}
              >
                View all {commentCount} comments
              </button>
            ) : null}

            <div className="">
              <input
                type="text"
                placeholder="Add a comment..."
                className="text-sm w-full bg-transparent border-b border-gray-700  text-gray-200 focus:outline-none border-none"
              />
            </div>
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
