// auth.js
import { auth, provider, signInWithPopup, signOut } from './firebase';

const signInWithGoogle = async() => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
};

const signOutUser = async() => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
};

export { signInWithGoogle, signOutUser };