import React, { useState } from "react";
import { AiOutlineSearch, AiOutlineLogout } from "react-icons/ai";
import SideBarUser from "./SideBarUser";
import { db, auth } from "../Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useGlobalAuthContext } from "../Context";

const Sidebar = () => {
  const { currentUser } = useGlobalAuthContext();

  const [searchUser, setSearchUser] = useState("");
  const [user, setUser] = useState(null); // for searched user
  const [err, setErr] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a query against the collection inside database.
    const q = query(
      collection(db, "users"),
      where("displayName", "==", searchUser)
    );
    //Execute a query
    //After creating a query object, use the getDocs() function to retrieve the results:
    try {
      const querySnapshot = await getDocs(q);
      // console.log("querySnapshot", querySnapshot);
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data());
        console.log("snapshot taken", doc.data());
      });
    } catch (error) {
      alert(error.message);
      setErr(true);
    }

    // setTimeout(() => {
    //   setErr(false);
    // }, 2000);
  };
  // console.log("user", user);
  const handleSearchedUser = async () => {
    // console.log('says',currentUser.uid > user.uid);
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    // console.log("res await", combinedId);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      console.log("res await", res);
      console.log("!res exists", !res.exists());
      // if res doesnot exists i.e. database with name "chats" doesnot exists then create one
      if (!res.exists()) {
        console.log("inside if not exists");
        await setDoc(doc(db, "chats", combinedId), {
          messages: [],
        });
        // }
        //create user chats for current user
        // updateDoc(doc(db, "userChats", currentUser.uid), {
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          // userChats**************************
          // [combinedId+".userInfo"] is the syntax to write dynamic variable with string
          [combinedId + ".userInfo"]: {
            // userInfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          // date: serverTimestamp(),
          [combinedId + ".date"]: serverTimestamp(),
          // },
        });
        //create user chats for user who is chatting ewith current user
        // updateDoc(doc(db, "userChats", user.uid), {
        updateDoc(doc(db, "userChats", user.uid), {
          // userChats**************************
          // [combinedId+".userInfo"] is the syntax to write dynamic variable with string
          // userInfo: {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
          // date: serverTimestamp(),
        });
      }
      // }*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-***-
    } catch (error) {
      // setErr(true)
      console.log(error);
    }
    setUser(null);
    setSearchUser("");
    // setIsSideBar(false);
  };
  // const [isSideBar, setIsSideBar] = useState(true)

  return (
    // <div className={`sideBar ${isSideBar && "is-active"}`}>
    <div className="SideBar_inside">
      <div className="headNav">
        <img className="user_Img" src={currentUser.photoURL} alt="123" />

        <h3>{currentUser.displayName}</h3>
        <button
          className="btn"
          onClick={() => {
            signOut(auth);
          }}
        >
          <AiOutlineLogout className="logout" />
        </button>
      </div>
      <div className="user_section">
        <br />
        <form className="user_form" onSubmit={handleSubmit}>
          <AiOutlineSearch className="search" />
          <input
            value={searchUser}
            className="user_Search"
            type="text"
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search or start new chat"
          />
        </form>
        {err && <h3>No user Found with this name</h3>}
        {user && (
          <div className="searchedUser" onClick={handleSearchedUser}>
            <img
              className="user_Img"
              src={user.photoURL}
              alt={user.displayName}
            />
            <span className="searchedUserDetails">
              <h3>{user.displayName}</h3>
            </span>
          </div>
        )}
        <br />
        <SideBarUser />
      </div>
    </div>
    // </div>
  );
};

export default Sidebar;
