import React from 'react';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Profile = () => {
  const [user] = useAuthState(auth);

  return (
    <div>
      <h2>Profile Page</h2>
      {user && (
        <div>
          <p>Name: {user.displayName}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Profile;
