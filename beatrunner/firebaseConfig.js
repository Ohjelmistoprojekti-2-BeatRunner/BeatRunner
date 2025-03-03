// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBghLChdo2enLZKlifQw__ndtGrbqXRpRw",
    authDomain: "beatr-88a8b.firebaseapp.com",
    projectId: "beatr-88a8b",
    storageBucket: "beatr-88a8b.firebasestorage.app",
    messagingSenderId: "522680956492",
    appId: "1:522680956492:web:35f2a3bab5e511cddd66e9",
    measurementId: "G-0JXC7SP58V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

//npm install - g firebase - tools
//import { auth } from "./firebaseConfig" Login sivulle tämä



export { auth };

