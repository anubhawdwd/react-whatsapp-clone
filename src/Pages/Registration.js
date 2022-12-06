import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../Firebase";
import add from "../img/add.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
// import { useGlobalAuthContext } from "../Context";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  // const {setCurrentUser} = useGlobalAuthContext();
  const navigate = useNavigate();
  const [err, setErr] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3]?.files[0];
    // console.log(displayName, email, password, file);
    try {
      //create User
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const storageRef = ref(storage, displayName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        (error) => {
          // console.log(error);
        },
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigate("/");
          });
        }
      );
    } catch (error) {
      setErr(true);
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
          <h3>Registration</h3>
        </span>
        <form className="InputForm" onSubmit={handleSubmit}>
          <input type="text" placeholder="Username" />
          <input type="email" placeholder="Email Id" />
          <input type="password" placeholder="Password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label className="file" htmlFor="file">
            <img src={add} alt="add" /> <p>Upload Profile Pic</p>
          </label>
          <button className="SignIn"> Sign Up </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
        {err && <span> Something Went Wrong </span>}
      </div>
    </div>
  );
};

export default Registration;
