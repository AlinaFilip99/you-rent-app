import { db } from './firebase/firebaseConfig';
import { getDocs, collection } from 'firebase/firestore';

const collectionData = collection(db, 'estates');

export const getEstates = async () => {
    const response = await getDocs(collectionData);
    const responseData = response.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
    });
    return responseData as IEstate[];
};
