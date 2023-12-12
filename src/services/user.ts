import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';

export const signUp = async (email: string, password: string) => {
    let response = await createUserWithEmailAndPassword(auth, email, password);
    return response;
};

export const login = async (email: string, password: string) => {
    let response = await signInWithEmailAndPassword(auth, email, password);
    return response;
};

export const getUserData = async (userId: string) => {
    // tbd
};

export const sendResetPasswordEmail = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        return false;
    }
};
