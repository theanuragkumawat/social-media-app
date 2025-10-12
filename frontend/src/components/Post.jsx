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

function Post({ user, time, imageUrl, likes = 0, commentCount = 0 }) {
  return (
    <>
      <div className="max-w-md mx-auto text-white rounded-xs overflow-hidden mt-5">
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
            <button className=" text-xl cursor-pointer hover:dark:text-neutral-400">
              <Heart size={27} strokeWidth={2} />
            </button>
            <button className=" text-xl cursor-pointer hover:dark:text-neutral-400">
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
            <p className="text-sm text-gray-400 text-start">
              View all {commentCount} comments
            </p>
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
