import React, { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../Firebase";
import { useGlobalAuthContext } from "../Context";
import { useGlobalChatContext } from "../ChatContext";

const SideBarUser = () => {
  const [chats, setChats] = useState([]);
  const { currentUser, setIsSideBar } = useGlobalAuthContext();
  const { dispatch } = useGlobalChatContext();

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        //userChats*******************************
        // setChats(Object.entries(doc.data()));
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleUserChat = (userInfo) => {
    // console.log('handleuserchat');
    // console.log('user info', userInfo);
    dispatch({ type: "CHANGE_USER", payload: userInfo });
    setIsSideBar( false);
  };
  // console.log((chats));
  return (
    <>
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((item) => {
          // console.log('Items of sidebar',item);
          // console.log("sidebar user", item[1].lastMessage);
          return (
            <div
              className="users"
              key={item[0]}
              onClick={() => handleUserChat(item[1].userInfo)}
            >
              <img
                className="user_Img"
                src={item[1].userInfo.photoURL}
                alt={item[1].userInfo.displayName}
              />
              <span className="userDetails">
                <h3>{item[1].userInfo.displayName}</h3>
                <p style={{ color: "#9fa0a1" }}> {item[1].lastMessage}</p>
              </span>
            </div>
          );
        })}
    </>
  );
};

export default SideBarUser;
