import React, { useState } from 'react';
import {
    IonCheckbox,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonToggle
} from '@ionic/react';

import './EstateAddEdit.scss';
import Modal from '../base/Modal';
import { HeetingType } from '../../utils/enums';

interface IEstateAddEdit {
    isVisible: boolean;
    onClose: Function;
}

const EstateAddEdit: React.FC<IEstateAddEdit> = ({ isVisible, onClose }) => {
    const [showExtraAddressFields, setShowExtraAddressFields] = useState<boolean>(false);

    const onCancel = () => {
        //tbd
        onClose();
    };

    const onDone = () => {
        //tbd
        onClose();
    };

    return (
        <Modal
            isVisible={isVisible}
            modalTitle="Create estate"
            onStartButtonClick={onCancel}
            onEndButtonClick={onDone}
            extraClassNames="estate-add-edit-modal"
        >
            <IonList lines="full" className="estate-data">
                <IonListHeader className="no-margin-top">
                    <IonLabel>General</IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonLabel position="stacked">Title</IonLabel>
                    <IonInput placeholder="Enter title..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Price</IonLabel>
                    <IonInput type="number" placeholder="Enter price..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Description</IonLabel>
                    <IonTextarea placeholder="Enter description..." />
                </IonItem>
            </IonList>
            <IonList lines="full" className="estate-data">
                <IonListHeader>
                    <IonLabel>Address</IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonLabel position="stacked">City</IonLabel>
                    <IonInput placeholder="Enter city..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Country</IonLabel>
                    <IonInput placeholder="Enter country..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>Show more fields</IonLabel>
                    <IonToggle
                        mode="md"
                        checked={showExtraAddressFields}
                        onIonChange={() => setShowExtraAddressFields(!showExtraAddressFields)}
                    ></IonToggle>
                </IonItem>
                {showExtraAddressFields && (
                    <>
                        <IonItem>
                            <IonLabel position="stacked">Street</IonLabel>
                            <IonInput placeholder="Enter street..."></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Number</IonLabel>
                            <IonInput placeholder="Enter number..."></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Zip</IonLabel>
                            <IonInput placeholder="Enter zip..."></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Region</IonLabel>
                            <IonInput placeholder="Enter region..."></IonInput>
                        </IonItem>
                        <IonItem>
                            <IonLabel position="stacked">Extra information</IonLabel>
                            <IonInput placeholder="Enter extra info..."></IonInput>
                        </IonItem>
                    </>
                )}
            </IonList>
            <IonList lines="full" className="estate-data">
                <IonListHeader>
                    <IonLabel>Details</IonLabel>
                </IonListHeader>
                <IonItem>
                    <IonLabel position="stacked">Number of bedrooms</IonLabel>
                    <IonInput type="number" placeholder="Enter number of bedrooms..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Number of bathrooms</IonLabel>
                    <IonInput type="number" placeholder="Enter number of bathrooms..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Habitable surface</IonLabel>
                    <IonInput type="number" placeholder="Enter habitable surface..."></IonInput>
                </IonItem>
                <IonItem>
                    <IonLabel>Has private parking?</IonLabel>
                    <IonCheckbox />
                </IonItem>
                <IonItem>
                    <IonLabel>Has extra storage?</IonLabel>
                    <IonCheckbox />
                </IonItem>
                <IonItem>
                    <IonLabel>Heeting type</IonLabel>
                    <IonSelect placeholder="Please select an option">
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
                    <IonInput type="number" placeholder="Enter construction year..."></IonInput>
                </IonItem>
            </IonList>
        </Modal>
    );
};

export default EstateAddEdit;
