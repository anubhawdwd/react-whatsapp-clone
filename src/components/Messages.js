import React, { useState, useEffect } from "react";
import { db } from "../Firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useGlobalChatContext } from "../ContextHook/ChatContext";

import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);

  const { data } = useGlobalChatContext();


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
        return <Message key={m.id} message={m} />;
      })}
    </>
  );
};

export default Messages;
