import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IonLabel, IonList, IonRow, IonSegment, IonSegmentButton, IonToolbar } from '@ionic/react';

import './RequestList.scss';
import RequestListItem from './RequestListItem';
import PageLayout from '../base/PageLayout';
import PageInfo from '../base/PageInfo';
import { NotificationIcon } from '../../assets/svg-icons';
import { getRequestsByReceiverId, getRequestsBySenderId } from '../../services/request';
import userProfile from '../../services/userProfile';
import AppContext from '../../contexts/AppContext';

const RequestList = () => {
    const userId = userProfile.UserId;
    const history = useHistory();
    const appState = useContext(AppContext);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [requests, setRequests] = useState<IRequest[]>();
    const [selectedSegment, setSelectedSegment] = useState<string>('received');

    useEffect(() => {
        load();
    }, [selectedSegment]);

    useEffect(() => {
        if (selectedSegment === 'received') {
            if (appState?.state.receivedRequests) {
                setRequests(appState.state.receivedRequests);
            }
        } else {
            if (appState?.state.sentRequests) {
                setRequests(appState.state.sentRequests);
            }
        }
    }, [appState?.state.sentRequests, appState?.state.receivedRequests]);

    const load = async () => {
        if (isLoading || !userId) {
            return;
        }
        setIsLoading(true);

        let response;
        if (selectedSegment === 'received') {
            response = await getRequestsByReceiverId(userId);
            appState?.setState({ ...appState.state, receivedRequests: response });
            response = response.filter((x) => x.isPending || x.isAccepted);
        } else {
            response = await getRequestsBySenderId(userId);
            appState?.setState({ ...appState.state, sentRequests: response });
        }

        if (response) {
            setRequests(response);
        }

        setIsLoading(false);
    };

    const onRefreshList = () => {
        load();
    };

    const onRequestClick = (requestId?: string) => {
        if (requestId) {
            history.push('/chat/' + requestId);
        }
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
                                    onClick={() => onRequestClick(x.id)}
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
