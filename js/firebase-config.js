// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAMHjRifpeu9WYX5N51p2qL2C6hLThluIk",
  authDomain: "asistencia-787da.firebaseapp.com",
  projectId: "asistencia-787da",
  storageBucket: "asistencia-787da.firebaseapp.storage.app",
  messagingSenderId: "371727664223",
  appId: "1:371727664223:web:5381e3155c2be15fe7c7ea",
  measurementId: "G-E3WT16ZHQ3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();