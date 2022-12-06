import Chats from "../components/Chats";
import Sidebar from "../components/Sidebar";
// import SideBarUser from "../components/SideBarUser";
import { useGlobalAuthContext } from "../Context";
function Home() {
  const { isSideBar } = useGlobalAuthContext();
  return (
    <>
    {isSideBar? <Sidebar/>:<Chats/>}
      {/* <div className="app_box">
          <div className={`sideBar ${isSideBar && "is-active"}`}>
            <Sidebar />
          </div>
        <div className="chats">
          <Chats />
        </div>
      </div> */}
    </>
  );
}

export default Home;
