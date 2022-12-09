import React, { useEffect, useRef } from "react";
import { formatRelative } from "date-fns/esm"; // yarn add date-fns
import { useGlobalAuthContext } from "../ContextHook/Context";

const Message = ({ message }) => {
  const ref = useRef();
  const { currentUser } = useGlobalAuthContext();
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      key={message.senderId}
      className={`messages ${message.senderId === currentUser.uid && "owner"}`}
    >
      {message.img && <img id="msgImg" src={message.img} alt="imgs" />}
      <p> {message.text} </p>
      <section className="subsection">
        {/* yarn add date-fns  will install the pkg and then use formatRelative(....)  */}
        <p>
          {formatRelative(new Date(message.date.seconds * 1000), new Date())}
        </p>
      </section>
    </div>
  );
};

export default Message;
