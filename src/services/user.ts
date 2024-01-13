import {
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
    updatePassword
} from 'firebase/auth';
import { auth, db } from './firebase/firebaseConfig';
import { deleteField, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { cleanData } from '../utils/util';

export const signUp = async (email: string, password: string) => {
    let response = await createUserWithEmailAndPassword(auth, email, password);
    return response;
};

export const login = async (email: string, password: string) => {
    let response = await signInWithEmailAndPassword(auth, email, password);
    return response;
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        return false;
    }
    return true;
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

export const updateUser = async (userData: IUser, userId: string) => {
    const userRef = doc(db, 'users', userId);

    const response = await updateDoc(userRef, cleanData({ ...userData }, deleteField()));
    return response;
};

export const changePassword = async (newPassword: string) => {
    const user = auth.currentUser;

    try {
        if (user) {
            await updatePassword(user, newPassword);
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
    return true;
};

export const sendResetPasswordEmail = async (email: string) => {
    try {
        await sendPasswordResetEmail(auth, email);
        return true;
    } catch (error) {
        return false;
    }
};
