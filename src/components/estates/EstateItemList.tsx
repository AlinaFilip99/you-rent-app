import React from 'react';
import { IonIcon, IonList } from '@ionic/react';
import { homeOutline } from 'ionicons/icons';

import EstateListItem from './EstateListItem';
import PageInfo from '../base/PageInfo';
import IEstate from '../../interfaces/api/IEstate';

interface IEstateItemList {
    data?: IEstate[];
    onItemClick: Function;
}

const EstateItemList: React.FC<IEstateItemList> = ({ data, onItemClick }) => {
    return data && data.length > 0 ? (
        <IonList lines="none" className="estate-list">
            {data.map((x) => {
                return <EstateListItem estate={x} key={'estateId:' + x.id} onClick={onItemClick} />;
            })}
        </IonList>
    ) : (
        <PageInfo icon={<IonIcon icon={homeOutline} />} />
    );
};

export default EstateItemList;
