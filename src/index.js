import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { AppProvider } from "./ContextHook/Context";
import { ChatAppProvider } from "./ContextHook/ChatContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AppProvider>
    <ChatAppProvider>
      {/* <React.StrictMode> */}
      <App />
      {/* </React.StrictMode> */}
    </ChatAppProvider>
  </AppProvider>
);
