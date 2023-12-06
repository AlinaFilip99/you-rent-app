import { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonRow, IonSearchbar, IonToolbar } from '@ionic/react';
import { optionsOutline, searchOutline } from 'ionicons/icons';

import './EstateList.scss';
import PageLayout from '../base/PageLayout';
import { getEstates } from '../../services/estate';
import PageInfo from '../base/PageInfo';
import EstateItemList from './EstateItemList';

const EstateList = () => {
    const [estates, setEstates] = useState<IEstate[]>();
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        let response = await getEstates();
        if (response) {
            setEstates(response);
        }
    };

    const onSearchChange = (ev: Event) => {
        let query = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();

        setSearchQuery(query);
    };

    return (
        <PageLayout
            pageClassName="estates-page"
            headerContent={
                <IonToolbar>
                    <IonRow className="header-row">
                        <IonSearchbar
                            value={searchQuery}
                            onIonChange={onSearchChange}
                            debounce={500}
                            inputMode="search"
                            showClearButton="focus"
                        ></IonSearchbar>
                        <IonButton fill="clear">
                            <IonIcon slot="icon-only" icon={optionsOutline}></IonIcon>
                        </IonButton>
                    </IonRow>
                </IonToolbar>
            }
        >
            {estates && estates.length > 0 ? (
                <EstateItemList data={estates} />
            ) : (
                <PageInfo icon={<IonIcon icon={searchOutline} />} />
            )}
        </PageLayout>
    );
};

export default EstateList;
