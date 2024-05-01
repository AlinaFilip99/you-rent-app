import React, { useContext, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router';
import { arrowBack, ellipsisVertical, send } from 'ionicons/icons';

import { IonButton, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonSpinner, IonToolbar } from '@ionic/react';

import './Chat.scss';
import ChatMessage from './ChatMessage';
import PageLayout from '../base/PageLayout';
import ImageFallback from '../base/ImageFallback';
import OverflowText from '../base/OverflowText';

import { addMessage, getRequestById, getRequestMessages, onRequestMessageUpdate, updateRequest } from '../../services/request';
import userProfile from '../../services/userProfile';
import { getUserDataById } from '../../services/user';
import { MessageStatus } from '../../utils/enums';
import { formatISODateTime } from '../../utils/util';
import AppContext from '../../contexts/AppContext';
import { updateEstateIsActive } from '../../services/estate';
import useNotification from '../../hooks/useNotification';

const Chat: React.FC<{ requestId: string }> = ({ requestId }) => {
    const history = useHistory();
    const appState = useContext(AppContext);
    const setNotification = useNotification();
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [showChatOptions, setShowChatOptions] = useState(false);
    const [messages, setMessages] = useState<IRequestMessage[]>();
    const [request, setRequest] = useState<IRequest>();
    const [otherUserData, setOtherUserData] = useState<IUser>();
    const [newMessageText, setNewMessageText] = useState<string>();

    useMemo(() => {
        const setUserData = async (userId: string) => {
            let response = await getUserDataById(userId);
            setOtherUserData(response);
            setIsLoading(false);
        };
        if (request) {
            let otherUserId = request.receiverId === userProfile.UserId ? request.senderId : request.receiverId;
            setUserData(otherUserId);
        }
    }, [request]);

    const onChatUpdate = (response: IRequestMessage[]) => {
        setMessages(sortMessages(response));
    };

    useEffect(() => {
        load();
        loadRequest();
        onRequestMessageUpdate(requestId, onChatUpdate);
    }, [requestId]);

    const sortMessages = (list: IRequestMessage[]) => {
        return list.sort((a, b) => (moment(a.sendDate).isBefore(moment(b.sendDate)) ? -1 : 1));
    };

    const load = async () => {
        let response = await getRequestMessages(requestId);
        setMessages(sortMessages(response));
    };

    const loadRequest = async () => {
        let response = await getRequestById(requestId);
        setRequest(response);
    };

    const addNewMessage = (data: IRequestMessage) => {
        let newList = messages ? [...messages] : [];
        newList.push(data);
        setMessages(newList);
    };

    const updateRequestData = async (requestData: IRequest, requestId: string) => {
        try {
            await updateRequest(requestData, requestId);
        } catch (error) {
            console.log({ error });
        }
    };

    const updateRequestLastMessage = async (message: string) => {
        if (!request) {
            return;
        }

        let updatedRequest: IRequest = { ...request, lastMessage: message },
            requestId = updatedRequest.id;
        delete updatedRequest.id;

        if (requestId) {
            updateRequestData(updatedRequest, requestId);
        }

        //update last message in request list
        let sentRequests: IRequest[] = appState?.state.sentRequests || [];
        let receivedRequests: IRequest[] = appState?.state.receivedRequests || [];

        let existingSentRequest = sentRequests.find((x) => x.id === request.id);
        let existingReceivedRequest = receivedRequests.find((x) => x.id === request.id);

        if (existingSentRequest) {
            existingSentRequest.lastMessage = message;
            appState?.setState({ ...appState.state, sentRequests });
        }

        if (existingReceivedRequest) {
            existingReceivedRequest.lastMessage = message;
            appState?.setState({ ...appState.state, receivedRequests });
        }
    };

    const sendNewMessage = async () => {
        if (!newMessageText || !request?.id || isSending) {
            return;
        }
        let data: IRequestMessage = {
            sendDate: formatISODateTime(moment()),
            senderId: userProfile.UserId,
            status: MessageStatus.Pending,
            text: newMessageText
        };
        setIsSending(true);
        let response = await addMessage(request.id, data);
        if (response.id) {
            addNewMessage({ ...data, id: response.id });
            updateRequestLastMessage(newMessageText);
            setNewMessageText('');
        }
        setIsSending(false);
    };

    const onEstateClick = () => {
        if (request) {
            history.push('/estate/' + request.estateId);
        }
    };

    const removeRequestfromList = () => {
        let sentRequests: IRequest[] = appState?.state.sentRequests || [];
        let receivedRequests: IRequest[] = appState?.state.receivedRequests || [];

        appState?.setState({
            ...appState.state,
            sentRequests: sentRequests.filter((x) => x.id !== requestId),
            receivedRequests: receivedRequests.filter((x) => x.id !== requestId)
        });
    };

    const onAcceptUserOffer = async () => {
        if (!request) {
            return;
        }
        try {
            await updateEstateIsActive(false, request.estateId);
            setNotification('Operation completed successfully!', 'success');
            setShowChatOptions(false);
        } catch (error) {
            setNotification('Error updating estate!', 'error');
        }
    };

    const onRemoveRequest = async () => {
        if (!request) {
            return;
        }
        let updatedRequest: IRequest = { ...request, isPending: false, isAccepted: false },
            requestId = updatedRequest.id;
        delete updatedRequest.id;

        if (requestId) {
            await updateRequestData(updatedRequest, requestId);
            removeRequestfromList();
            history.goBack();
        }
    };

    return (
        <>
            <IonModal
                isOpen={showChatOptions}
                initialBreakpoint={0.25}
                breakpoints={[0, 0.25]}
                onDidDismiss={() => setShowChatOptions(false)}
            >
                <IonList className="ion-padding" lines="full">
                    <IonItem onClick={onAcceptUserOffer}>
                        <IonLabel>Accept user offer</IonLabel>
                    </IonItem>
                    <IonItem onClick={onRemoveRequest}>
                        <IonLabel color="danger">Remove request</IonLabel>
                    </IonItem>
                </IonList>
            </IonModal>
            <PageLayout
                pageClassName="chat-page"
                isLoading={isLoading}
                headerContent={
                    <IonToolbar>
                        <IonRow className="ion-align-items-center">
                            <IonButton
                                fill="clear"
                                onClick={() => {
                                    history.goBack();
                                }}
                            >
                                <IonIcon slot="icon-only" icon={arrowBack} />
                            </IonButton>
                            <ImageFallback
                                url={otherUserData?.photoURL || ''}
                                fallbackUrl="./assets/img/user-noimage.png"
                                className="user-picture"
                            />
                            <div>
                                <div className="user-name">
                                    <OverflowText text={otherUserData?.displayName || ''}></OverflowText>
                                </div>
                                <div className="estate-name" onClick={onEstateClick}>
                                    <OverflowText text={request?.estateName || ''}></OverflowText>
                                </div>
                            </div>
                            <IonButton fill="clear" onClick={() => setShowChatOptions(true)} className="chat-options">
                                <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                            </IonButton>
                        </IonRow>
                    </IonToolbar>
                }
                footerContent={
                    <IonRow className="ion-align-items-center">
                        <IonInput
                            className="new-message-input"
                            placeholder="Write message..."
                            value={newMessageText}
                            onIonInput={(ev) => setNewMessageText(ev.target.value as string)}
                        ></IonInput>
                        <IonButton fill="clear" onClick={sendNewMessage} className="send-button">
                            {!isSending ? <IonIcon icon={send}></IonIcon> : <IonSpinner></IonSpinner>}
                        </IonButton>
                    </IonRow>
                }
            >
                {messages &&
                    messages.map((x) => {
                        return <ChatMessage message={x} key={x.id} />;
                    })}
            </PageLayout>
        </>
    );
};

export default Chat;
