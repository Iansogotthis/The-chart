import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import Login from './Login';
import { auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA0yb7NcFYj648foilzdpUVWUyoOqr0VOw",
  authDomain: "seismic-fx-422005-e9.firebaseapp.com",
  projectId: "seismic-fx-422005-e9",
  storageBucket: "seismic-fx-422005-e9.appspot.com",
  messagingSenderId: "466306927010",
  appId: "1:466306927010:web:b229583110098687ba0afb"
};

const App = () => {
    const [user] = useAuthState(auth);
    return (
      <Router>
        <Routes>
          <Route path = "/" element={user ? <Home/>:<Login/>} />
          <Route path = "/profile" element={user ? <Profile/>:<Login/>}/>
        </Routes>
      </Router>
    )

}

export default App;