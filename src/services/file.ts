import { formatISODateTime } from './../utils/util';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase/firebaseConfig';
import moment from 'moment';
import { getFileExtension, getFileNameWithoutExtension } from '../utils/fileUtils';

export const uploadFile = async (file: File) => {
    const storageRef = ref(
        storage,
        getFileNameWithoutExtension(file.name) + '-' + formatISODateTime(moment()) + '.' + getFileExtension(file.name)
    );
    let response = await uploadBytes(storageRef, file);
    return response.metadata;
};

export const getFileUrl = async (filePath: string) => {
    const response = await getDownloadURL(ref(storage, filePath));
    return response;
};

export const deleteFile = async (fileName: string) => {
    const fileRef = ref(storage, fileName);

    let response = await deleteObject(fileRef);
    return response;
};
