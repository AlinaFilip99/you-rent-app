import { IonButton, IonIcon, IonRow } from '@ionic/react';
import { useMemo, useState } from 'react';
import { add, carOutline, constructOutline, cubeOutline, flameOutline } from 'ionicons/icons';
import { Marker } from 'pigeon-maps';
import { useHistory } from 'react-router-dom';
import './EstateDescription.scss';
import OverflowText from '../base/OverflowText';
import ShowMoreText from '../base/ShowMoreText';
import GenericMap from '../base/GenericMap';
import ImageFallback from '../base/ImageFallback';
import { HeetingType } from '../../utils/enums';
import IEstate from '../../interfaces/api/IEstate';
import { SurfaceIcon } from '../../assets/svg-icons';
import { getUserDataById } from '../../services/user';

interface IEstateDetail {
    icon: React.ReactNode;
    value: string;
}

const HeetingTypesValues: { [key: number]: string } = {
    [HeetingType.UnderfloorHeating]: 'Underfloor heating',
    [HeetingType.Radiators]: 'Radiators',
    [HeetingType.GasFurnace]: 'Gas furnace',
    [HeetingType.HeatPump]: 'Heat pump',
    [HeetingType.WallHeaters]: 'Wall heaters',
    [HeetingType.BaseboardHeaters]: 'Baseboard heaters',
    [HeetingType.Furnace]: 'Furnace'
};

const EstateDescription: React.FC<{ estate: IEstate }> = ({ estate }) => {
    const history = useHistory();
    const [userName, setUserName] = useState<string>('');
    const [userPicture, setUserPicture] = useState<string>('');

    const setUserData = async () => {
        let user = await getUserDataById(estate.userId);

        if (user?.displayName) {
            setUserName(user.displayName);
        }
        if (user?.photoURL) {
            setUserPicture(user.photoURL);
        }
    };

    const estateDetails = useMemo(() => {
        let details: IEstateDetail[] = [];

        if (estate?.habitableArea) {
            details.push({ icon: <SurfaceIcon />, value: estate.habitableArea + ' m2' });
        }
        if (estate?.constructionYear) {
            details.push({ icon: <IonIcon icon={constructOutline} />, value: 'Built in ' + estate.constructionYear });
        }
        if (estate?.heetingType) {
            details.push({ icon: <IonIcon icon={flameOutline} />, value: HeetingTypesValues[estate.heetingType] });
        }
        if (estate.hasPrivateParking) {
            details.push({ icon: <IonIcon icon={carOutline} />, value: estate.hasPrivateParking ? 'Private parking' : '' });
        }
        if (estate.hasExtraStorage) {
            details.push({
                icon: <IonIcon icon={cubeOutline} />,
                value: estate.hasPrivateParking ? 'Extra storage' : ''
            });
        }
        if (estate.userId) {
            setUserData();
        }
        return details;
    }, [estate]);

    const viewUserProfile = () => {
        if (estate.userId) {
            history.push('/user/' + estate.userId);
        }
    };

    return (
        <div className="estate-description-section">
            {userName && (
                <IonRow className="estate-user-request">
                    <ImageFallback
                        className="user-picture"
                        url={userPicture}
                        fallbackUrl="./assets/img/user-noimage.png"
                        onClick={viewUserProfile}
                    />
                    <div>
                        <div className="user-name" onClick={viewUserProfile}>
                            {userName}
                        </div>
                        <div className="user-type">Owner</div>
                    </div>
                    {/* <IonButton className="request-button">
                        <IonIcon slot="icon-only" icon={add} />
                    </IonButton> */}
                </IonRow>
            )}
            {estateDetails.length > 0 && (
                <IonRow className="estate-details ion-justify-content-between">
                    {estateDetails.map((x, i) => {
                        return (
                            <IonRow className="estate-detail" key={'estate-detail-' + i}>
                                {x.icon}
                                <OverflowText text={x.value} />
                            </IonRow>
                        );
                    })}
                </IonRow>
            )}
            {estate.description && (
                <IonRow className="estate-description">
                    <ShowMoreText text={estate.description} />
                </IonRow>
            )}
            {estate.coordinates && (
                <IonRow className="estate-map">
                    <GenericMap initialCenter={[estate.coordinates.latitude, estate.coordinates.longitude]} initialZoom={17}>
                        <Marker
                            width={50}
                            anchor={[estate.coordinates.latitude, estate.coordinates.longitude]}
                            color="var(--ion-color-secondary)"
                        />
                    </GenericMap>
                </IonRow>
            )}
        </div>
    );
};

export default EstateDescription;
