import { IonButton, IonIcon, IonRow, useIonToast } from '@ionic/react';
import { useMemo, useState } from 'react';
import { add, carOutline, closeOutline, constructOutline, cubeOutline, flameOutline } from 'ionicons/icons';
import { Marker } from 'pigeon-maps';
import { useHistory } from 'react-router-dom';
import './EstateDescription.scss';
import OverflowText from '../base/OverflowText';
import ShowMoreText from '../base/ShowMoreText';
import GenericMap from '../base/GenericMap';
import ImageFallback from '../base/ImageFallback';
import SendRequest from '../requests/SendRequest';
import { HeetingType } from '../../utils/enums';
import IEstate from '../../interfaces/api/IEstate';
import { SurfaceIcon } from '../../assets/svg-icons';
import { getUserDataById } from '../../services/user';
import userProfile from '../../services/userProfile';
import { addRequest, updateRequest } from '../../services/request';
import { capitalize, getExistingRequest } from '../../utils/util';

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
    const [present] = useIonToast();
    const [userName, setUserName] = useState<string>('');
    const [userPicture, setUserPicture] = useState<string>('');
    const [showSendRequest, setShowSendRequest] = useState<boolean>(false);
    const [currentUserData, setCurrentUserData] = useState<IUser>();
    const [existingRequest, setExistingRequest] = useState<IRequest>();

    const showRequestButton = useMemo(() => {
        return userProfile.UserId !== estate.userId && (!existingRequest || existingRequest.estateId !== estate.id);
    }, [estate, existingRequest]);

    useMemo(() => {
        const getcurrentUserData = async () => {
            let response = await getUserDataById(userProfile.UserId);
            if (response) {
                setCurrentUserData(response);
            }
        };
        getcurrentUserData();
    }, []);

    const setUserData = async () => {
        let user = await getUserDataById(estate.userId);
        let existingRequest = await getExistingRequest(userProfile.UserId, estate.userId);

        if (user?.displayName) {
            setUserName(user.displayName);
        }
        if (user?.photoURL) {
            setUserPicture(user.photoURL);
        }
        if (existingRequest?.id) {
            setExistingRequest(existingRequest);
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

    const onSendRequest = () => {
        setShowSendRequest(true);
    };

    const setNotification = (message: string, type?: string, callback?: Function) => {
        present({
            message: capitalize(message),
            duration: type === 'error' ? undefined : 1500,
            position: 'top',
            buttons:
                type === 'error'
                    ? [
                          {
                              icon: closeOutline,
                              role: 'cancel'
                          }
                      ]
                    : undefined,
            color: type === 'error' ? 'danger' : 'success',
            onDidDismiss: () => {
                callback && callback();
            }
        });
    };

    const sendRequestData = async (data: IRequest) => {
        let response = await addRequest(data);
        if (response.id) {
            setNotification('Operation completed successfully!', 'success', () => {
                setShowSendRequest(false);
            });
        }
    };

    const sendRequest = async (message: string) => {
        if (!estate?.id || !currentUserData?.displayName) {
            return;
        }

        let data: IRequest = {
            estateId: estate.id,
            estateName: estate.name,
            isAccepted: false,
            isPending: true,
            lastMessage: message,
            receiverId: estate.userId,
            senderId: userProfile.UserId,
            senderName: currentUserData.displayName,
            senderPhoto: currentUserData.photoURL
        };

        if (existingRequest?.id) {
            try {
                await updateRequest(data, existingRequest.id);
                setNotification('Operation completed successfully!', 'success', () => {
                    setShowSendRequest(false);
                });
            } catch (error) {
                console.log({ error });
            }
        } else {
            sendRequestData(data);
        }
    };

    return (
        <>
            <SendRequest isVisible={showSendRequest} onDismiss={() => setShowSendRequest(false)} sendRequest={sendRequest} />
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
                        {showRequestButton && (
                            <IonButton className="request-button" onClick={onSendRequest}>
                                <IonIcon slot="icon-only" icon={add} />
                            </IonButton>
                        )}
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
        </>
    );
};

export default EstateDescription;
