import React from 'react';
import { IonList } from '@ionic/react';

import EstateListItem from './EstateListItem';
import IEstate from '../../interfaces/api/IEstate';

interface IEstateItemList {
    data: IEstate[];
    onItemClick: Function;
}

const EstateItemList: React.FC<IEstateItemList> = ({ data, onItemClick }) => {
    return (
        <IonList lines="none" className="estate-list">
            {data.map((x) => {
                return <EstateListItem estate={x} key={'estateId:' + x.id} onClick={onItemClick} />;
            })}
        </IonList>
    );
};

export default EstateItemList;
