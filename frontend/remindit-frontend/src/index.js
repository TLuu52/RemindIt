import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'firebase/firestore';
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBM2IPle4soof4cFSBawrNtGYQwLU4jkYo",
//   authDomain: "remindit-87ab4.firebaseapp.com",
//   projectId: "remindit-87ab4",
//   storageBucket: "remindit-87ab4.appspot.com",
//   messagingSenderId: "665682857025",
//   appId: "1:665682857025:web:8de84ed843278aa093cac0",
//   measurementId: "G-7HQMEG4K16"
// };

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

// Initialize Firebase Authentication/Firestore and get a reference to the service
// const auth = getAuth(app);
// const firestore = getFirestore(app);

const container = document.getElementById('root')

const root = ReactDOM.createRoot(container)

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
