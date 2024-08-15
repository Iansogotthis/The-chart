// Profile.js
import React, { useState, useEffect } from 'react';
import { getUserInfo } from './auth';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await getUserInfo();
      setUser(userInfo);
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.username}!</h1>
      <p>Email: {user.email}</p>
      <p>Replit ID: {user.id}</p>
    </div>
  );
};

export default Profile;

>> +
  