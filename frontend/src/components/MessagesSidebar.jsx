import {
  BadgeCheck,
  BadgePlus,
  CircleCheck,
  CirclePlus,
  CircleX,
  Loader,
  Search,
} from "lucide-react";
import { useState } from "react";
import { RiMessage3Line, RiMessage3Fill } from "react-icons/ri";

import moment from "moment/moment";

const chatData = [
  {
    _id: 1,
    name: "Anurag Kumawat",
    message: "You sent an attachment.",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=anurag", // Replace with actual image paths
    isVerified: false,
  },
  {
    _id: 2,
    name: "Nishant Tiwari",
    message: "Nishant sent an attachment.",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=nishant",
    isVerified: true,
  },
  {
    _id: 3,
    name: "Rαjeev Prajapat {pετεR}",
    message: "You sent an attachment.",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=rajeev",
    isVerified: false,
  },
  {
    _id: 4,
    name: "Lakshya",
    message: "You: Ye kaise ho gya",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=lakshya",
    isVerified: false,
  },
  {
    _id: 5,
    name: "Anurag Kumawat",
    message: "You sent an attachment.",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=anurag", // Replace with actual image paths
    isVerified: false,
  },
  {
    _id: 6,
    name: "Nishant Tiwari",
    message: "Nishant sent an attachment.",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=nishant",
    isVerified: true,
  },
  {
    _id: 7,
    name: "Rαjeev Prajapat {pετεR}",
    message: "You sent an attachment.",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=rajeev",
    isVerified: false,
  },
  {
    _id: 8,
    name: "Lakshya",
    message: "You: Ye kaise ho gya",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=lakshya",
    isVerified: false,
  },
  {
    _id: 9,
    name: "Sweety Sonawat",
    message: "You: Ye kaise ho gya",
    time: "1w",
    avatar: "https://i.pravatar.cc/150?u=lakshya",
    isVerified: false,
  },
];

function MessagesSidebar({ selectedUser, setSelectedUser, users, setUsers }) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [query, setQuery] = useState("");

  // const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(query.toLowerCase()) || user.fullname.toLowerCase().includes(query.toLowerCase()));

  const [loading, setLoading] = useState(false);
  // console.log("this", selectedUser);

  return (
    <div className="border-r-[0.5px] border-neutral-800 min-h-screen">
      <div className="">
        <div className="sticky top-0 z-50 bg-neutral-950">
          <div className=" justify-between flex items-center px-3  bg-neutral-800 py-3 ">
            <h2 className="text-2xl font-bold flex  items-center">
              <span className="mr-1">
                <RiMessage3Fill />
              </span>{" "}
              Messages
            </h2>
            <button className="cursor-pointer active:scale-97 hover:scale-103 transition-transform duration-100">
              <CirclePlus />
            </button>
          </div>

          <div className="px-2 mt-2 mx-4 relative flex flex-row justify-center items-center rounded-3xl bg-neutral-800">
            {!isSearchFocused && (
              <div className="flex justify-center items-center pl-2">
                <Search
                  size={15}
                  className=" text-neutral-400 pointer-events-none"
                />
              </div>
            )}

            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              autoFocus={false}
              placeholder="Search"
              className=" outline-none w-full py-2 pl-1.5 pr-3.5 text-base text-white placeholder:text-[15px] placeholder:text-neutral-400 placeholder:tracking-tight"
              type="text"
            />
            {loading ? (
              <Loader
                size={19}
                className="motion-safe:animate-spin text-neutral-200 pointer-events-none mr-1.5"
              />
            ) : (
              isSearchFocused && (
                <div
                  className="cursor-pointer"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setQuery("");
                  }}
                >
                  <CircleX
                    size={19}
                    className="text-neutral-900 fill-neutral-200 pointer-events-none mr-1.5"
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-neutral-950 min-h-screen w-full max-w-md mx-auto py-4 font-sans text-white">
          <div className="flex flex-col">
            {users.map((chat) => (
              <div
               onClick={() => {
                setSelectedUser(chat.user)
                setUsers((prevUsers) => (prevUsers.map((u) => u._id === chat.user._id ? { ...u, unreadCount: 0 } : u)))  
                
              }
              }
                key={chat.user._id}
                className={`${selectedUser && chat._id == selectedUser._id ? "bg-black/50" : ""} rounded-2xl flex items-center cursor-pointer hover:bg-neutral-800 py-2.5 px-4 active:scale-97`}
              >
                {/* Avatar Profile Picture */}
                <div className="shrink-0 relative">
                  <img
                    src={chat.user.avatar}
                    alt={`${chat.user.fullname}'s profile`}
                    className="w-[56px] h-[56px] rounded-full object-cover border border-neutral-800"
                  />
                </div>

                {/* Chat Details */}
                <div className="ml-4 flex-1 min-w-0">
                  {/* Name & Badge Row */}
                  <div className="flex items-center">
                    <span className="text-[15px] font-semibold text-gray-100 truncate tracking-tight">
                      {chat.user.fullname}
                    </span>
                  </div>

                  {/* Message & Timestamp Row */}
                  <div className="flex items-center text-[13px] text-gray-400 mt-0.5">
                    <span className="truncate">{chat.lastMessage}</span>
                    <span className="mx-1 px-0.5">·</span>
                    <span className="shrink-0">{moment(chat.lastMessageTime).fromNow()}</span>
                  </div>
                </div>
                <div className="ml-4">
                  {chat.unreadCount > 0 && (
                    <div className="min-w-[20px] px-1.5 py-0.5 rounded-full bg-[#3797f0] text-white text-xs font-semibold flex items-center justify-center">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>  
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessagesSidebar;
