import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyAu9wb4uLC8eYtstDzvsKEc3KyxV2jGUmc',
    authDomain: 'you-rent-app.firebaseapp.com',
    projectId: 'you-rent-app',
    storageBucket: 'you-rent-app.appspot.com',
    messagingSenderId: '771389732518',
    appId: '1:771389732518:web:e9287b5bace290300a6667',
    measurementId: 'G-4L61V2MHQM'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
