import { useEffect, useState } from 'react';
import { IonButton, IonRow, IonTextarea } from '@ionic/react';
import './SendRequest.scss';
import Modal from '../base/Modal';
// improvement: instead of send modal open chat
const SendRequest: React.FC<{ isVisible: boolean; onDismiss: Function; sendRequest: Function }> = ({
    isVisible,
    onDismiss,
    sendRequest
}) => {
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (!isVisible) {
            setMessage('');
        }
    }, [isVisible]);

    const onSendRequest = () => {
        if (message) {
            sendRequest(message);
        }
        onDismiss();
    };

    return (
        <Modal
            extraClassNames="send-request-modal"
            isVisible={isVisible}
            modalTitle="Send message"
            initialBreakpoint={0.75}
            breakpoints={[0, 0.75]}
            onDismiss={onDismiss}
        >
            <IonTextarea
                placeholder="Write message..."
                autoGrow={true}
                value={message}
                onIonInput={(ev) => setMessage(ev.target.value as string)}
            ></IonTextarea>
            <IonRow className="ion-justify-content-end ion-align-items-center">
                <IonButton className="send-button" disabled={message.length > 0 ? false : true} onClick={onSendRequest}>
                    Send
                </IonButton>
            </IonRow>
        </Modal>
    );
};

export default SendRequest;
