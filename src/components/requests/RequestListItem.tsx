import { useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonItem, IonRow } from '@ionic/react';
import './RequestListItem.scss';
import ImageFallback from '../base/ImageFallback';
import OverflowText from '../base/OverflowText';
import userProfile from '../../services/userProfile';
import { updateRequest } from '../../services/request';
import useNotification from '../../hooks/useNotification';
import { getUserDataById } from '../../services/user';

const RequestListItem: React.FC<{ request: IRequest; onClick: Function; onRequestUpdate: Function }> = ({
    request,
    onClick,
    onRequestUpdate
}) => {
    const history = useHistory();
    const setNotification = useNotification();
    const [otherUserData, setOtherUserData] = useState<IUser>();

    const isSender = useMemo(() => {
        return request?.senderId === userProfile.UserId;
    }, [request]);

    useMemo(() => {
        const setUserData = async (userId: string) => {
            let response = await getUserDataById(userId);
            setOtherUserData(response);
        };
        if (request) {
            let otherUserId = request.receiverId === userProfile.UserId ? request.senderId : request.receiverId;
            setUserData(otherUserId);
        }
    }, [request]);

    const updateRequestData = async (requestData: IRequest, requestId: string) => {
        try {
            await updateRequest(requestData, requestId);
            setNotification('Operation completed successfully!', 'success', () => {
                onRequestUpdate();
            });
        } catch (error) {
            console.log({ error });
        }
    };

    const onAcceptRequest = () => {
        let updatedRequest: IRequest = { ...request, isPending: false, isAccepted: true },
            requestId = updatedRequest.id;
        delete updatedRequest.id;

        if (requestId) {
            updateRequestData(updatedRequest, requestId);
        }
    };

    const onDeclineRequest = () => {
        let updatedRequest: IRequest = { ...request, isPending: false, isAccepted: false },
            requestId = updatedRequest.id;
        delete updatedRequest.id;

        if (requestId) {
            updateRequestData(updatedRequest, requestId);
        }
    };

    const onEstateClick = () => {
        history.push('/estate/' + request.estateId);
    };

    return (
        <IonItem className="request-list-item" onClick={() => onClick(request.id)}>
            <IonRow className="request-item">
                <ImageFallback
                    className="request-image"
                    url={otherUserData?.photoURL || ''}
                    fallbackUrl="./assets/img/user-noimage.png"
                />
                <IonRow className="request-data">
                    <IonRow className="request-sender-estate ion-justify-content-between">
                        <div className="request-sender-name">
                            <OverflowText text={otherUserData?.displayName || ''}></OverflowText>
                        </div>
                        <div className="request-estate-name" onClick={onEstateClick}>
                            <OverflowText text={request.estateName}></OverflowText>
                        </div>
                    </IonRow>
                    <div className={'request-message ' + (isSender || !request.isPending ? 'sent-message' : '')}>
                        <OverflowText text={request.lastMessage}></OverflowText>
                    </div>
                    {request.isPending && !isSender && (
                        <IonRow className="request-buttons">
                            <IonButton className="accept-request-button" onClick={onAcceptRequest}>
                                Accept
                            </IonButton>
                            <IonButton color="medium" fill="clear" className="decline-request-button" onClick={onDeclineRequest}>
                                Decline
                            </IonButton>
                        </IonRow>
                    )}
                </IonRow>
            </IonRow>
        </IonItem>
    );
};

export default RequestListItem;
