import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import React, { useEffect, useRef, useState } from "react";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import moment from "moment";
import { likePost, unlikePost } from "../utils/config";

function PostOverlay({
  postData,
  userData,
  openPostOverlay,
  setOpenPostOverlay,
}) {
  const [post, setPost] = useState(postData);
  const prevPostRef = useRef(null);
 const [isLikeLoading,setIsLikeLoading] = useState(false)

  console.log(post);
  useEffect(() => {
    setPost(postData);
  }, [postData]);

  // const [isLiked, setIsLiked] = useState(false);
  const [commentText, setCommentText] = useState("");

  const handleLikeToggle = async () => {
    if (isLikeLoading) return
    setIsLikeLoading(true)
    const wasLiked = post.hasLiked;
    prevPostRef.current = post;

    // optimistic update
    setPost((prev) => ({
      ...prev,
      hasLiked: !prev.hasLiked,
      totalLikes: prev.hasLiked ? prev.totalLikes - 1 : prev.totalLikes + 1,
    }));

    try {
      if (!wasLiked) {
        // pehle liked nahi tha → like
        const res = await likePost(post._id);
        console.log(res.data.message);
      } else {
        // pehle liked tha → unlike
        const res = await unlikePost(post._id);
        console.log(res.data.message);
      }
    } catch (err) {
      // ❌ backend fail → exact rollback
      setPost(prevPostRef.current);
    } finally {
      setIsLikeLoading(false)
    }
  };

  return (
    <Dialog open={openPostOverlay} onOpenChange={setOpenPostOverlay}>
      <DialogContent
        className="max-w-5xl w-full p-0 bg-transparent border-none shadow-none overflow-hidden md:max-w-[1300px]"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Post View</DialogTitle>
        <DialogDescription></DialogDescription>
        <button
          onClick={() => setOpenPostOverlay(false)}
          className="absolute -top-10 right-0 z-50 text-white hover:text-gray-300 md:-right-10 md:top-0"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col mx-auto  w-full overflow-hidden rounded-sm bg-neutral-900 md:flex-row ">
          {/* LEFT SIDE: Image Section */}
          <div className="relative flex items-center justify-center dark:bg-neutral-950 flex-1 h-full min-w-0  ">
            {/* Mobile Header */}
            <div className="absolute top-0 flex w-full items-center justify-between bg-black/80 p-3 md:hidden z-10">
              <div className="flex items-center gap-3">
                <img
                  src={userData.avatar}
                  alt="avatar"
                  className="h-8 w-8 rounded-full border border-neutral-700"
                />
                <span className="text-sm font-semibold text-white">
                  {userData.username}
                </span>
              </div>
            </div>

            {/* Navigation Arrows (Custom positioned) */}

            <SimpleCarousel media={post?.media} />

            {/* --- CAROUSEL FIX END --- */}
          </div>

          {/* RIGHT SIDE: Sidebar (Comments & Actions) */}
          <div className="flex w-full flex-col bg-neutral-900 md:w-[400px] md:min-w-[450px] ">
            {/* ... (Sidebar content remains exactly the same as your code) ... */}
            <div className="hidden items-center justify-between border-b border-neutral-800 p-4 md:flex">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-tr from-yellow-500 to-red-600 p-[2px] rounded-full">
                  <img
                    src={userData.avatar}
                    alt="user"
                    className="h-8 w-8 rounded-full border-2 border-black bg-neutral-800"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white hover:text-neutral-300 cursor-pointer">
                      {userData.username}
                    </span>
                    <span className="text-sm text-sky-500 font-semibold cursor-pointer hover:text-sky-400">
                      <span className="text-white text-xs mr-1">• </span>Follow
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400">
                    The Tonight Show Starring Jimmy Fallon
                  </p>
                </div>
              </div>
              <MoreHorizontal
                className="cursor-pointer text-white hover:text-neutral-400"
                size={20}
              />
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-hide">
              {post?.caption && (
                <div className="flex gap-3">
                  <img
                    src={userData.avatar}
                    alt="user"
                    className="mt-1 h-8 w-8 rounded-full"
                  />
                  <div className="flex flex-col gap-1 text-sm text-white">
                    <div>
                      <span className="mr-2 font-semibold">
                        {userData.username}
                      </span>
                      {post.caption}
                    </div>
                    <span className="text-xs text-neutral-500">
                      {moment(post.createdAt).fromNow()}
                    </span>
                  </div>
                </div>
              )}

              {post?.comments?.map((comment) => (
                <div key={comment.id} className="group flex gap-3">
                  <img
                    src={`https://i.pravatar.cc/150?u=${comment.user}`}
                    alt="user"
                    className="mt-1 h-8 w-8 rounded-full bg-neutral-800"
                  />
                  <div className="flex w-full flex-col gap-0.5 text-sm text-white">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <span className="mr-1.5 font-semibold hover:text-neutral-400 cursor-pointer">
                          {comment.user}
                        </span>
                        <span className="text-neutral-50">{comment.text}</span>
                      </div>
                      <div className="">
                        <Heart
                          size={13}
                          className="mt-1 cursor-pointer text-neutral-50 hover:scale-105 active:scale-95 "
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-neutral-400">
                      <span>{comment.time}</span>
                      <span className="cursor-pointer hover:text-white">
                        {comment.likes} like{comment.likes !== 1 && "s"}
                      </span>
                      <span className="cursor-pointer hover:text-white">
                        Reply
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-800 bg-neutral-900 p-4 pb-2">
              <div className="mb-2 flex items-center justify-between">
                <button
                disabled={isLikeLoading}
                  onClick={() => handleLikeToggle()}
                  className="flex items-center gap-4 text-white"
                >
                  <Heart
                    size={26}
                    className={`cursor-pointer transition-colors ${
                      post?.hasLiked
                        ? "fill-rose-600 text-rose-600"
                        : "hover:text-neutral-400"
                    }`}
                  />
                  <MessageCircle
                    size={26}
                    className="cursor-pointer hover:text-neutral-400"
                    style={{ transform: "rotateY(180deg)" }}
                  />
                  <Send
                    size={26}
                    className="cursor-pointer hover:text-neutral-400"
                  />
                </button>
                <Bookmark
                  size={26}
                  className="cursor-pointer text-white hover:text-neutral-400"
                />
              </div>

              <div className="mb-1 text-sm font-semibold text-white">
                {post?.totalLikes} likes
              </div>
              <div className="mb-4 text-[10px] uppercase tracking-wide text-neutral-400">
                {moment(post?.createdAt).fromNow()}
              </div>

              <div className="flex items-center gap-3 border-t border-neutral-800 pt-3">
                <Smile
                  className="cursor-pointer text-white hover:text-neutral-400"
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                {commentText && (
                  <button className="text-sm font-semibold text-blue-500 hover:text-white">
                    Post
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function SimpleCarousel({ media }) {
  // const media = [
  //   "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  //   "https://images.unsplash.com/photo-1519681393784-d120267933ba",
  //   "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
  //   "https://images.unsplash.com/photo-1696834137489-74a760ff8240?q=80&w=627&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  // ];

  // console.log(media.length);

  return (
    <div
      className=" !aspect-square relative rounded-xl"
      style={{ height: "-webkit-fill-available" }}
    >
      {/* Slides */}
      <Carousel className={"!aspect-square  "}>
        <CarouselContent className={"aspect-square "}>
          {media?.map((img, index) => (
            <CarouselItem
              key={index}
              className={"items-center justify-center flex size-full "}
            >
              <img
                key={index}
                src={img}
                alt="Post content"
                className="size-full object-contain  "
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious
          className={"left-5 !bg-white/80 hover:text-black text-black size-7 "}
        />
        <CarouselNext
          className={
            "right-5 !bg-white/80  hover:text-black text-black size-7  "
          }
        />
      </Carousel>
      {/* <button onClick={() => api?.scrollPrev()} className="absolute left-4 top-1/2 hidden rounded-full bg-white/80 p-1 hover:bg-white md:block z-10">
              <ChevronLeft className="text-black" size={20} />
            </button>

            <button onClick={() => api?.scrollNext()} className="absolute right-4 top-1/2 hidden rounded-full bg-white/80 p-1 hover:bg-white md:block z-10">
              <ChevronRight className="text-black" size={20} />
            </button> */}
    </div>
  );
}

export default PostOverlay;
