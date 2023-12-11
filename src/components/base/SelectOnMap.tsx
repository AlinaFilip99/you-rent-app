import { ReactElement, useState } from 'react';
import { Marker } from 'pigeon-maps';
import './SelectOnMap.scss';
import GenericMap from './GenericMap';
import Modal from './Modal';

interface ISelectOnMap {
    isVisible: boolean;
    onClose: Function;
}

const SelectOnMap: React.FC<ISelectOnMap> = ({ isVisible, onClose }) => {
    const [selectedMarker, setSelectedMarker] = useState<ReactElement>();
    const [selectedCoordinates, setSelectedCoordinates] = useState<[number, number]>();

    const onClear = () => {
        setSelectedMarker(undefined);
        setSelectedCoordinates(undefined);
        onClose();
    };

    const onDone = () => {
        onClose(selectedCoordinates);
    };

    const addMarker = (ev: MouseEvent, coordinates: [number, number]) => {
        setSelectedMarker(<Marker width={50} anchor={coordinates} color="var(--ion-color-secondary)" />);
        setSelectedCoordinates(coordinates);
    };

    return (
        <Modal
            isVisible={isVisible}
            modalTitle="Select location on map"
            onStartButtonClick={onClear}
            startButtonLabel="Clear"
            onEndButtonClick={onDone}
            extraClassNames="select-on-map-modal"
        >
            <GenericMap onMapClick={addMarker}>{selectedMarker}</GenericMap>
        </Modal>
    );
};

export default SelectOnMap;
