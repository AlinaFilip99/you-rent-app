import React, { useEffect, useRef, useState } from 'react';
import {
    IonCheckbox,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle,
    useIonToast
} from '@ionic/react';
import { closeOutline, cloudUploadOutline, locationOutline } from 'ionicons/icons';
import { GeoPoint } from 'firebase/firestore';
import { Marker } from 'pigeon-maps';

import './EstateAddEdit.scss';
import Modal from '../base/Modal';
import { HeetingType } from '../../utils/enums';
import SelectOnMap from '../base/SelectOnMap';
import GenericMap from '../base/GenericMap';
import { validateFiles } from '../../utils/fileUtils';
import { deleteFile, getFileUrl, uploadFile } from '../../services/file';
import IEstate from '../../interfaces/api/IEstate';
import { addEstate, updateEstate } from '../../services/estate';
import { capitalize } from '../../utils/util';
import userProfile from '../../services/userProfile';

interface IEstateAddEdit {
    isVisible: boolean;
    onClose: Function;
    estate?: IEstate;
}

const EstateAddEdit: React.FC<IEstateAddEdit> = ({ isVisible, onClose, estate }) => {
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic'];
    const [present] = useIonToast();
    const inputRef = useRef<HTMLInputElement>(null);
    const [showExtraAddressFields, setShowExtraAddressFields] = useState<boolean>(false);
    const [photos, setPhotos] = useState<File[]>();
    const [initialPhotos, setInitialPhotos] = useState<File[]>();
    const [showMap, setShowMap] = useState<boolean>(false);
    const [coordinates, setCoordinates] = useState<GeoPoint>();
    const [title, setTitle] = useState<string>();
    const [price, setPrice] = useState<number>();
    const [description, setDescription] = useState<string>();
    const [city, setCity] = useState<string>();
    const [country, setCountry] = useState<string>();
    const [zip, setZip] = useState<string>();
    const [number, setNumber] = useState<string>();
    const [street, setStreet] = useState<string>();
    const [region, setRegion] = useState<string>();
    const [extraInfo, setExtraInfo] = useState<string>();
    const [bedrooms, setBedrooms] = useState<number>();
    const [bathrooms, setBathrooms] = useState<number>();
    const [surface, setSurface] = useState<number>();
    const [constructionYear, setConstructionYear] = useState<number>();
    const [heetingType, setHeetingType] = useState<number>();
    const [parking, setParking] = useState<boolean>(false);
    const [storage, setStorage] = useState<boolean>(false);
    const [isEdit, setIsEdit] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (estate) {
            setIsEdit(true);
            setEstateData();
        } else {
            resetState();
        }
    }, [estate]);

    const getFileNames = () => {
        let pictureUrls: File[];
        if (estate?.pictureUrls) {
            pictureUrls = [];
            estate.pictureUrls.forEach((x) => {
                let startIndex = x.lastIndexOf('/'),
                    endIndex = x.indexOf('?');

                if (endIndex === -1) {
                    endIndex = x.length;
                }

                let picture = new File([''], decodeURIComponent(x.slice(startIndex + 1, endIndex)));
                pictureUrls.push(picture);
            });

            setInitialPhotos(pictureUrls);
            return pictureUrls;
        }
    };

    const setEstateData = () => {
        setPhotos(getFileNames());
        setCoordinates(estate?.coordinates);
        setTitle(estate?.name);
        setPrice(estate?.price);
        setDescription(estate?.description);
        setCity(estate?.city);
        setCountry(estate?.country);
        setRegion(estate?.region);
        setZip(estate?.zip);
        setNumber(estate?.region);
        setStreet(estate?.street);
        setExtraInfo(estate?.addressExtra);
        setBedrooms(estate?.bedrooms);
        setBathrooms(estate?.bathrooms);
        setSurface(estate?.habitableArea);
        setConstructionYear(estate?.constructionYear);
        setHeetingType(estate?.heetingType);
        setParking(estate?.hasPrivateParking || false);
        setStorage(estate?.hasExtraStorage || false);
    };

    const setNotification = (message: string, type?: string, callback?: Function) => {
        present({
            message: capitalize(message),
            duration: type === 'error' ? undefined : 1500,
            position: 'top',
            buttons:
                type === 'error'
                    ? [
                          {
                              icon: closeOutline,
                              role: 'cancel'
                          }
                      ]
                    : undefined,
            color: type === 'error' ? 'danger' : 'success',
            onDidDismiss: () => {
                callback && callback();
            }
        });
    };

    const resetState = () => {
        setIsEdit(false);
        setShowExtraAddressFields(false);
        setPhotos(undefined);
        setCoordinates(undefined);
        setTitle(undefined);
        setPrice(undefined);
        setDescription(undefined);
        setCity(undefined);
        setCountry(undefined);
        setRegion(undefined);
        setZip(undefined);
        setNumber(undefined);
        setStreet(undefined);
        setExtraInfo(undefined);
        setBedrooms(undefined);
        setBathrooms(undefined);
        setSurface(undefined);
        setConstructionYear(undefined);
        setHeetingType(undefined);
        setParking(false);
        setStorage(false);
    };

    const onCancel = () => {
        resetState();
        onClose();
    };

    const onDone = async () => {
        if (!title || !price || !city || !country || !bedrooms || !bathrooms || !surface || isLoading) {
            setNotification('Error!', 'error');
            return;
        }
        setIsLoading(true);
        let estateData: IEstate = {
            score: 0,
            isActive: true,
            userId: userProfile.UserId,
            name: title,
            price,
            description,
            city,
            country,
            constructionYear,
            zip,
            number,
            street,
            region,
            addressExtra: extraInfo,
            bedrooms,
            bathrooms,
            habitableArea: surface,
            heetingType,
            hasPrivateParking: parking,
            hasExtraStorage: storage,
            coordinates
        };
        let pictureUrls: string[] = [];
        if (photos && photos.length) {
            for (let x of photos) {
                if (x.size > 0) {
                    let response = await uploadFile(x);
                    if (response) {
                        pictureUrls.push(await getFileUrl(response.fullPath));
                    }
                } else {
                    pictureUrls.push(await getFileUrl(x.name));
                }
            }
        }
        if (isEdit && initialPhotos && initialPhotos?.length > 0) {
            for (let x of initialPhotos) {
                if (photos) {
                    if (!photos.some((y) => x.name === y.name)) {
                        try {
                            await deleteFile(x.name);
                        } catch (error) {
                            console.log({ error });
                        }
                    }
                } else {
                    try {
                        await deleteFile(x.name);
                    } catch (error) {
                        console.log({ error });
                    }
                }
            }
        }
        if (pictureUrls.length > 0) {
            estateData.pictureUrls = pictureUrls;
        }
        if (isEdit && estate && estate.id) {
            try {
                await updateEstate(estateData, estate.id);
                setNotification('Operation completed successfully!', 'success', () => {
                    resetState();
                    onClose(true);
                    setIsLoading(false);
                });
            } catch (error) {
                setNotification('Error updating estate!', 'error');
            }
        } else {
            let response = await addEstate(estateData);
            if (response.id) {
                setNotification('Operation completed successfully!', 'success', () => {
                    resetState();
                    onClose(true);
                    setIsLoading(false);
                });
            }
        }
    };

    const onSelectLocationClose = (selectedCoordinates?: [number, number]) => {
        if (selectedCoordinates) {
            let lat = selectedCoordinates[0],
                long = selectedCoordinates[1];

            if (coordinates?.latitude !== lat || coordinates.longitude !== long) {
                let geoPoint = new GeoPoint(lat, long);
                setCoordinates(geoPoint);
            }
        } else {
            setCoordinates(undefined);
        }
        setShowMap(false);
    };

    const onSelectFiles = async (filesData: any) => {
        if (filesData?.files?.length > 0) {
            let newPhotos = photos ? [...photos] : [];
            filesData.files.forEach((x: File) => {
                let existingPhoto = newPhotos.find((y) => y.name === x.name);
                if (!existingPhoto) {
                    newPhotos.push(x);
                }
            });

            setPhotos(newPhotos);

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

    const removePhoto = (fileName: string) => {
        let newValue = photos ? [...photos] : [];
        setPhotos(newValue.filter((x) => x.name !== fileName));
    };

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                hidden
                multiple={true}
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
            />
            <SelectOnMap isVisible={showMap} onClose={onSelectLocationClose} />
            <Modal
                isVisible={isVisible}
                modalTitle={isEdit ? 'Edit estate' : 'Create estate'}
                onStartButtonClick={onCancel}
                onEndButtonClick={onDone}
                extraClassNames="estate-add-edit-modal"
            >
                <IonList lines="full" className="estate-data">
                    <IonListHeader className="no-margin-top">
                        <IonLabel>General</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel position="stacked">
                            Title<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            required={true}
                            aria-label="title"
                            placeholder="Enter title..."
                            value={title}
                            onIonInput={(ev) => setTitle(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">
                            Price<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            aria-label="price"
                            type="number"
                            placeholder="Enter price..."
                            value={price}
                            onIonInput={(ev) => setPrice(ev.target.value as number)}
                        ></IonInput>
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
                    <IonItem onClick={() => inputRef.current?.click()}>
                        <IonLabel>Upload pictures</IonLabel>
                        <IonIcon icon={cloudUploadOutline} color="light"></IonIcon>
                    </IonItem>
                    {photos && photos.length > 0 && (
                        <IonItem>
                            <IonList lines="full" style={{ width: '100%' }}>
                                {photos.map((x) => {
                                    return (
                                        <IonItem key={'photo:' + x.name}>
                                            <IonLabel color="light">{x.name}</IonLabel>
                                            <IonIcon
                                                icon={closeOutline}
                                                color="danger"
                                                onClick={() => removePhoto(x.name)}
                                            ></IonIcon>
                                        </IonItem>
                                    );
                                })}
                            </IonList>
                        </IonItem>
                    )}
                </IonList>
                <IonList lines="full" className="estate-data">
                    <IonListHeader>
                        <IonLabel>Address</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel position="stacked">
                            City<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            aria-label="city"
                            placeholder="Enter city..."
                            value={city}
                            onIonInput={(ev) => setCity(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">
                            Country<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            aria-label="country"
                            placeholder="Enter country..."
                            value={country}
                            onIonInput={(ev) => setCountry(ev.target.value as string)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel>Show more fields</IonLabel>
                        <IonToggle
                            aria-label="more-fields"
                            mode="md"
                            checked={showExtraAddressFields}
                            onIonChange={() => setShowExtraAddressFields(!showExtraAddressFields)}
                        ></IonToggle>
                    </IonItem>
                    {showExtraAddressFields && (
                        <>
                            <IonItem>
                                <IonLabel position="stacked">Street</IonLabel>
                                <IonInput
                                    aria-label="street"
                                    placeholder="Enter street..."
                                    value={street}
                                    onIonInput={(ev) => setStreet(ev.target.value as string)}
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Number</IonLabel>
                                <IonInput
                                    aria-label="number"
                                    placeholder="Enter number..."
                                    value={number}
                                    onIonInput={(ev) => setNumber(ev.target.value as string)}
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Zip</IonLabel>
                                <IonInput
                                    aria-label="zip"
                                    placeholder="Enter zip..."
                                    value={zip}
                                    onIonInput={(ev) => setZip(ev.target.value as string)}
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Region</IonLabel>
                                <IonInput
                                    aria-label="region"
                                    placeholder="Enter region..."
                                    value={region}
                                    onIonInput={(ev) => setRegion(ev.target.value as string)}
                                ></IonInput>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Extra information</IonLabel>
                                <IonInput
                                    aria-label="extra-info"
                                    placeholder="Enter extra info..."
                                    value={extraInfo}
                                    onIonInput={(ev) => setExtraInfo(ev.target.value as string)}
                                ></IonInput>
                            </IonItem>
                            <IonItem onClick={() => setShowMap(true)}>
                                <IonLabel>Add coordinates</IonLabel>
                                <IonIcon icon={locationOutline} color="light"></IonIcon>
                            </IonItem>
                            {coordinates && (
                                <IonItem className="generic-map-item">
                                    <GenericMap initialCenter={[coordinates.latitude, coordinates.longitude]} initialZoom={17}>
                                        <Marker
                                            width={50}
                                            anchor={[coordinates.latitude, coordinates.longitude]}
                                            color="var(--ion-color-secondary)"
                                        />
                                    </GenericMap>
                                </IonItem>
                            )}
                        </>
                    )}
                </IonList>
                <IonList lines="full" className="estate-data">
                    <IonListHeader>
                        <IonLabel>Details</IonLabel>
                    </IonListHeader>
                    <IonItem>
                        <IonLabel position="stacked">
                            Number of bedrooms<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            aria-label="bedrooms"
                            type="number"
                            placeholder="Enter number of bedrooms..."
                            value={bedrooms}
                            onIonInput={(ev) => setBedrooms(ev.target.value as number)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">
                            Number of bathrooms<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            aria-label="bathrooms"
                            type="number"
                            placeholder="Enter number of bathrooms..."
                            value={bathrooms}
                            onIonInput={(ev) => setBathrooms(ev.target.value as number)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">
                            Habitable surface<span className="reguired-star">*</span>
                        </IonLabel>
                        <IonInput
                            aria-label="surface"
                            type="number"
                            placeholder="Enter habitable surface..."
                            value={surface}
                            onIonInput={(ev) => setSurface(ev.target.value as number)}
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonCheckbox checked={parking} onIonChange={() => setParking(!parking)}>
                            Has private parking?
                        </IonCheckbox>
                    </IonItem>
                    <IonItem>
                        <IonCheckbox checked={storage} onIonChange={() => setStorage(!storage)}>
                            Has extra storage?
                        </IonCheckbox>
                    </IonItem>
                    <IonItem>
                        <IonSelect
                            placeholder="Please select an option"
                            label="Heeting type"
                            value={heetingType}
                            onIonChange={(ev) => setHeetingType(ev.target.value as number)}
                        >
                            <IonSelectOption value={HeetingType.UnderfloorHeating}>Underfloor heating</IonSelectOption>
                            <IonSelectOption value={HeetingType.Radiators}>Radiators</IonSelectOption>
                            <IonSelectOption value={HeetingType.GasFurnace}>Gas furnace</IonSelectOption>
                            <IonSelectOption value={HeetingType.HeatPump}>Heat pump</IonSelectOption>
                            <IonSelectOption value={HeetingType.WallHeaters}>Wall heaters</IonSelectOption>
                            <IonSelectOption value={HeetingType.BaseboardHeaters}>Baseboard heaters</IonSelectOption>
                            <IonSelectOption value={HeetingType.Furnace}>Furnace</IonSelectOption>
                        </IonSelect>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">Construction year</IonLabel>
                        <IonInput
                            aria-label="construction-year"
                            type="number"
                            placeholder="Enter construction year..."
                            value={constructionYear}
                            onIonInput={(ev) => setConstructionYear(ev.target.value as number)}
                        ></IonInput>
                    </IonItem>
                </IonList>
            </Modal>
        </>
    );
};

export default EstateAddEdit;
