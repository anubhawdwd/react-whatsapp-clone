import React, { useState, useContext, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
const AuthContext = React.createContext();
const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isSideBar, setIsSideBar] = useState(true);
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => {
      unsub();
    };
  }, []);
  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, isSideBar, setIsSideBar }}
    >
      {children}
    </AuthContext.Provider>
  );
};
const useGlobalAuthContext = () => useContext(AuthContext);
export { AuthContext, AppProvider, useGlobalAuthContext };
