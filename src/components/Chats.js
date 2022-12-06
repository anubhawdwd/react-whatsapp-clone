import React from "react";
import {
  IoSendSharp,
  IoArrowBackOutline,
  IoAttachSharp,
} from "react-icons/io5";
import { BsFillEmojiSmileFill } from "react-icons/bs";
import Picker from "emoji-picker-react";    // yarn add emoji-picker-react
import Messages from "./Messages";
import { useState } from "react";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useGlobalAuthContext } from "../Context";
import { useGlobalChatContext } from "../ChatContext";
import { v4 as uuid } from "uuid";
import { db, storage } from "../Firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Chats = () => {
  const { currentUser, setIsSideBar } = useGlobalAuthContext();
  const { data } = useGlobalChatContext();

  const [text, setText] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [img, setImg] = useState(null);

  const handleInputMessage = async (e) => {
    e.preventDefault();

    if (img) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, img);
      uploadTask.on(
        (error) => {
          console.log("error while uploading image file", error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                img: downloadURL,
                senderName: currentUser.displayName,
                senderId: currentUser.uid,
                date: Timestamp.now(),
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderName: currentUser.displayName,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: text,
      [data.chatId + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: text,
      [data.chatId + ".date"]: serverTimestamp(),
    });
    setText("");
    setShowPicker(false);
    setImg(null);
  };

  return (
    <div className="Chat_inside">
      {/****************** Header Area ****************************/}
      <div className="headNav">
        <div className="chat_users" onClick={() => setIsSideBar(true)}>
          <IoArrowBackOutline className="topBack_btn" />
          <img
            className="user_Img"
            src={data.user?.photoURL}
            alt={data.user?.displayName}
          />
          <span className="chat_userDetails">
            <h3>{data.user?.displayName}</h3>
            <p> last seen today at 4:38 pm</p>
          </span>
        </div>
      </div>
      {/********************** Body Area ************************* */}
      <div className="message_Area">
        <Messages />
      </div>
      {/* ******************* Footer Area ********************** */}

      <div className="footer">
        <BsFillEmojiSmileFill
          className="smile"
          onClick={() => setShowPicker(!showPicker)}
        />

        <form onSubmit={handleInputMessage}>
          <input
            className="text_Input"
            type="text"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
        <input
          style={{ display: "none" }}
          type="file"
          id="file"
          onChange={(e) => setImg(e.target.files[0])}  // copy img file on img useState var
        />
        <label className="file" htmlFor="file">
          <IoAttachSharp className="send_btn" />
        </label>

        <IoSendSharp className="send_btn" onClick={handleInputMessage} />
      </div>
      {showPicker && (
        <div>
          <Picker
            onEmojiClick={(emojiObject) =>      // from documentation this is the syntax
              setText((prevMsg) => prevMsg + emojiObject.emoji)  
            }
          />
        </div>
      )}
    </div>
  );
};

export default Chats;
