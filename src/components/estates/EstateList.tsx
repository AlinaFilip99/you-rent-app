import { useEffect, useState } from 'react';
import { IonButton, IonIcon, IonRow, IonSearchbar, IonToolbar } from '@ionic/react';
import { optionsOutline, searchOutline } from 'ionicons/icons';
import { menuController } from '@ionic/core/components';

import './EstateList.scss';
import PageLayout from '../base/PageLayout';
import { getEstates } from '../../services/estate';
import PageInfo from '../base/PageInfo';
import EstateItemList from './EstateItemList';
import EstateFilters from './EstateFilters';

const EstateList = () => {
    const [estates, setEstates] = useState<IEstate[]>();
    const [initialEstateList, setInitialEstateList] = useState<IEstate[]>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [appliedFilters, setAppliedFilters] = useState<IEstateFilterValues>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        filterEstates();
    }, [searchQuery, appliedFilters]);

    const load = async () => {
        setIsLoading(true);
        let response = await getEstates();
        if (response) {
            setEstates(response);
            setInitialEstateList(response);
        }
        setIsLoading(false);
    };

    const setIncludeItemByRange = (includeItem: boolean, estateValue: number, range?: IRange) => {
        if (range) {
            if (range.lower && estateValue < range.lower) {
                includeItem = false;
            }
            if (range.upper && estateValue > range.upper) {
                includeItem = false;
            }
        }
        return includeItem;
    };

    const setIncludeItemByAppliedFilters = (includeItem: boolean, estate: IEstate) => {
        if (appliedFilters) {
            let score = estate.score ? (estate.score * 5) / 100 : 0;
            let {
                minScore,
                price,
                bedrooms,
                bathrooms,
                habitableSurface,
                constructionYear,
                includeParking,
                includeStorage,
                withPictures
            } = appliedFilters;

            if (minScore && score < minScore) {
                includeItem = false;
            }

            includeItem = setIncludeItemByRange(includeItem, estate.price, price);
            includeItem = setIncludeItemByRange(includeItem, estate.bedrooms, bedrooms);
            includeItem = setIncludeItemByRange(includeItem, estate.bathrooms, bathrooms);
            includeItem = setIncludeItemByRange(includeItem, estate.habitableArea, habitableSurface);
            if (estate.constructionYear) {
                includeItem = setIncludeItemByRange(includeItem, estate.constructionYear, constructionYear);
            }

            if (includeParking && !estate.hasPrivateParking) {
                includeItem = false;
            }
            if (includeStorage && !estate.hasExtraStorage) {
                includeItem = false;
            }
            if (withPictures && !(estate.pictures && estate.pictures.length > 0)) {
                includeItem = false;
            }
        }
        return includeItem;
    };

    const filterEstates = () => {
        if (!initialEstateList) {
            return;
        }
        let newValue = [...initialEstateList];

        newValue = newValue.filter((x) => {
            let includeItem = true;

            if (searchQuery && !x.name.toLowerCase().includes(searchQuery.toLowerCase())) {
                includeItem = false;
            }

            includeItem = setIncludeItemByAppliedFilters(includeItem, x);

            return includeItem;
        });

        setEstates(newValue);
    };

    const onSearchChange = (ev: Event) => {
        let query = '';
        const target = ev.target as HTMLIonSearchbarElement;
        if (target) query = target.value!.toLowerCase();

        setSearchQuery(query);
    };

    const openFilters = async () => {
        await menuController.open('filters-menu');
    };

    const closeFilters = async () => {
        await menuController.close('filters-menu');
    };

    const onApplyFilters = (newFilters: IEstateFilterValues) => {
        setAppliedFilters(newFilters);
    };

    return (
        <>
            <EstateFilters onClose={closeFilters} applyFilters={onApplyFilters} />
            <PageLayout
                pageClassName="estates-page"
                isLoading={isLoading}
                headerContent={
                    <IonToolbar>
                        <IonRow className="header-row">
                            <IonSearchbar
                                value={searchQuery}
                                onIonInput={onSearchChange}
                                debounce={500}
                                inputMode="search"
                                showClearButton="focus"
                            ></IonSearchbar>
                            <IonButton fill="clear" onClick={openFilters}>
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
        </>
    );
};

export default EstateList;
