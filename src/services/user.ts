import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { cleanData } from '../utils/util';

export const signUp = async (email: string, password: string) => {
    let response = await createUserWithEmailAndPassword(auth, email, password);
    return response;
};

export const login = async (email: string, password: string) => {
    let response = await signInWithEmailAndPassword(auth, email, password);
    return response;
};

export const addUser = async (userData: IUser, userId: string) => {
    const userRef = doc(db, 'users', userId);
    const response = await setDoc(userRef, cleanData(userData));
    return response;
};

export const getUserDataById = async (userId: string) => {
    const estateRef = doc(db, 'users', userId);
    const response = await getDoc(estateRef);

    let responseData;
    if (response.exists()) {
        responseData = { id: response.id, ...response.data() };
    }

    return responseData as IUser | undefined;
};

export const sendResetPasswordEmail = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        return false;
    }
};
