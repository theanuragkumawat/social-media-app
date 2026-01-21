import { useState, useEffect } from "react";
import { useGetPostCommentsQuery } from "../store/api/apiSlice.js";
import { CirclePlus, Heart, Loader } from "lucide-react";
import moment from "moment";

function PostComments({ postId }) {
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetPostCommentsQuery(
    {
      postId,
      page,
    },
    { skip: !postId }
  );

  let hasMore = data?.data.hasNextPage
  console.log("hasMore", hasMore);
  
  const comments = data?.data.docs ?? [];
  console.log(data);
  return (
    <div className="max-w-fit">
      {/* COMMENTS LIST */}
        {comments?.map((comment) => (
        <div key={comment._id} className="group flex gap-3 mb-3 px-4">
          <img
            src={comment.owner.avatar ? comment.owner.avatar : null}
            alt="user"
            className="mt-1 h-8 w-8 rounded-full bg-neutral-800"
          />
          <div className="flex w-full flex-col gap-0.5 text-sm text-white">
            <div className="flex items-start justify-between">
              <div className="pr-4">
                <span className="mr-1.5 font-bold hover:underline text-white cursor-pointer">
                  {comment.owner.username}
                </span>
                <p className="text-neutral-50 wrap-anywhere inline">{comment.text}</p>
              </div>
              <div className="">
                <Heart
                  size={13}
                  className="mt-1 cursor-pointer text-neutral-50 hover:scale-105 active:scale-95 "
                />
              </div>
            </div>
            <div className="flex gap-4 text-xs font-medium text-neutral-400">
              <span>{moment(comment.createdAt).fromNow()}</span>
              <span className="cursor-pointer hover:text-white">
                {comment.totallikes} like{comment.totallikes !== 1 && "s"}
              </span>
              <span className="cursor-pointer hover:text-white">Reply</span>
            </div>
          </div>
        </div>
      ))}  

      {/* LOAD MORE */}
      {hasMore && (
        <button
          disabled={isFetching}
          onClick={() => setPage((prev) => prev + 1)}
          className="w-full text-center flex justify-center items-center"
        >
          {isFetching ? <Loader className="animate-spin" /> : <CirclePlus className="cursor-pointer hover:text-neutral-300 active:scale-95" />}
        </button>
      )}
    </div>
  );
}

export default PostComments;
