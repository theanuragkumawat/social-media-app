import React, { useEffect, useState, useRef } from "react";
import { MessagesRightSidebar, MessagesSidebar } from "../components";
import { Send, Phone, Video, Info, Smile, Mic, Image as ImageIcon, Sticker } from 'lucide-react';
import { socket, getSocket } from "../utils/socket.js"
import { getChatUsers, getMessages, sendMessage } from "../utils/config.js";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import moment from "moment";

function Messages() {
  const location = useLocation()
  const { userData } = useSelector((state) => state.auth);
  // const messages = [
  //   { id: 1, text: 'Us me kay huva', sender: 'them', showAvatar: false },
  //   { id: 2, text: 'Puch le hii kay kr rhe h', sender: 'them', showAvatar: false },
  //   { id: 3, text: 'Ase vese', sender: 'them', showAvatar: false },
  //   { id: 4, text: 'Bas', sender: 'them', showAvatar: true },
  //   { id: 5, text: 'Achha', sender: 'me', showAvatar: false, isFirstInGroup: true },
  //   { id: 6, text: "Uski I'd h", sender: 'me', showAvatar: false },
  //   { id: 7, text: 'Nhi', sender: 'them', showAvatar: false, isFirstInGroup: true },
  //   { id: 8, text: 'Mere pas kl bta dungi', sender: 'them', showAvatar: false },
  //   { id: 9, text: 'Kl bta dungi abhi to net nhi h', sender: 'them', showAvatar: false },
  //   { id: 10, text: 'Verna dekh leti', sender: 'them', showAvatar: false },
  //   { id: 11, text: "I'd me dekh le mere me", sender: 'them', showAvatar: true },
  //   { id: 12, text: 'Theek hai', sender: 'me', showAvatar: false, isFirstInGroup: true },
  // ];
  const profileImageUrl = "https://i.pravatar.cc/150?img=47"; // Placeholder avatar
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [openRightSidebar, setOpenRightSidebar] = useState(false)
  const [inputMessage, setInputMessage] = useState("")
  console.log(inputMessage);

  // --- Pagination States ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // --- Refs ---
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null); 
  const prevScrollHeightRef = useRef(0);
  const prevScrollTopRef = useRef(0);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    
    // Prevent fetching if there aren't enough messages to even create a scrollbar
    if (scrollHeight <= clientHeight) return;

    // Check if the user is actually scrolling UP
    const isScrollingUp = scrollTop < prevScrollTopRef.current;
    prevScrollTopRef.current = scrollTop; // Update for next scroll event

    // If scrolled to top AND scrolling upwards AND have more messages
    if (scrollTop <= 10 && isScrollingUp && hasMore && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      getMessagesForUser(selectedUser._id, nextPage);
    }
};

  const scrollToBottom = () => {
    if (messagesEndRef.current && messages.length > 0) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  useEffect(() => {
    if (page === 1) {
      // Initial load: Scroll to bottom
      scrollToBottom();
    } else if (chatContainerRef.current) {
      // Pagination load: Adjust scroll so UI doesn't jump
      const newScrollHeight = chatContainerRef.current.scrollHeight;
      chatContainerRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current;
    }
  }, [messages]);

  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  useEffect(() => {
    // Check karein agar pichle page se 'userDetails' aayi hain
    if (location.state && location.state.userData) {
      setSelectedUser(location.state.userData);
    }
  }, [location]);

  async function getUsersForChat() {
    try {
      const response = await getChatUsers();
      console.log("Chat Users:", response);
      setUsers(response.data.data);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    }
  }

  async function getMessagesForUser(userId, pageNum = 1) {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    try {
      // Keep track of scroll height before adding older messages
      if (chatContainerRef.current) {
        prevScrollHeightRef.current = chatContainerRef.current.scrollHeight;
      }

      const response = await getMessages(userId, pageNum);
      const fetchedMessages = response.data.data;

      // If backend returns empty array or less than limit, we reached the end
      if (fetchedMessages.length === 0) {
        setHasMore(false);
      } else {
        if (pageNum === 1) {
          setMessages(fetchedMessages);
        } else {
          // Prepend older messages at the top
          setMessages((prev) => [...fetchedMessages, ...prev]);
        }
      }
    } catch (error) {
      console.error(`Error fetching messages with user ${userId}:`, error);
    } finally {
      setIsLoading(false);
    }
  }

  const sendMessageHandler = async function () {
    if (!inputMessage.trim()) return; 
    try {
      const messageData = { text: inputMessage.trim() };
      const response = await sendMessage( selectedUser._id, messageData);
      setInputMessage(""); 
      console.log(`Message sent to user ${selectedUser._id}:`, response);
      setMessages((prevMessages) => [...prevMessages, response.data.data]);
    } catch (error) {
      console.error(`Error sending message to user ${selectedUser._id}:`, error);
    }
  };

  function subscribeToMessages() {
    const currentSocket = getSocket();
    if (!currentSocket) return;

    currentSocket.on("newMessage", (message) => {
      console.log("Received message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });
  }

  function unsubscribeFromMessages() {
    const currentSocket = getSocket();
    if (currentSocket) {
      currentSocket.off("newMessage");
    }
  }

  // Remove `socket` from the dependency array, it is not reactive anyway.
  // Instead, rely on `selectedUser` to re-trigger the subscription.
  useEffect(() => {
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    }
  }, [selectedUser]);

  useEffect(() => {
    getUsersForChat();
  }, []);


  useEffect(() => {
    if (selectedUser) {
      setMessages([]);
      setPage(1);
      setHasMore(true);
      prevScrollTopRef.current = 0; // <--- ADD THIS LINE
      getMessagesForUser(selectedUser._id, 1);
    }
}, [selectedUser]);


  return (
    <div className="flex flex-row  rounded-lg  middle-part md:col-span-12 lg:col-span-10 xl:col-span-10">
      <div className="min-w-[400px] h-screen overflow-y-auto">
        <MessagesSidebar
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
          setUsers={setUsers}
        />
      </div>
      {/* Chat Conatiner */}
      {
        selectedUser ? <>
          <div className="flex-1 flex flex-col h-screen text-gray-100 ">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
              <div className="flex items-center gap-3 cursor-pointer">
                <img
                  src={selectedUser && selectedUser.avatar ? selectedUser.avatar : null}
                  alt="pic"
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-semibold text-base leading-tight">{selectedUser.fullname}</span>
                  <span className="text-xs text-gray-400">{selectedUser.username}</span>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-100">
                <Phone className="w-6 h-6 cursor-pointer hover:text-gray-300 transition  active:scale-95" />
                <Video className="w-6 h-6 cursor-pointer hover:text-gray-300 transition  active:scale-95" />
                <Info onClick={() => setOpenRightSidebar((prev) => (!prev))} className="w-6 h-6 cursor-pointer hover:text-gray-300 transition  active:scale-95" />
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col custom-scrollbar"
            ref={chatContainerRef}   // Add ref here
            onScroll={handleScroll}  // Add onScroll event here
          >
            {/* Loading Indicator at top */}
            {/* {isLoading && page > 1 ? (
               <div className="text-center text-xs text-gray-400  h-[1rem] ">
                 Loading older messages...
               </div>
            ) : <div className=" min-h-[1rem] "></div>} */}
            
              
              

              {Array.isArray(messages) && messages.length > 0 ? messages.map((msg, index) => {
                const isMe = msg.sender === userData._id;
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
                        className={`px-4 py-2 text-[15px] relative ${isMe
                          ? 'bg-[#3797f0] text-white rounded-2xl rounded-tr-sm'
                          : 'bg-[#262626] text-white rounded-2xl rounded-tl-sm'
                          }`}
                      >
                        <span className="mr-9">{msg.text}</span>
                        {/* Message Timestamp */}
                        <span className="text-[10px] text-gray-200 absolute bottom-[2px] right-2 ">
                          {moment(msg.createdAt).format('h:mm A')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }) : <div className="flex justify-center text-gray-500 items-center h-full tracking-tight uppercase font-semibold">
                No messages yet.
              </div>
              }
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-[#262626] relative">
              <div className="flex items-center bg-[#262626] rounded-full px-4 py-3 gap-3 min-h-[44px]">
                <button className="text-gray-400 hover:text-white transition focus:outline-none">
                  <Smile className="size-5.5 active:scale-95 hover:scale-105 cursor-pointer" />
                </button>

                <input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessageHandler();
                    }
                  }}
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
                <div className="flex items-center gap-3">
                  <button
                  onClick={sendMessageHandler}
                   disabled={!inputMessage.trim()} className="bg-sky-500 disabled:bg-sky-700 disabled:text-gray-200 disabled:cursor-auto rounded-3xl text-white px-3 py-1.5 hover:bg-sky-600 cursor-pointer active:scale-97 transition duration-75">
                    <Send className="size-5" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </> : <>
          <div className=" rounded-lg w-full  h-screen">
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
