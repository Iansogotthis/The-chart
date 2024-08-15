import React from "react";
import { signInWithGoogle } from "./auth";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();
  const handleLogin = async () => {
    await signInWithGoogle();
    navigate("/profile"); // Redirect to the profile page
  };
  return <button onClick={handleLogin}>Login with Google</button>;
};
export default Login;
