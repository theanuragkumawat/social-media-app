import {useState} from 'react'
import { Bell } from 'lucide-react';


function MessagesRightSidebar({selectedUser}) {
const [isMuted, setIsMuted] = useState(false);

  // Mock data for the member shown in the screenshot
  const member = {
    name: 'Sweety Sonawat',
    username: 'raw__rants',
    avatarUrl: 'https://i.pravatar.cc/150?img=32' // Placeholder image
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-[350px]  text-gray-100 font-sans border-l border-[#262626]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#262626]">
        <h2 className="text-xl font-bold tracking-wide">Details</h2>
      </div>

      {/* Mute Messages Toggle */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#262626]">
        <div className="flex items-center gap-3 cursor-pointer">
          <Bell className="w-6 h-6 text-gray-100" />
          <span className="text-[15px]">Mute messages</span>
        </div>
        
        {/* Custom Toggle Switch */}
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className={`w-9 h-5 rounded-full relative transition-colors focus:outline-none ${
            isMuted ? 'bg-blue-500' : 'bg-[#262626]'
          }`}
          aria-pressed={isMuted}
        >
          <div 
            className={`absolute left-[2px] top-[2px] w-4 h-4 rounded-full transition-transform duration-200 ease-in-out ${
              isMuted ? 'translate-x-4 bg-white' : 'bg-[#737373]'
            }`} 
          />
        </button>
      </div>

      {/* Members Section For group (Flex-grow to push actions to the bottom) */}
      {/* <div className="flex-1 px-6 py-5 overflow-y-auto">
        <h3 className="text-[15px] font-bold mb-4">Members</h3>
        
        <div className="flex items-center gap-3 cursor-pointer hover:bg-[#1a1a1a] p-2 -mx-2 rounded-lg transition-colors">
          <img
            src={member.avatarUrl}
            alt={member.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-[15px] leading-tight text-gray-100">{member.name}</span>
            <span className="text-sm text-gray-400">{member.username}</span>
          </div>
        </div>
      </div> */}

<div className="flex-1 px-6 py-5 overflow-y-auto"> 

</div>
      {/* Bottom Actions */}
      <div className="border-t border-[#262626] flex flex-col py-2">
        <button className="w-full text-left px-6 py-3 text-[15px] text-gray-100 hover:bg-[#1a1a1a] transition-colors focus:outline-none">
          Nicknames
        </button>
        <button className="w-full text-left px-6 py-3 text-[15px] text-gray-100 hover:bg-[#1a1a1a] transition-colors focus:outline-none">
          Block
        </button>
        <button className="w-full text-left px-6 py-3 text-[15px] text-[#ed4956] hover:bg-[#1a1a1a] transition-colors focus:outline-none">
          Report
        </button>
        <button className="w-full text-left px-6 py-3 text-[15px] text-[#ed4956] hover:bg-[#1a1a1a] transition-colors focus:outline-none">
          Delete chat
        </button>
      </div>
    </div>
  );
};
export default MessagesRightSidebar