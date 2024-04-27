import { useEffect, useState } from 'react';
import { IonLabel, IonList, IonRow, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';

import './RequestList.scss';
import RequestListItem from './RequestListItem';
import PageLayout from '../base/PageLayout';
import PageInfo from '../base/PageInfo';
import { NotificationIcon } from '../../assets/svg-icons';
import { getRequestsByReceiverId, getRequestsBySenderId } from '../../services/request';
import userProfile from '../../services/userProfile';

const RequestList = () => {
    const userId = userProfile.UserId;
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requests, setRequests] = useState<IRequest[]>();
    const [selectedSegment, setSelectedSegment] = useState<string>('received');

    useEffect(() => {
        load();
    }, [selectedSegment]);

    const load = async () => {
        if (isLoading || !userId) {
            return;
        }
        setIsLoading(true);

        let response;
        if (selectedSegment === 'received') {
            response = await getRequestsByReceiverId(userId);
            response = response.filter((x) => x.isPending || x.isAccepted);
        } else {
            response = await getRequestsBySenderId(userId);
        }

        if (response) {
            setRequests(response);
        }

        setIsLoading(false);
    };

    const onRefreshList = () => {
        load();
    };

    const onRequestClick = () => {
        //tbd
    };

    return (
        <>
            <PageLayout
                pageClassName="requests-page"
                isLoading={isLoading}
                headerContent={
                    <IonToolbar>
                        <IonRow className="header-row">
                            <IonSegment
                                value={selectedSegment}
                                onIonChange={(ev) => setSelectedSegment(ev.target.value as string)}
                                mode="md"
                                className="custom-segment"
                            >
                                <IonSegmentButton value="received">
                                    <IonLabel>Received</IonLabel>
                                </IonSegmentButton>
                                <IonSegmentButton value="sent">
                                    <IonLabel>Sent</IonLabel>
                                </IonSegmentButton>
                            </IonSegment>
                        </IonRow>
                    </IonToolbar>
                }
            >
                {requests && requests.length > 0 ? (
                    <IonList lines="none" className="request-list">
                        {requests.map((x) => {
                            return (
                                <RequestListItem
                                    request={x}
                                    key={'requestId:' + x.id}
                                    onClick={onRequestClick}
                                    onRequestUpdate={onRefreshList}
                                />
                            );
                        })}
                    </IonList>
                ) : (
                    <PageInfo icon={<NotificationIcon color="var(--ion-color-light)" />} />
                )}
            </PageLayout>
        </>
    );
};

export default RequestList;
