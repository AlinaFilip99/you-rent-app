import { useEffect, useState } from 'react';
import { IonButton, IonFab, IonFabButton, IonIcon, IonRow, IonSearchbar, IonToolbar } from '@ionic/react';
import { add, optionsOutline, searchOutline } from 'ionicons/icons';
import { menuController } from '@ionic/core/components';
import { useHistory } from 'react-router-dom';

import './EstateList.scss';
import EstateItemList from './EstateItemList';
import EstateFilters from './EstateFilters';
import EstateAddEdit from './EstateAddEdit';
import PageLayout from '../base/PageLayout';
import { getEstates } from '../../services/estate';
import PageInfo from '../base/PageInfo';
import IEstate from '../../interfaces/api/IEstate';

const EstateList = () => {
    let history = useHistory();
    const [estates, setEstates] = useState<IEstate[]>();
    const [initialEstateList, setInitialEstateList] = useState<IEstate[]>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [appliedFilters, setAppliedFilters] = useState<IEstateFilterValues>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showEstateAddEdit, setShowEstateAddEdit] = useState<boolean>(false);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        filterEstates();
    }, [searchQuery, appliedFilters]);

    const load = async () => {
        if (isLoading) {
            return;
        }
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
            let score = estate.score ? estate.score : 0;
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
            if (withPictures && !(estate.pictureUrls && estate.pictureUrls.length > 0)) {
                includeItem = false;
            }
        }
        return includeItem;
    };

    const filterEstates = () => {
        if (!initialEstateList || isLoading) {
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

    const onCloseAddEdit = (refreshList?: boolean) => {
        setShowEstateAddEdit(false);
        if (refreshList) {
            load();
            setSearchQuery('');
            setAppliedFilters({});
        }
    };

    const onViewEstate = (estateId?: string) => {
        if (estateId) {
            history.push('/estate/' + estateId);
        }
    };

    return (
        <>
            <EstateFilters onClose={closeFilters} applyFilters={onApplyFilters} />
            <EstateAddEdit isVisible={showEstateAddEdit} onClose={onCloseAddEdit} />
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
                <EstateItemList data={estates} onItemClick={onViewEstate} />
                {estates && estates.length > 0 && (
                    <IonFab slot="fixed" vertical="bottom" horizontal="end" aria-label="add-estate">
                        <IonFabButton size="small" onClick={() => setShowEstateAddEdit(true)}>
                            <IonIcon icon={add}></IonIcon>
                        </IonFabButton>
                    </IonFab>
                )}
            </PageLayout>
        </>
    );
};

export default EstateList;
