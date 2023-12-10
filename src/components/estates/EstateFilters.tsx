import React, { useState } from 'react';
import Menu from '../base/Menu';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonRange, IonRow, IonToggle } from '@ionic/react';
import './EstateFilters.scss';

interface IEstateFilters {
    onClose: Function;
    applyFilters: Function;
}

const EstateFilters: React.FC<IEstateFilters> = ({ onClose, applyFilters }) => {
    const [minScore, setMinScore] = useState<TRangeValue>();
    const [price, setPrice] = useState<IRange>({});
    const [bedrooms, setBedrooms] = useState<IRange>({});
    const [bathrooms, setBathrooms] = useState<IRange>({});
    const [surface, setSurface] = useState<IRange>({});
    const [constructionYear, setConstructionYear] = useState<IRange>({});
    const [includeParking, setIncludeParking] = useState<boolean>(false);
    const [includeStorage, setIncludeStorage] = useState<boolean>(false);
    const [withPictures, setWithPictures] = useState<boolean>(false);

    const onClear = () => {
        setMinScore(undefined);
        setPrice({});
        setBedrooms({});
        setBathrooms({});
        setSurface({});
        setConstructionYear({});
        setIncludeParking(false);
        setIncludeStorage(false);
        setWithPictures(false);

        onFiltersClose({});
    };

    const onFiltersClose = (estateFilters: IEstateFilterValues) => {
        applyFilters(estateFilters);
        onClose();
    };

    const onApply = () => {
        let estateFilters: IEstateFilterValues = {};
        if (typeof minScore === 'number' && minScore > 0) {
            estateFilters.minScore = minScore;
        }
        if (price.lower || price.upper) {
            estateFilters.price = price;
        }
        if (bedrooms.lower || bedrooms.upper) {
            estateFilters.bedrooms = bedrooms;
        }
        if (bathrooms.lower || bathrooms.upper) {
            estateFilters.bathrooms = bathrooms;
        }
        if (surface.lower || surface.upper) {
            estateFilters.habitableSurface = surface;
        }
        if (constructionYear.lower || constructionYear.upper) {
            estateFilters.constructionYear = constructionYear;
        }
        if (includeParking) {
            estateFilters.includeParking = includeParking;
        }
        if (includeStorage) {
            estateFilters.includeStorage = includeStorage;
        }
        if (withPictures) {
            estateFilters.withPictures = withPictures;
        }
        onFiltersClose(estateFilters);
    };

    const setPriceValue = (newValue: IRange) => {
        setPrice({ ...price, ...newValue });
    };

    const setBedroomsValue = (newValue: IRange) => {
        setBedrooms({ ...bedrooms, ...newValue });
    };

    const setBathroomsValue = (newValue: IRange) => {
        setBathrooms({ ...bathrooms, ...newValue });
    };

    const setSurfaceValue = (newValue: IRange) => {
        setSurface({ ...surface, ...newValue });
    };

    const setConstructionYearValue = (newValue: IRange) => {
        setConstructionYear({ ...constructionYear, ...newValue });
    };

    return (
        <Menu
            menuTitle="Filters"
            menuId="filters-menu"
            startButtons={
                <IonButton
                    color="danger"
                    onClick={() => {
                        onClear();
                    }}
                    className="start-button"
                >
                    Clear
                </IonButton>
            }
            endButtons={
                <IonButton
                    onClick={() => {
                        onApply();
                    }}
                    className="start-button"
                >
                    Apply
                </IonButton>
            }
            extraClassNames="estate-filters-menu"
        >
            <IonList lines="full">
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Price</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput
                                type="number"
                                label="From"
                                labelPlacement="stacked"
                                value={price?.lower}
                                onIonInput={(ev) => setPriceValue({ lower: ev.target.value as number })}
                            ></IonInput>
                            <IonInput
                                type="number"
                                label="To"
                                labelPlacement="stacked"
                                value={price?.upper}
                                onIonInput={(ev) => setPriceValue({ upper: ev.target.value as number })}
                            ></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonLabel>With pictures</IonLabel>
                    <IonToggle mode="md" checked={withPictures} onIonChange={() => setWithPictures(!withPictures)}></IonToggle>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Score from {typeof minScore === 'number' && minScore > 0 ? minScore : ''}</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonRange
                                aria-label="Score"
                                ticks={false}
                                snaps={true}
                                min={0}
                                max={5}
                                onIonInput={({ detail }) => setMinScore(detail.value)}
                            />
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Habitable surface</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput
                                type="number"
                                label="From"
                                labelPlacement="stacked"
                                value={surface.lower}
                                onIonInput={(ev) => setSurfaceValue({ lower: ev.target.value as number })}
                            ></IonInput>
                            <IonInput
                                type="number"
                                label="To"
                                labelPlacement="stacked"
                                value={surface.upper}
                                onIonInput={(ev) => setSurfaceValue({ upper: ev.target.value as number })}
                            ></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Year of construction</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput
                                type="number"
                                label="From"
                                labelPlacement="stacked"
                                value={constructionYear.lower}
                                onIonInput={(ev) => setConstructionYearValue({ lower: ev.target.value as number })}
                            ></IonInput>
                            <IonInput
                                type="number"
                                label="To"
                                labelPlacement="stacked"
                                value={constructionYear.upper}
                                onIonInput={(ev) => setConstructionYearValue({ upper: ev.target.value as number })}
                            ></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonLabel>With private parking</IonLabel>
                    <IonToggle
                        mode="md"
                        checked={includeParking}
                        onIonChange={() => setIncludeParking(!includeParking)}
                    ></IonToggle>
                </IonItem>
                <IonItem className="filter-item">
                    <IonLabel>With extra storage</IonLabel>
                    <IonToggle
                        mode="md"
                        checked={includeStorage}
                        onIonChange={() => setIncludeStorage(!includeStorage)}
                    ></IonToggle>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Number of bedrooms</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput
                                type="number"
                                label="From"
                                labelPlacement="stacked"
                                value={bedrooms.lower}
                                onIonInput={(ev) => setBedroomsValue({ lower: ev.target.value as number })}
                            ></IonInput>
                            <IonInput
                                type="number"
                                label="To"
                                labelPlacement="stacked"
                                value={bedrooms.upper}
                                onIonInput={(ev) => setBedroomsValue({ upper: ev.target.value as number })}
                            ></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
                <IonItem className="filter-item">
                    <IonRow>
                        <IonRow>
                            <IonLabel>Number of bathrooms</IonLabel>
                        </IonRow>
                        <IonRow className="no-wrap">
                            <IonInput
                                type="number"
                                label="From"
                                labelPlacement="stacked"
                                value={bathrooms.lower}
                                onIonInput={(ev) => setBathroomsValue({ lower: ev.target.value as number })}
                            ></IonInput>
                            <IonInput
                                type="number"
                                label="To"
                                labelPlacement="stacked"
                                value={bathrooms.upper}
                                onIonInput={(ev) => setBathroomsValue({ upper: ev.target.value as number })}
                            ></IonInput>
                        </IonRow>
                    </IonRow>
                </IonItem>
            </IonList>
        </Menu>
    );
};

export default EstateFilters;
