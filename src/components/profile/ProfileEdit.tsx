import { useEffect, useRef, useState } from 'react';
import { closeOutline, cloudUploadOutline } from 'ionicons/icons';
import moment from 'moment';
import {
    IonButton,
    IonDatetime,
    IonDatetimeButton,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonPopover,
    IonSelect,
    IonSelectOption,
    IonTextarea
} from '@ionic/react';
import './ProfileEdit.scss';
import Modal from '../base/Modal';
import { validateFiles } from '../../utils/fileUtils';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '../../assets/svg-icons';
import { GenderType, RelationshipType } from '../../utils/enums';
import { deleteFile, getFileUrl, uploadFile } from '../../services/file';
import { updateUser } from '../../services/user';
import useNotification from '../../hooks/useNotification';

interface IProfileEdit {
    isVisible: boolean;
    onClose: Function;
    userData: IUser;
}

const ProfileEdit: React.FC<IProfileEdit> = ({ isVisible, onClose, userData }) => {
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic'];
    const setNotification = useNotification();
    const inputRef = useRef<HTMLInputElement>(null);
    const [photo, setPhoto] = useState<File>();
    const [pictureError, setPictureError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [photoUrl, setPhotoUrl] = useState<string>();
    const [fullName, setFullName] = useState<string>();
    const [phone, setPhone] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [facebookUrl, setFacebookUrl] = useState<string>();
    const [instagramUrl, setInstagramUrl] = useState<string>();
    const [linkedInUrl, setLinkedInUrl] = useState<string>();
    const [work, setWork] = useState<string>();
    const [education, setEducation] = useState<string>();
    const [from, setFrom] = useState<string>();
    const [birthday, setBirthday] = useState<string>(moment().toISOString(true));
    const [relationship, setRelationship] = useState<number>();
    const [gender, setGender] = useState<number>();

    useEffect(() => {
        if (userData) {
            setUserData();
        }
    }, [userData]);

    const setUserData = () => {
        setPhotoUrl(userData.photoURL);
        setFullName(userData.displayName);
        setPhone(userData.phoneNumber);
        setEmail(userData.email);
        setDescription(userData.description);
        setFacebookUrl(userData.facebookUrl);
        setInstagramUrl(userData.instagramUrl);
        setLinkedInUrl(userData.linkedInUrl);
        setWork(userData.workPlace);
        setEducation(userData.highestEducation);
        setFrom(userData.from);
        setBirthday(userData.birthday || moment().toISOString(true));
        setRelationship(userData.relationshipStatusType);
        setGender(userData.gender);
    };

    const resetState = () => {
        setPhoto(undefined);
        setPhotoUrl('');
        setPictureError(false);
        setFullName('');
        setPhone('');
        setEmail('');
        setDescription('');
        setFacebookUrl('');
        setInstagramUrl('');
        setLinkedInUrl('');
        setWork('');
        setEducation('');
        setFrom('');
        setBirthday(moment().toISOString(true));
        setRelationship(undefined);
        setGender(undefined);
    };

    const onCancel = () => {
        resetState();
        onClose();
    };

    const onDone = async () => {
        if (!fullName || !email || isLoading || !userData.id) {
            setNotification('Error!', 'error');
            return;
        }
        setIsLoading(true);
        let newUserData: IUser = {
            ...userData,
            photoURL: photoUrl,
            displayName: fullName,
            email,
            phoneNumber: phone,
            description,
            facebookUrl,
            instagramUrl,
            linkedInUrl,
            workPlace: work,
            highestEducation: education,
            from,
            birthday,
            relationshipStatusType: relationship,
            gender
        };

        if (photo && photo.size > 0) {
            let response = await uploadFile(photo);
            if (response) {
                newUserData.photoURL = await getFileUrl(response.fullPath);
            }
        }
        //delete existing photo
        if (userData.photoURL && userData.photoURL !== newUserData.photoURL) {
            let startIndex = userData.photoURL.lastIndexOf('/'),
                endIndex = userData.photoURL.indexOf('?');

            if (endIndex === -1) {
                endIndex = userData.photoURL.length;
            }

            let fileName = decodeURIComponent(userData.photoURL.slice(startIndex + 1, endIndex));
            if (fileName) {
                try {
                    await deleteFile(fileName);
                } catch (error) {
                    console.log({ error });
                }
            }
        }
        try {
            await updateUser(newUserData, userData.id);
            setNotification('Operation completed successfully!', 'success', () => {
                resetState();
                onClose(true);
                setIsLoading(false);
            });
        } catch (error) {
            setNotification('Error updating profile!', 'error');
        }
    };

    const onSelectFiles = async (filesData: {
        files: File[];
        hasErrors: boolean;
        errors: { code: string; fileName: string; fileSize: number }[] | null;
    }) => {
        if (filesData?.files?.length > 0) {
            setPictureError(false);
            setPhoto(filesData.files[0]);
            setPhotoUrl(URL.createObjectURL(filesData.files[0]));

            if (inputRef && inputRef.current) {
                inputRef.current.value = '';
            }
        }
    };

    const addFiles = async (files: File[]) => {
        let validation = { hasErrors: false, errors: null, validFileList: [] };
        if (files && files.length) {
            validation = validateFiles(files, validExtensions, undefined, '20Mb', true);
        }

        onSelectFiles({ files: validation.validFileList, hasErrors: validation.hasErrors, errors: validation.errors });
    };

    const handleFileChange = async (ev: any) => {
        let targetFileList = ev.target.files;
        addFiles(targetFileList);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                hidden
                multiple={false}
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
            />

            <IonPopover keepContentsMounted={true}>
                <IonDatetime
                    id="birthday-date"
                    value={birthday}
                    onIonChange={(ev) => {
                        setBirthday(ev.target.value as string);
                    }}
                    presentation="date"
                ></IonDatetime>
            </IonPopover>
            <Modal
                isVisible={isVisible}
                modalTitle="Edit profile"
                onStartButtonClick={onCancel}
                onEndButtonClick={onDone}
                extraClassNames="profile-add-edit-modal"
            >
                <IonList lines="full" className="profile-data">
                    <IonListHeader className="no-margin-top">
                        <IonLabel>General</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel position="stacked">
                            Full name<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            required={true}
                            aria-label="Full name"
                            placeholder="Enter full name..."
                            value={fullName}
                            onIonInput={(ev) => setFullName(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">
                            Email<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            required={true}
                            aria-label="email"
                            type="email"
                            placeholder="Enter email..."
                            value={email}
                            onIonInput={(ev) => setEmail(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Phone number</IonLabel>
                        <IonInput
                            aria-label="phone"
                            type="tel"
                            placeholder="Enter phone number..."
                            value={phone}
                            onIonInput={(ev) => setPhone(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem onClick={() => inputRef.current?.click()}>
                        <IonLabel>Profile picture</IonLabel>
                        {photoUrl && !pictureError ? (
                            <>
                                <img src={photoUrl} className="current-profile-photo" onError={() => setPictureError(true)} />
                                <IonButton
                                    fill="clear"
                                    color="danger"
                                    onClick={(ev) => {
                                        ev.stopPropagation();
                                        setPhoto(undefined);
                                        setPhotoUrl(undefined);
                                    }}
                                >
                                    <IonIcon slot="icon-only" icon={closeOutline} />
                                </IonButton>
                            </>
                        ) : (
                            <IonIcon icon={cloudUploadOutline} color="light"></IonIcon>
                        )}
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Description</IonLabel>
                        <IonTextarea
                            aria-label="description"
                            placeholder="Enter description..."
                            value={description}
                            onIonInput={(ev) => setDescription(ev.target.value as string)}
                        />
                    </IonItem>
                </IonList>
                <IonList lines="full" className="profile-data">
                    <IonListHeader>
                        <IonLabel>Details</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel position="stacked">From</IonLabel>
                        <IonInput
                            aria-label="from"
                            placeholder="Enter from..."
                            value={from}
                            onIonInput={(ev) => setFrom(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonSelect
                            placeholder="Please select an option"
                            label="Relationship status"
                            value={relationship}
                            onIonChange={(ev) => setRelationship(ev.target.value as number)}
                        >
                            <IonSelectOption value={RelationshipType.Single}>Single</IonSelectOption>
                            <IonSelectOption value={RelationshipType.Married}>Married</IonSelectOption>
                            <IonSelectOption value={RelationshipType.Relationship}>In a relationship</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Place of work</IonLabel>
                        <IonInput
                            aria-label="workplace"
                            placeholder="Enter workplace..."
                            value={work}
                            onIonInput={(ev) => setWork(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Birthday</IonLabel>
                        <IonDatetimeButton datetime="birthday-date"></IonDatetimeButton>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Highest education</IonLabel>
                        <IonInput
                            aria-label="education"
                            placeholder="Enter higher education..."
                            value={education}
                            onIonInput={(ev) => setEducation(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonSelect
                            placeholder="Please select an option"
                            label="Gender"
                            value={gender}
                            onIonChange={(ev) => setGender(ev.target.value as number)}
                        >
                            <IonSelectOption value={GenderType.Male}>Male</IonSelectOption>
                            <IonSelectOption value={GenderType.Female}>Female</IonSelectOption>
                            <IonSelectOption value={GenderType.NotSay}>I prefer to not say</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                </IonList>
                <IonList lines="full" className="profile-data">
                    <IonListHeader>
                        <IonLabel>Social</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <FacebookIcon slot="start" />
                        <IonInput
                            aria-label="Facebook url"
                            placeholder="Enter profile url..."
                            value={facebookUrl}
                            onIonInput={(ev) => setFacebookUrl(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <InstagramIcon slot="start" />
                        <IonInput
                            aria-label="Instagram url"
                            placeholder="Enter profile url..."
                            value={instagramUrl}
                            onIonInput={(ev) => setInstagramUrl(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <LinkedInIcon slot="start" />
                        <IonInput
                            aria-label="LinkedIn url"
                            placeholder="Enter profile url..."
                            value={linkedInUrl}
                            onIonInput={(ev) => setLinkedInUrl(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                </IonList>
            </Modal>
        </>
    );
};

export default ProfileEdit;
