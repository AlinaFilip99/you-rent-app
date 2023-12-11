import IEstate from '../interfaces/api/IEstate';
import { db } from './firebase/firebaseConfig';
import { getDocs, collection, addDoc, GeoPoint } from 'firebase/firestore';

const collectionData = collection(db, 'estates');

export const getEstates = async () => {
    const response = await getDocs(collectionData);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });
    return responseData as IEstate[];
};

export const addEstate = async (estateData: IEstate) => {
    let cleanData: { [key: string]: number | string | boolean | undefined | string[] | GeoPoint } = { ...estateData };
    Object.keys(cleanData).forEach((key) => {
        if (!cleanData[key]) {
            delete cleanData[key];
        }
    });

    const response = await addDoc(collectionData, cleanData);
    return response;
};
