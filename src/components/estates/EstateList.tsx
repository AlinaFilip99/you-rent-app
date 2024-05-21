import { useEffect, useState } from 'react';
import { IonButton, IonFab, IonFabButton, IonIcon, IonRow, IonSearchbar, IonToolbar } from '@ionic/react';
import { add, chevronBackOutline, optionsOutline } from 'ionicons/icons';
import { menuController } from '@ionic/core/components';
import { useHistory } from 'react-router-dom';

import './EstateList.scss';
import EstateItemList from './EstateItemList';
import EstateFilters from './EstateFilters';
import EstateAddEdit from './EstateAddEdit';
import PageLayout from '../base/PageLayout';
import { getEstates } from '../../services/estate';
import IEstate from '../../interfaces/api/IEstate';
import { getUserCriteriaById } from '../../services/user';
import userProfile from '../../services/userProfile';

const EstateList: React.FC<{ searchCriteriaId?: string }> = ({ searchCriteriaId }) => {
    let history = useHistory();
    const [estates, setEstates] = useState<IEstate[]>();
    const [initialEstateList, setInitialEstateList] = useState<IEstate[]>();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [appliedFilters, setAppliedFilters] = useState<IEstateFilterValues>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showEstateAddEdit, setShowEstateAddEdit] = useState<boolean>(false);
    const [isForMatching, setIsForMatching] = useState<boolean>(false);

    useEffect(() => {
        load();
    }, []);

    useEffect(() => {
        filterEstates();
    }, [searchQuery, appliedFilters]);

    const getEstateMatchingScore = (estate: IEstate, criteria: ISearchCriteria) => {
        let nrOfCriterias = Object.keys(criteria).length - 2,
            nrOfTrueConditions = 0,
            {
                priceMax,
                priceMin,
                country,
                city,
                bedrooms,
                bathrooms,
                habitableArea,
                zip,
                heetingType,
                constructionYear,
                hasPrivateParking,
                hasExtraStorage
            } = criteria;

        if (estate.price >= priceMin && estate.price <= priceMax) {
            nrOfTrueConditions++;
        }
        if (estate.country === country) {
            nrOfTrueConditions++;
        }
        if (estate.city === city) {
            nrOfTrueConditions++;
        }
        if (estate.bedrooms >= bedrooms) {
            nrOfTrueConditions++;
        }
        if (bathrooms && estate.bathrooms >= bathrooms) {
            nrOfTrueConditions++;
        }
        if (habitableArea && estate.habitableArea >= habitableArea) {
            nrOfTrueConditions++;
        }
        if (zip && estate.zip === zip) {
            nrOfTrueConditions++;
        }
        if (heetingType && estate.heetingType === heetingType) {
            nrOfTrueConditions++;
        }
        if (constructionYear && estate.constructionYear && estate.constructionYear >= constructionYear) {
            nrOfTrueConditions++;
        }
        if (hasPrivateParking && estate.hasPrivateParking) {
            nrOfTrueConditions++;
        }
        if (hasExtraStorage && estate.hasExtraStorage) {
            nrOfTrueConditions++;
        }

        return (nrOfTrueConditions * 100) / nrOfCriterias;
    };

    const getMatchingList = (response: IEstate[], searchCriteria: ISearchCriteria) => {
        let estateList: IEstate[] = [];

        response.forEach((estate) => {
            let matchingScore = getEstateMatchingScore(estate, searchCriteria);
            if (matchingScore) {
                estate.matchingScore = matchingScore;
                estateList.push(estate);
            }
        });

        return estateList;
    };

    const sortByMatchingScore = (list: IEstate[]) => {
        return list.sort((x, y) => {
            if (x.matchingScore && y.matchingScore) {
                if (x.matchingScore > y.matchingScore) {
                    return -1;
                } else {
                    return 1;
                }
            } else {
                return 0;
            }
        });
    };

    const load = async () => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);

        let response = await getEstates(),
            searchCriteria: ISearchCriteria | undefined;

        if (searchCriteriaId) {
            searchCriteria = await getUserCriteriaById(userProfile.UserId, searchCriteriaId);
        }

        if (response) {
            response = response.filter((x) => x.isActive);

            if (searchCriteria) {
                setIsForMatching(true);
                response = sortByMatchingScore(getMatchingList(response, searchCriteria));
            }

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

        if (isForMatching) {
            newValue = sortByMatchingScore(newValue);
        }

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
                            {isForMatching && (
                                <IonButton fill="clear" className="back-button" onClick={() => history.goBack()}>
                                    <IonIcon slot="icon-only" icon={chevronBackOutline}></IonIcon>
                                </IonButton>
                            )}
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
                {estates && estates.length > 0 && !isForMatching && (
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
