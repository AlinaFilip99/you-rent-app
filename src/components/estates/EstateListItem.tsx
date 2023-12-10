import React, { useMemo } from 'react';
import { star } from 'ionicons/icons';
import { IonIcon, IonItem, IonRow } from '@ionic/react';

import './EstateListItem.scss';
import OverflowText from '../base/OverflowText';
import { BathroomIcon, BedroomIcon, SurfaceIcon } from '../../assets/svg-icons';

interface IEstateListItem {
    estate: IEstate;
}

const EstateListItem: React.FC<IEstateListItem> = ({ estate }) => {
    const { scoreValue, estatePicture } = useMemo(() => {
        let value = 0,
            estatePicture = './assets/img/estate-fallback.png';

        if (estate.score) {
            value = (estate.score * 5) / 100;
        }
        if (estate.pictures && estate.pictures.length > 0) {
            estatePicture = estate.pictures[0].url;
        }

        return { scoreValue: value, estatePicture };
    }, [estate]);

    return (
        <IonItem className="estate-list-item">
            <IonRow className="estate-item">
                <img className="estate-image" src={estatePicture} alt="img" />
                <IonRow className="estate-data">
                    <IonRow className="estate-name-price ion-justify-content-between">
                        <div>{estate.name}</div>
                        <div className="estate-price">{estate.price}</div>
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