import React from 'react';
import { IonList } from '@ionic/react';

import EstateListItem from './EstateListItem';

interface IEstateItemList {
    data: IEstate[];
}

const EstateItemList: React.FC<IEstateItemList> = ({ data }) => {
    return (
        <IonList lines="none" className="estate-list">
            {data.map((x) => {
                return <EstateListItem estate={x} key={'estateId:' + x.id} />;
            })}
        </IonList>
    );
};

export default EstateItemList;
