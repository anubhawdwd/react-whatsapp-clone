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
import { useGlobalAuthContext } from "../ContextHook/Context";

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
      where("displayName", "==", searchUser.toLowerCase())
    );
    console.log(searchUser.toLowerCase());
    //Execute a query
    //After creating a query object, use the getDocs() function to retrieve the results:
    try {
      const querySnapshot = await getDocs(q);
      console.log("querySnapshot", querySnapshot.empty);
      querySnapshot.empty && setErr(true);

      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        setUser(doc.data());
        console.log("snapshot taken", doc.data());
      });
    } catch (error) {
      alert(error.message);
      setErr(true);
    }

    setTimeout(() => {
      setErr(false);
      setSearchUser("")
    }, 3000);
  };

  const handleSearchedUser = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

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
        //create user chats for current user
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          // [combinedId+".userInfo"] is the syntax to write dynamic variable with string
          [combinedId + ".userInfo"]: {
            // userInfo: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        //create user chats for user who is chatting ewith current user
        updateDoc(doc(db, "userChats", user.uid), {
          // [combinedId+".userInfo"] is the syntax to write dynamic variable with string
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
      // }*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*--*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-***-
    } catch (error) {
      setErr(true);
      console.log(error);
    }
    setUser(null);
    setSearchUser("");
  };

  return (
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
            placeholder="Search User"
          />
        </form>
        {err && (
          <div className="searchedUser">
            <span className="searchedUserErr">
              <h3>
                {`No User Found with "  ${searchUser} "`} <br /> Try Again
              </h3>
            </span>
          </div>
        )}
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
  );
};

export default Sidebar;
