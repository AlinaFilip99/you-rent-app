import { useHistory } from 'react-router-dom';
import { IonButton, IonItem, IonRow, useIonToast } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import './RequestListItem.scss';
import ImageFallback from '../base/ImageFallback';
import OverflowText from '../base/OverflowText';
import userProfile from '../../services/userProfile';
import { updateRequest } from '../../services/request';
import { capitalize } from '../../utils/util';

const RequestListItem: React.FC<{ request: IRequest; onClick: Function; onRequestUpdate: Function }> = ({
    request,
    onClick,
    onRequestUpdate
}) => {
    const history = useHistory();
    const [present] = useIonToast();

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
                    url={request.senderPhoto || ''}
                    fallbackUrl="./assets/img/user-noimage.png"
                />
                <IonRow className="request-data">
                    <IonRow className="request-sender-estate ion-justify-content-between">
                        <div className="request-sender-name">
                            <OverflowText text={request.senderName}></OverflowText>
                        </div>
                        <div className="request-estate-name" onClick={onEstateClick}>
                            <OverflowText text={request.estateName}></OverflowText>
                        </div>
                    </IonRow>
                    <div
                        className={
                            'request-message ' +
                            (request.senderId === userProfile.UserId || !request.isPending ? 'sent-message' : '')
                        }
                    >
                        <OverflowText text={request.lastMessage}></OverflowText>
                    </div>
                    {request.isPending && request.senderId !== userProfile.UserId && (
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
