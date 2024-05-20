import React, { useEffect, useState } from 'react';
import { IonCheckbox, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonSelect, IonSelectOption } from '@ionic/react';

import './CriteriaAddEdit.scss';
import Modal from '../base/Modal';
import { HeetingType } from '../../utils/enums';
import useNotification from '../../hooks/useNotification';
import { addSearchCriteria, updateSearchCriteria } from '../../services/user';
import userProfile from '../../services/userProfile';

interface ICriteriaAddEdit {
    isVisible: boolean;
    onClose: Function;
    criteria?: ISearchCriteria;
}

const CriteriaAddEdit: React.FC<ICriteriaAddEdit> = ({ isVisible, onClose, criteria }) => {
    const setNotification = useNotification();
    const [priceMin, setPriceMin] = useState<number>();
    const [priceMax, setPriceMax] = useState<number>();
    const [city, setCity] = useState<string>();
    const [country, setCountry] = useState<string>();
    const [zip, setZip] = useState<string>();
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
        if (criteria) {
            setIsEdit(true);
            setCriteriaData();
        } else {
            resetState();
        }
    }, [criteria]);

    const setCriteriaData = () => {
        setPriceMax(criteria?.priceMax);
        setPriceMin(criteria?.priceMin);
        setCity(criteria?.city);
        setCountry(criteria?.country);
        setBedrooms(criteria?.bedrooms);
        setBathrooms(criteria?.bathrooms);
        setSurface(criteria?.habitableArea);
        setConstructionYear(criteria?.constructionYear);
        setHeetingType(criteria?.heetingType);
        setParking(criteria?.hasPrivateParking || false);
        setStorage(criteria?.hasExtraStorage || false);
    };

    const resetState = () => {
        setIsEdit(false);
        setPriceMin(undefined);
        setPriceMax(undefined);
        setCity(undefined);
        setCountry(undefined);
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
        if (!priceMin || !priceMax || !city || !country || !bedrooms || isLoading) {
            setNotification('Error!', 'error');
            return;
        }
        setIsLoading(true);
        let criteriaData: ISearchCriteria = {
            priceMin,
            priceMax,
            city,
            country,
            constructionYear,
            zip,
            bedrooms,
            bathrooms,
            habitableArea: surface,
            heetingType,
            hasPrivateParking: parking,
            hasExtraStorage: storage
        };
        if (isEdit && criteria && criteria.id) {
            try {
                await updateSearchCriteria(criteriaData, userProfile.UserId, criteria.id);
                setNotification('Operation completed successfully!', 'success', () => {
                    resetState();
                    onClose(true);
                    setIsLoading(false);
                });
            } catch (error) {
                setNotification('Error updating estate!', 'error');
            }
        } else {
            let response = await addSearchCriteria(userProfile.UserId, criteriaData);
            if (response.id) {
                setNotification('Operation completed successfully!', 'success', () => {
                    resetState();
                    onClose(true);
                    setIsLoading(false);
                });
            }
        }
    };

    return (
        <Modal
            isVisible={isVisible}
            modalTitle={isEdit ? 'Edit criteria' : 'Create criteria'}
            onStartButtonClick={onCancel}
            onEndButtonClick={onDone}
            extraClassNames="criteria-add-edit-modal"
        >
            <IonList lines="full" className="criteria-data">
                <IonItem>
                    <IonLabel position="stacked">
                        Min price<span className="reguired-star">*</span>
                    </IonLabel>
                    <IonInput
                        aria-label="price"
                        type="number"
                        placeholder="Enter min price..."
                        value={priceMin}
                        onIonInput={(ev) => setPriceMin(ev.target.value as number)}
                    ></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">
                        Max price<span className="reguired-star">*</span>
                    </IonLabel>
                    <IonInput
                        aria-label="price"
                        type="number"
                        placeholder="Enter max price..."
                        value={priceMax}
                        onIonInput={(ev) => setPriceMax(ev.target.value as number)}
                    ></IonInput>
                </IonItem>
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
                    <IonLabel position="stacked">Zip</IonLabel>
                    <IonInput
                        aria-label="zip"
                        placeholder="Enter zip..."
                        value={zip}
                        onIonInput={(ev) => setZip(ev.target.value as string)}
                    ></IonInput>
                </IonItem>
            </IonList>
            <IonList lines="full" className="criteria-data">
                <IonListHeader>
                    <IonLabel>More details</IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonLabel position="stacked">
                        Min number of bedrooms<span className="reguired-star">*</span>
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
                    <IonLabel position="stacked">Min number of bathrooms</IonLabel>
                    <IonInput
                        aria-label="bathrooms"
                        type="number"
                        placeholder="Enter number of bathrooms..."
                        value={bathrooms}
                        onIonInput={(ev) => setBathrooms(ev.target.value as number)}
                    ></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Min habitable surface</IonLabel>
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
                        With private parking?
                    </IonCheckbox>
                </IonItem>
                <IonItem>
                    <IonCheckbox checked={storage} onIonChange={() => setStorage(!storage)}>
                        With extra storage?
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
                    <IonLabel position="stacked">Min construction year</IonLabel>
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
    );
};

export default CriteriaAddEdit;
