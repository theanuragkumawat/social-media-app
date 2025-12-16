import React from "react";
import {
  User,
  Bell,
  Store,
  BarChart2,
  Lock,
  Star,
  Ban,
  EyeOff,
  Send,
  AtSign,
} from "lucide-react";
import { NavLink } from "react-router";

function AccountNavbar() {
  const menuSections = [
    {
      title: "How you use Instagram",
      items: [
        { icon: <User size={24} />, label: "Edit profile", path: "edit" },
        { icon: <Bell size={24} />, label: "Notifications", path: "noti" },
      ],
    },
    {
      title: "For professionals",
      items: [
        {
          icon: <Store size={24} />,
          label: "Professional account",
          path: "pro",
        },
        {
          icon: <BarChart2 size={24} />,
          label: "Creator tools and controls",
          path: "creator",
        },
      ],
    },
    {
      title: "Who can see your content",
      items: [
        { icon: <Lock size={24} />, label: "Account privacy", path: "pri" },
        { icon: <Star size={24} />, label: "Close Friends", path: "cf" },
        { icon: <Ban size={24} />, label: "Blocked", path: "block" },
        {
          icon: <EyeOff size={24} />,
          label: "Story and location",
          path: "loca",
        },
      ],
    },
    {
      title: "How others can interact with you",
      items: [
        {
          icon: <Send size={24} />,
          label: "Messages and story replies",
          path: "repl",
        },
        {
          icon: <AtSign size={24} />,
          label: "Tags and mentions",
          path: "tags",
        },
      ],
    },
  ];

  return (
    <>
      {/* <div className="!w-[20rem] shrink-0 "></div> */}
      <div
        className=" h-screen custom-scrollbar overflow-y-auto flex justify-center items-start shrink-0 w-[20rem] box-border top-0 left-
"
      >
        {/* Sidebar Container 
        - w-80: Fixed width suitable for sidebars
        - h-[600px]: Fixed height for demo (or use h-full)
        - overflow-y-auto: Enables scrolling
        - custom-scrollbar: Utility class (defined below)
      */}

        <div className="text-white px-4 ">
          <div className="px-5 pt-8 pb-6">
            <h3 className="font-bold text-xl tracking-tight">Settings</h3>
          </div>

          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-2">
              {/* Section Header */}
              <h3 className="px-4 py-3 text-xs font-semibold text-neutral-400">
                {section.title}
              </h3>

              {/* Menu Items */}
              <ul className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `${
                          isActive && "bg-neutral-800"
                        } flex items-center rounded-lg text-left transition-colors duration-200 hover:bg-neutral-700 text-white w-full  gap-4 px-4 py-3 `
                      }
                    >
                      {/* Icon Wrapper */}
                      <span className={`text-white`}>{item.icon}</span>

                      {/* Label */}
                      <span className="text-sm font-normal">{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default AccountNavbar;
