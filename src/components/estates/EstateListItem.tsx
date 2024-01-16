import React, { useMemo, useState } from 'react';
import { star } from 'ionicons/icons';
import { IonIcon, IonItem, IonRow } from '@ionic/react';

import './EstateListItem.scss';
import OverflowText from '../base/OverflowText';
import ImageFallback from '../base/ImageFallback';
import { BathroomIcon, BedroomIcon, SurfaceIcon } from '../../assets/svg-icons';
import IEstate from '../../interfaces/api/IEstate';

interface IEstateListItem {
    estate: IEstate;
    onClick: Function;
}

const EstateListItem: React.FC<IEstateListItem> = ({ estate, onClick }) => {
    const { scoreValue, estatePicture } = useMemo(() => {
        let value,
            estatePicture = '';

        if (estate.score) {
            value = estate.score;
        }
        if (estate.pictureUrls && estate.pictureUrls.length > 0) {
            estatePicture = estate.pictureUrls[0];
        }

        return { scoreValue: value, estatePicture };
    }, [estate]);

    return (
        <IonItem className="estate-list-item" onClick={() => onClick(estate.id)}>
            <IonRow className="estate-item">
                <ImageFallback className="estate-image" url={estatePicture} />
                <IonRow className="estate-data">
                    <IonRow className="estate-name-price ion-justify-content-between">
                        <div>{estate.name}</div>
                        <div className="estate-price">{estate.price + ' €'}</div>
                    </IonRow>
                    {(estate.bedrooms || estate.bathrooms) && (
                        <IonRow className="estate-details ion-justify-content-between">
                            {estate.bedrooms && (
                                <IonRow className="estate-detail">
                                    <BedroomIcon />
                                    <OverflowText text={estate.bedrooms + ' bedroom' + (estate.bedrooms > 1 ? 's' : '')} />
                                </IonRow>
                            )}
                            {estate.bathrooms && (
                                <IonRow className="estate-detail">
                                    <BathroomIcon />
                                    <OverflowText text={estate.bathrooms + ' bathroom' + (estate.bathrooms > 1 ? 's' : '')} />
                                </IonRow>
                            )}
                        </IonRow>
                    )}
                    {(estate.habitableArea || scoreValue) && (
                        <IonRow className="estate-details ion-justify-content-between">
                            {estate.habitableArea && (
                                <IonRow className="estate-detail">
                                    <SurfaceIcon />
                                    <OverflowText text={estate.habitableArea + ' m2'} />
                                </IonRow>
                            )}
                            {scoreValue && (
                                <IonRow className="estate-detail">
                                    <IonIcon icon={star} />
                                    <OverflowText text={scoreValue + ' / 5 stars'} />
                                </IonRow>
                            )}
                        </IonRow>
                    )}
                </IonRow>
            </IonRow>
        </IonItem>
    );
};

export default EstateListItem;
