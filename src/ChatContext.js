import React, { useContext, useReducer } from "react";
import { useGlobalAuthContext } from "./Context";

const ChatContext = React.createContext();

const ChatAppProvider = ({ children }) => {
  const { currentUser } = useGlobalAuthContext();
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };
  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);
  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

const useGlobalChatContext = () => useContext(ChatContext);
export { ChatContext, ChatAppProvider, useGlobalChatContext };
