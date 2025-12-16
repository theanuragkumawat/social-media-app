import React from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";

function Layout() {
  return (
    <>
      <div className="">
        <div className="grid grid-cols-12 divide-neutral-800">
          <Navbar />
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default Layout;
