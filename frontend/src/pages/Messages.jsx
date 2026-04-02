import React, { useState } from "react";
import { MessagesRightSidebar, MessagesSidebar } from "../components";
import { Send, Phone, Video, Info, Smile, Mic, Image as ImageIcon, Sticker } from 'lucide-react';

function Messages() {
  const messages = [
    { id: 1, text: 'Us me kay huva', sender: 'them', showAvatar: false },
    { id: 2, text: 'Puch le hii kay kr rhe h', sender: 'them', showAvatar: false },
    { id: 3, text: 'Ase vese', sender: 'them', showAvatar: false },
    { id: 4, text: 'Bas', sender: 'them', showAvatar: true },
    { id: 5, text: 'Achha', sender: 'me', showAvatar: false, isFirstInGroup: true },
    { id: 6, text: "Uski I'd h", sender: 'me', showAvatar: false },
    { id: 7, text: 'Nhi', sender: 'them', showAvatar: false, isFirstInGroup: true },
    { id: 8, text: 'Mere pas kl bta dungi', sender: 'them', showAvatar: false },
    { id: 9, text: 'Kl bta dungi abhi to net nhi h', sender: 'them', showAvatar: false },
    { id: 10, text: 'Verna dekh leti', sender: 'them', showAvatar: false },
    { id: 11, text: "I'd me dekh le mere me", sender: 'them', showAvatar: true },
    { id: 12, text: 'Theek hai', sender: 'me', showAvatar: false, isFirstInGroup: true },
  ];
  const profileImageUrl = "https://i.pravatar.cc/150?img=47"; // Placeholder avatar

  const [selectedUser, setSelectedUser] = useState(true)
  const [openRightSidebar,setOpenRightSidebar] = useState(false)

  return (
    <div className="flex flex-row border rounded-lg border-red-600 middle-part md:col-span-12 lg:col-span-10 xl:col-span-10">
      <div className="min-w-[400px] h-screen overflow-y-auto">
        <MessagesSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      </div>
      {/* Chat Conatiner */}
      {
        selectedUser ? <>
          <div className="flex-1 flex flex-col h-screen text-gray-100 ">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
              <div className="flex items-center gap-3 cursor-pointer">
                <img
                  src={profileImageUrl}
                  alt="Annu"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-base leading-tight">Annu</span>
                  <span className="text-xs text-gray-400">anjuswami704</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-100">
                <Phone className="w-6 h-6 cursor-pointer hover:text-gray-300 transition  active:scale-95" />
                <Video className="w-6 h-6 cursor-pointer hover:text-gray-300 transition  active:scale-95" />
                <Info onClick={() => setOpenRightSidebar((prev) => (!prev))} className="w-6 h-6 cursor-pointer hover:text-gray-300 transition  active:scale-95" />
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col custom-scrollbar">
              {messages.map((msg, index) => {
                const isMe = msg.sender === 'me';
                const marginClass = msg.isFirstInGroup ? 'mt-6' : 'mt-1';

                return (
                  <div
                    key={index}
                    className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${marginClass}`}
                  >
                    <div className="flex items-end gap-2 max-w-[70%]">
                      {/* Avatar for 'them' messages */}
                      {!isMe && (
                        <div className="w-8 flex-shrink-0">
                          {msg.showAvatar && (
                            <img
                              src={profileImageUrl}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`px-4 py-2 text-[15px] ${isMe
                          ? 'bg-[#3797f0] text-white rounded-2xl rounded-tr-sm'
                          : 'bg-[#262626] text-white rounded-2xl rounded-tl-sm'
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#262626] relative">
              <div className="flex items-center bg-[#262626] rounded-full px-4 py-3 gap-3 min-h-[44px]">
                <button className="text-gray-400 hover:text-white transition focus:outline-none">
                  <Smile className="size-5.5 active:scale-95 hover:scale-105 cursor-pointer" />
                </button>

                <input
                  type="text"
                  placeholder="Message..."
                  className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-[15px]"
                />

                <div className="flex items-center gap-3 text-gray-400">
                  <button className="hover:text-white transition focus:outline-none">
                    <Mic className="size-5.5 active:scale-95 hover:scale-105 cursor-pointer" />
                  </button>
                  <button className="hover:text-white transition focus:outline-none">
                    <input type="file" id="image-upload" accept="image/png, image/jpeg" hidden />
                    <label htmlFor="image-upload">
                      <ImageIcon className="size-5.5 active:scale-95 hover:scale-105 cursor-pointer" />
                    </label>
                  </button>
                  <button className="hover:text-white transition focus:outline-none">
                    <Sticker className="size-5.5 active:scale-95 hover:scale-105 cursor-pointer" />
                  </button>
                </div>
                {/* Send btn */}
                {/* <div className="flex items-center gap-3 absolute right-6">
                  <button className="bg-sky-500 rounded-3xl text-white px-3 py-1.5 hover:bg-sky-600 cursor-pointer active:scale-97 transition duration-75">
                  <Send className="size-5" />
                  </button>
                </div> */}

              </div>
            </div>
          </div>
        </> : <>
          <div className="border rounded-lg w-full border-blue-600 h-screen">
            <div className="flex justify-center items-center h-screen">
              <div>
                <div className="rounded-full border-2 border-white size-30 flex justify-center items-center mx-auto">
                  <Send className="size-20 stroke-1 -translate-x-1 translate-y-1" />
                </div>
                <p className="text-xl font-bold text-gray-300 mt-4 text-center"> Your messages</p>
                <p className="text-sm text-neutral-400 mt-2">Send a message to start a chat.</p>
                <div className="w-full justify-center flex">

                  <button className="mt-4 px-4 py-2 text-sm font-bold rounded-xl bg-blue-600 text-white  hover:bg-blue-700 transition active:scale-95 cursor-pointer">
                    Send a message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {
        openRightSidebar &&
        <MessagesRightSidebar selectedUser={selectedUser} />
      }
    </div>
  );
}

export default Messages;
