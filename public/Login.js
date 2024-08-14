import React from 'react';
import { auth, provider, signInWithPopup } from './firebase';

const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  return (
    <button onClick={handleLogin}>Login with Google</button>
  );
};

export default Login;