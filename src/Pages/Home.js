import Chats from "../components/Chats";
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useGlobalAuthContext } from "../ContextHook/Context";
function Home() {
  const { isSideBar } = useGlobalAuthContext();
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
    return () => {
      window.removeEventListener("resize", () => setWidth(window.innerWidth));
    };
  }, [width]);
  if (width < 505) {
    return <>{isSideBar ? <Sidebar /> : <Chats />}</>;
  } else {
    return (
      <>
        <div className="app_box">
          <div className="sideBar">
            <Sidebar />
          </div>
          <div className="chats">
            <Chats />
          </div>
        </div>
      </>
    );
  }
}

export default Home;
