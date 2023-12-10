import React from 'react';
import { IonLabel } from '@ionic/react';
import './PageInfo.scss';

interface IPageInfo {
    icon: React.ReactNode;
    text?: string;
    info?: string;
}

const PageInfo: React.FC<IPageInfo> = ({ text, icon, info }) => {
    return (
        <div className="page-info">
            <div>{icon}</div>
            <IonLabel class="basic-info">{text || 'No results!'}</IonLabel>
            {info && <div className="more-info">{info}</div>}
        </div>
    );
};

export default PageInfo;
