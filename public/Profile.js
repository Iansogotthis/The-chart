// Profile.js
import React from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { signOutUser } from './auth';

const Profile = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h2>Profile Page</h2>
      {user && (
        <div>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
          <button onClick={signOutUser}>Sign Out</button>
        </div>
      )}
    </div>
  );
};

export default Profile;