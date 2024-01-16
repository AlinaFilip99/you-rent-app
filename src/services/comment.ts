import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { cleanData } from '../utils/util';

const collectionData = collection(db, 'comments');

export const getEstateComments = async (estateId: string) => {
    const q = query(collectionData, where('estateId', '==', estateId));

    const response = await getDocs(q);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });

    return responseData as IComment[];
};

export const getProfileComments = async (profileId: string) => {
    const q = query(collectionData, where('profileId', '==', profileId));

    const response = await getDocs(q);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });

    return responseData as IComment[];
};

export const updateCommentMessage = async (newMessage: string, commentId: string) => {
    const estateRef = doc(db, 'comments', commentId);

    const response = await updateDoc(estateRef, { message: newMessage });
    return response;
};

export const addComment = async (commentData: IComment) => {
    const response = await addDoc(collectionData, cleanData(commentData));
    return response;
};

export const deleteComment = async (commentId: string) => {
    let response = await deleteDoc(doc(db, 'comments', commentId));
    return response;
};
