import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus, Loader, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import store from "../store/store.js";
import {
  useGetUserFollowersQuery,
  useGetUserFollowingQuery,
} from "../store/api/apiSlice";
import { toggleFollowUser } from "../utils/config";
import { apiSlice } from "../store/api/apiSlice";
function UserListOverlay({
  openUserListOverlay,
  setOpenUserListOverlay,
  type,
  setUserListType,
  userId,
}) {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [isFollowUpdating, setIsFollowUpdating] = useState({});
  const [page, setPage] = useState(1);

  async function toggleFollow(id) {
    if (!isLoggedIn) {
      console.log("user is not authenticated");
      return;
    }
    try {
      setIsFollowUpdating((prev) => ({ ...prev, [id]: true }));
      const response = await toggleFollowUser(id);
      if (response) {
        // const state = store.getState(); 
        // console.log("ALL QUERIES:", state.api.queries);
        dispatch(
          apiSlice.util.updateQueryData(
            type == "followers" ? "getUserFollowers" : "getUserFollowing",
            { userId, page, type }, // 👈 EXACT MATCH
            (draft) => {
              const user = draft.data.docs.find((u) => u._id === id);
              if (user) {
                user.isFollowing = !user.isFollowing;
              }
            },
          ),
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFollowUpdating((prev) => ({ ...prev, [id]: false }));
    }
  }

  const followersQuery = useGetUserFollowersQuery(
    { userId, page, type },
    { skip: type !== "followers" },
  );
  const followingQuery = useGetUserFollowingQuery(
    { userId, page, type },
    { skip: type !== "following" },
  );

  let users =
    type === "followers"
      ? followersQuery.data?.data?.docs
      : followingQuery.data?.data?.docs;

  const isFetching =
    type === "followers"
      ? followersQuery.isFetching
      : followingQuery.isFetching;

  // const isFetching = 1

  let hasMore =
    type === "followers"
      ? followersQuery.data?.data.hasNextPage
      : followingQuery.data?.data.hasNextPage;

  return (
    <Dialog
      open={openUserListOverlay}
      // onOpenChange={setOpenUserListOverlay}
      modal={true}
      className={"p-0"}
    >
      <DialogContent
        showCloseButton={false}
        className={"p-0 bg-neutral-900 outline-none border-none rounded-3xl"}
      >
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only"></DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        <div>
          <div className="relative p-2">
            <h3 className="text-center font-bold dark:text-white text-md">
              {type == "followers" ? "Followers" : "Following"}
            </h3>
            <button
              className="absolute right-0 top-0 pr-3 pt-2 cursor-pointer active:scale-95 outline-none"
              onClick={() => {
                setOpenUserListOverlay(false);
                setPage(1);
                setUserListType("");
                // users = []
              }}
            >
              <X className="size-6.5" />
            </button>
          </div>

          <p className="w-full h-[0.1px] bg-neutral-800"></p>

          <div className="h-[350px] overflow-y-auto px-4.5">
            {users &&
              users.length > 0 &&
              users?.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-row justify-between items-center py-1.5"
                >
                  <div className="flex flex-row justify-center items-center">
                    <div className="size-11 rounded-full">
                      <img
                        className="size-full object-cover rounded-full"
                        src={item.avatar ? item.avatar : null}
                      />
                    </div>
                    <div className="text-sm ml-2">
                      <p className="dark:text-white font-bold ">
                        {item.username}
                      </p>
                      <p className="dark:text-neutral-400">{item.fullname}</p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => toggleFollow(item._id)}
                      disabled={isFollowUpdating[item._id]}
                      className={`${item.isFollowing ? "bg-neutral-800" : "bg-sky-600 dark:hover:bg-sky-700"}  rounded-md font-bold  dark:text-white text-sm px-4 py-1.5 cursor-pointer  active:scale-97`}
                    >
                      {isFollowUpdating[item._id] ? (
                        <Loader className="animate-spin" />
                      ) : item.isFollowing ? (
                        "Following"
                      ) : (
                        "Follow"
                      )}
                    </button>
                  </div>
                </div>
              ))}

            {/* Skeleton */}
            {isFetching &&
              page == 1 &&
              Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className=" flex flex-row justify-between items-center py-1.5 animate-pulse"
                >
                  <div className="flex flex-row justify-center items-center">
                    <div className="w-11 h-11 rounded-full bg-neutral-800"></div>
                    <div className="text-sm ml-2">
                      <p className="bg-neutral-800 rounded h-4 w-24 mb-1"></p>
                      <p className="bg-neutral-800 rounded h-4 w-32"></p>
                    </div>
                  </div>
                  <div>
                    {/* <button className="bg-neutral-800 rounded-md font-bold text-sm px-7 py-3 cursor-not-allowed"></button> */}
                  </div>
                </div>
              ))}

            {hasMore && (
              <button
                disabled={isFetching}
                onClick={() => setPage((prev) => prev + 1)}
                className="w-full text-center flex justify-center items-center"
              >
                {isFetching && page !== 1 ? (
                  <Loader className="animate-spin" />
                ) : (
                  <CirclePlus className="cursor-pointer hover:text-neutral-300 active:scale-95" />
                )}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserListOverlay;
