import { useState } from 'react';
import { Map } from 'pigeon-maps';

interface IGenericMap {
    onMapClick?: Function;
    children?: React.ReactNode;
    initialCenter?: [number, number];
    initialZoom?: number;
}

const GenericMap: React.FC<IGenericMap> = ({ onMapClick, children, initialCenter, initialZoom }) => {
    const [center, setCenter] = useState<[number, number]>(initialCenter || [50.879, 4.6997]);
    const [zoom, setZoom] = useState(initialZoom || 11);

    const onClick = ({ event, latLng, pixel }: { event: MouseEvent; latLng: [number, number]; pixel: [number, number] }) => {
        onMapClick && onMapClick(event, latLng, pixel);
    };

    return (
        <Map
            boxClassname="generic-map"
            center={center}
            zoom={zoom}
            onBoundsChanged={({ center, zoom }) => {
                setCenter(center);
                setZoom(zoom);
            }}
            onClick={onClick}
        >
            {children}
        </Map>
    );
};

export default GenericMap;
