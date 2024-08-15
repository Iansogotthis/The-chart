 import { auth, provider, signInWithPopup, signOut,  } from './firebase';
 const { getUserInfo } = require("@replit/repl-auth")
 const signInWithGoogle = async () => {
   try {
     await signInWithPopup(auth, provider);
   } catch (error) {
     console.error("Error signing in with Google", error);
   }
 };
 const signOutUser = async () => {
   try {
     await signOut(auth);
   } catch (error) {
     console.error("Error signing out", error);
   }
 };
 const getUserInfo = async () => {
   // Retrieve user information here (e.g., from Firebase)
   // Example using Replit Auth
   try {
     const user = await getUserInfo();
     return user; 
   } catch (error) {
     console.error("Error fetching user info:", error);
     return null;
   }
 };
 export { signInWithGoogle, signOutUser, getUserInfo };