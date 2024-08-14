// Login.js
import React from 'react';
import { signInWithGoogle } from './auth';

const Login = () => {
  return (
    <button onClick={signInWithGoogle}>Login with Google</button>
  );
};

export default Login;