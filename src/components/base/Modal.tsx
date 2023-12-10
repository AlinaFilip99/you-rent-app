import React from 'react';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import './Modal.scss';
import { capitalize } from '../../utils/util';

interface IModal {
    isVisible: boolean;
    modalTitle: string;
    onStartButtonClick?: React.MouseEventHandler<HTMLIonButtonElement>;
    onEndButtonClick?: React.MouseEventHandler<HTMLIonButtonElement>;
    children: React.ReactNode;
    footerContent?: React.ReactNode;
    extraClassNames?: string;
}

const Modal: React.FC<IModal> = ({
    isVisible,
    modalTitle,
    onStartButtonClick,
    onEndButtonClick,
    children,
    footerContent,
    extraClassNames
}) => {
    return (
        <IonModal isOpen={isVisible} className={'generic-modal ' + extraClassNames}>
            <IonHeader>
                <IonToolbar class="modal-toolbar">
                    {onStartButtonClick && (
                        <IonButtons slot="start">
                            <IonButton
                                onClick={(ev) => {
                                    onStartButtonClick(ev);
                                }}
                                className="start-button"
                            >
                                Cancel
                            </IonButton>
                        </IonButtons>
                    )}
                    <IonTitle>{capitalize(modalTitle)}</IonTitle>
                    {onEndButtonClick && (
                        <IonButtons slot="end">
                            <IonButton
                                onClick={(ev) => {
                                    onEndButtonClick(ev);
                                }}
                            >
                                Done
                            </IonButton>
                        </IonButtons>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding" class="modal-content">
                {children}
            </IonContent>
            {footerContent && (
                <IonFooter className="modal-footer">
                    <IonToolbar>{footerContent}</IonToolbar>
                </IonFooter>
            )}
        </IonModal>
    );
};

export default Modal;
