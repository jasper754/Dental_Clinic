import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'; // Add this import

const firebaseConfig = {
  apiKey: 'AIzaSyBPl-L82sag70DPoSBST6MYWfnyiV5Kr3Y',
  authDomain: 'dentalclinicreservation.firebaseapp.com',
  projectId: 'dentalclinicreservation',
  storageBucket: 'dentalclinicreservation.firebasestorage.app',
  messagingSenderId: '164850519980',
  appId: '1:164850519980:web:65a01b6bd43a0c4a0df409',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app);  // Export Firestore instance
