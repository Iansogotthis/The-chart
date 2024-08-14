// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firebase Authentication
  const auth = firebase.auth();
  
  // Google Auth Provider
  const provider = new firebase.auth.GoogleAuthProvider();
  
  // Login with Google
  document.getElementById('login').addEventListener('click', () => {
    auth.signInWithPopup(provider)
      .then((result) => {
        console.log('User signed in:', result.user);
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'block';
      })
      .catch((error) => {
        console.error('Error during sign in:', error);
      });
  });
  
  // Logout
  document.getElementById('logout').addEventListener('click', () => {
    auth.signOut()
      .then(() => {
        console.log('User signed out');
        document.getElementById('login').style.display = 'block';
        document.getElementById('logout').style.display = 'none';
      })
      .catch((error) => {
        console.error('Error during sign out:', error);
      });
  });
  
  // Check Auth State
  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log('User is signed in:', user);
      document.getElementById('login').style.display = 'none';
      document.getElementById('logout').style.display = 'block';
    } else {
      console.log('No user is signed in');
      document.getElementById('login').style.display = 'block';
      document.getElementById('logout').style.display = 'none';
    }
  });