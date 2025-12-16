import React from "react";
import { Outlet } from "react-router";
import AccountNavbar from "./AccountNavbar";

function SettingsLayout() {
  return (
    <div className="md:ml-14.5 lg:ml-0 box-border col-span-12 lg:col-span-10">
      <div className="flex flex-row">
        <AccountNavbar />
        <Outlet />
      </div>
    </div>
  );
}

export default SettingsLayout;
