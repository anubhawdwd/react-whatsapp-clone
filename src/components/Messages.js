import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useGlobalChatContext } from "../ChatContext";


import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
 
  const { data } = useGlobalChatContext();
  
  // const ref = useRef();

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });
    return () => {
      unsub();
    };
  }, [data.chatId]); //data.chatId

 

  return (
    <>
      {messages.map((m) => {
        // console.log("m",m);
        // setNewMsg(newMsg + 1);
        return (
          <Message key={m.id} message={m} />
        );
      })}
    </>
  );
};

export default Messages;
