import IEstate from '../interfaces/api/IEstate';
import { cleanData } from '../utils/util';
import { db } from './firebase/firebaseConfig';
import {
    getDocs,
    collection,
    addDoc,
    GeoPoint,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    deleteField,
    query,
    where
} from 'firebase/firestore';

const collectionData = collection(db, 'estates');

export const getEstates = async () => {
    const response = await getDocs(collectionData);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });
    return responseData as IEstate[];
};

export const getEstateById = async (estateId: string) => {
    const estateRef = doc(db, 'estates', estateId);
    const response = await getDoc(estateRef);

    let responseData;
    if (response.exists()) {
        responseData = { id: response.id, ...response.data() };
    }

    return responseData as IEstate | undefined;
};

export const getEstatesByUserId = async (userId: string) => {
    const q = query(collectionData, where('userId', '==', userId));

    const response = await getDocs(q);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });

    return responseData as IEstate[];
};

export const addEstate = async (estateData: IEstate) => {
    const response = await addDoc(collectionData, cleanData(estateData));
    return response;
};

export const updateEstate = async (estateData: IEstate, estateId: string) => {
    const estateRef = doc(db, 'estates', estateId);

    await updateEstatePictures(estateId, estateData.pictureUrls);
    const response = await updateDoc(estateRef, cleanData({ ...estateData }, deleteField()));
    return response;
};

export const updateEstatePictures = async (estateId: string, newValue?: string[]) => {
    const estateRef = doc(db, 'estates', estateId);

    // remove all pictureUrls
    await updateDoc(estateRef, {
        pictureUrls: deleteField()
    });

    if (newValue) {
        // add new values
        newValue.forEach(async (x) => {
            await updateDoc(estateRef, {
                pictureUrls: arrayUnion(x)
            });
        });
    }
};
