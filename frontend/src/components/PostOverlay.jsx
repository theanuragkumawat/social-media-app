import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Smile,
  X,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import moment from "moment";
import { addComment, likePost, unlikePost } from "../utils/config";
import PostComments from "./PostComments";

function PostOverlay({
  postData,
  userData,
  openPostOverlay,
  setOpenPostOverlay,
}) {
  const [post, setPost] = useState(postData);
  const prevPostRef = useRef(null);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isCommentLoading, setIsCommentLoading] = useState(false);

  useEffect(() => {
    setPost(postData);
  }, [postData]);

  const handleLikeToggle = async () => {
    if (isLikeLoading) return;
    setIsLikeLoading(true);
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
      setIsLikeLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setIsCommentLoading(true);
    try {
      await addComment(post._id, commentText);
      setCommentText(""); // clear input
    } finally {
      setIsCommentLoading(false);
    }
  };

  return (
    <Dialog
      open={openPostOverlay}
      onOpenChange={setOpenPostOverlay}
      className={""}
    >
      <DialogContent
        className=" w-full bg-transparent border-none shadow-none md:max-w-[1100px] p-20"
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Post View</DialogTitle>
        <DialogDescription></DialogDescription>

        <div className=" flex flex-col mx-auto rounded-sm bg-neutral-900 md:flex-row">
          <button
            onClick={() => setOpenPostOverlay(false)}
            className="absolute cursor-pointer active:scale-93  z-50 text-white hover:text-gray-300 md:-right-14 md:-top-0"
          >
            <X size={32} />
          </button>
          {/* LEFT SIDE: Image Section */}
          <div className="relative flex items-center justify-center dark:bg-neutral-950 h-full min-w-0  ">
            {/* Mobile Header */}
            <div className="absolute top-0 flex w-full items-center justify-between bg-black/80 p-3 md:hidden z-10">
              <div className="flex items-center gap-3">
                <div className="size-8">
                  <img
                    src={post?.owner?.avatar}
                    alt="avatar"
                    className="size-full object-cover rounded-full border border-neutral-700"
                  />
                </div>
                <span className="text-sm font-semibold text-white">
                  {post?.owner?.username}
                </span>
              </div>
            </div>

            {/* Navigation Arrows (Custom positioned) */}

            <SimpleCarousel media={post?.media} />

            {/* --- CAROUSEL FIX END --- */}
          </div>

          {/* RIGHT SIDE: Sidebar (Comments & Actions) */}
          <div className="flex flex-col bg-neutral-900 max-w-[400px]">
            {/* ... (Sidebar content remains exactly the same as your code) ... */}
            <div className="hidden items-center justify-between border-b border-neutral-800 p-4 md:flex">
              <div className="flex items-center gap-3">
                <div className="size-8 bg-gradient-to-tr from-yellow-500 to-red-600 p-[2px] rounded-full">
                  <img
                    src={post?.owner?.avatar}
                    alt="user"
                    className="size-full object-cover rounded-full border-3 border-black bg-neutral-800"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/${post?.owner.username}`}
                      className="text-sm font-semibold text-white hover:text-neutral-300 cursor-pointer"
                    >
                      {post?.owner?.username}
                    </Link>
                    {!post?.owner.isFollowing && (
                      <span className="text-sm text-sky-500 font-semibold cursor-pointer hover:text-sky-400">
                        <span className="text-white text-xs mr-1">• </span>
                        Follow
                      </span>
                    )}
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
            <div className=" space-y-4 pt-4">
              {post?.caption && (
                <div className="flex gap-3 px-4">
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
              <div className="overflow-y-auto scrollbar-hide xl:h-85 border-b pb-2 xl:w-96"
              style={{scrollbar: "hidden"}}
              >
                {post && <PostComments postId={post._id} />}
              </div>
            </div>

            <div className="border-t border-neutral-800 bg-neutral-900 p-4 pb-2">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-4 text-white">
                  <button
                    disabled={isLikeLoading}
                    onClick={() => handleLikeToggle()}
                  >
                    <Heart
                      size={26}
                      className={`cursor-pointer transition-colors ${
                        post?.hasLiked
                          ? "fill-rose-600 text-rose-600"
                          : "hover:text-neutral-400"
                      }`}
                    />
                  </button>
                  <MessageCircle
                    size={26}
                    className="cursor-pointer hover:text-neutral-400"
                    style={{ transform: "rotateY(180deg)" }}
                  />
                  <Send
                    size={26}
                    className="cursor-pointer hover:text-neutral-400"
                  />
                </div>
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
                  className={`${
                    isCommentLoading ? "text-neutral-300" : " text-white"
                  } w-full bg-transparent text-sm placeholder-neutral-400  focus:outline-none`}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                {commentText && (
                  <button
                    disabled={isCommentLoading}
                    onClick={handleCommentSubmit}
                    className="text-sm font-bold text-blue-500 hover:text-white cursor-pointer"
                  >
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
      className=" relative rounded-xl overflow-hidden"
      style={{ height: "-webkit-fill-available" }}
    >
      {/* Slides */}
      <Carousel className={"!aspect-square  h-full"}>
        <CarouselContent className={"aspect-square  "}>
          {media?.map((img, index) => (
            <CarouselItem
              key={index}
              className={"items-center justify-center flex w-full h-full "}
            >
              <img
                key={index}
                src={img}
                alt="Post content"
                className="w-full h-full object-contain"
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
