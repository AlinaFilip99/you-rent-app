import React from 'react';
import Menu from '../base/Menu';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonRange, IonRow, IonToggle } from '@ionic/react';
import './EstateFilters.scss';

interface IEstateFilters {
    onClose: Function;
    applyFilters: Function;
}

const EstateFilters: React.FC<IEstateFilters> = ({ onClose, applyFilters }) => {
    const onClear = () => {
        applyFilters();
        onClose();
    };

    const onFiltersClose = () => {
        onClose();
    };

    const onConfirm = () => {
        //tbd
        onClose();
    };

    return (
        <Menu
            menuTitle="Filters"
            menuId="filters-menu"
            onClose={onFiltersClose}
            onClear={onClear}
            footerContent={
                <IonRow className="ion-justify-content-center">
                    <IonButton onClick={onConfirm}>Confirm</IonButton>
                </IonRow>
            }
            extraClassNames="estate-filters-menu"
        >
            <IonList lines="full">
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Price</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput label="From" labelPlacement="stacked"></IonInput>
                            <IonInput label="To" labelPlacement="stacked"></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Number of bedrooms</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput label="From" labelPlacement="stacked"></IonInput>
                            <IonInput label="To" labelPlacement="stacked"></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Number of bathrooms</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput label="From" labelPlacement="stacked"></IonInput>
                            <IonInput label="To" labelPlacement="stacked"></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Habitable surface</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput label="From" labelPlacement="stacked"></IonInput>
                            <IonInput label="To" labelPlacement="stacked"></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Year of construction</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput label="From" labelPlacement="stacked"></IonInput>
                            <IonInput label="To" labelPlacement="stacked"></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonLabel>Show only posts with pictures</IonLabel>
                        <IonToggle></IonToggle>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonLabel>Show only posts with private parking</IonLabel>
                        <IonToggle></IonToggle>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonLabel>Show only posts with extra storage</IonLabel>
                        <IonToggle></IonToggle>
                    </IonRow>
                </IonItem>
            </IonList>
        </Menu>
    );
};

export default EstateFilters;
