import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase";
// import { useGlobalAuthContext } from "../Context";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  // const { setCurrentUser } = useGlobalAuthContext();
  const loginHandler = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    //signing In the user
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // console.log(auth.currentUser.email);
      navigate("/"); // navigating to Home page after successfull signIn
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="displayForm">
      <div className="loginBtn">
        <span className="logo">
          <h2>WhatsApp Clone</h2>
        </span>
        <span className="title">
          <h3>Login</h3>
        </span>
        <form className="InputForm" onSubmit={(e) => loginHandler(e)}>
          <input type="email" placeholder="Email Id" />
          <input type="password" placeholder="Password" />

          <button className="SignIn" type="submit">
            Sign In
          </button>
        </form>
        <p>
          Don't have an account?
          <Link to="/registration">Register / Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
