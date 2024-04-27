import { getDocs, collection, query, where, addDoc, doc, updateDoc, deleteField } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import { cleanData } from '../utils/util';

const collectionData = collection(db, 'requests');

export const getRequests = async () => {
    const response = await getDocs(collectionData);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });
    return responseData as IRequest[];
};

export const getRequestsByReceiverId = async (receiverId: string) => {
    const q = query(collectionData, where('receiverId', '==', receiverId));

    const response = await getDocs(q);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });

    return responseData as IRequest[];
};

export const getRequestsBySenderId = async (senderId: string) => {
    const q = query(collectionData, where('senderId', '==', senderId));

    const response = await getDocs(q);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });

    return responseData as IRequest[];
};

export const addRequest = async (requestData: IRequest) => {
    const response = await addDoc(collectionData, cleanData(requestData));
    return response;
};

export const updateRequest = async (requestData: IRequest, requestId: string) => {
    const estateRef = doc(db, 'requests', requestId);

    const response = await updateDoc(estateRef, cleanData({ ...requestData }, deleteField()));
    return response;
};
