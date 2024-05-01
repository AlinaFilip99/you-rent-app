import { getDocs, collection, query, where, addDoc, doc, updateDoc, deleteField, getDoc, onSnapshot } from 'firebase/firestore';
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

export const getRequestById = async (requestId: string) => {
    const requestRef = doc(db, 'requests', requestId);
    const response = await getDoc(requestRef);

    let responseData;
    if (response.exists()) {
        responseData = { id: response.id, ...response.data() };
    }

    return responseData as IRequest | undefined;
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

export const getRequestMessages = async (requestId: string) => {
    const response = await getDocs(collection(db, 'requests', requestId, 'messages'));
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });

    return responseData as IRequestMessage[];
};

export const addMessage = async (requestId: string, messageData: IRequestMessage) => {
    const response = await addDoc(collection(db, 'requests', requestId, 'messages'), cleanData(messageData));
    return response;
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

export const onRequestMessageUpdate = (requestId: string, callback: Function) => {
    return onSnapshot(collection(db, 'requests', requestId, 'messages'), (response) => {
        const responseData = response.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
        });
        callback(responseData as IRequestMessage[]);
    });
};
