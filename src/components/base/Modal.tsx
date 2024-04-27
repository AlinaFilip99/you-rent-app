import React from 'react';
import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonModal, IonTitle, IonToolbar } from '@ionic/react';
import './Modal.scss';
import { capitalize } from '../../utils/util';

interface IModal {
    isVisible: boolean;
    modalTitle: string;
    onStartButtonClick?: React.MouseEventHandler<HTMLIonButtonElement>;
    startButtonLabel?: string;
    onEndButtonClick?: React.MouseEventHandler<HTMLIonButtonElement>;
    endButtonLabel?: string;
    children: React.ReactNode;
    footerContent?: React.ReactNode;
    extraClassNames?: string;
    initialBreakpoint?: number;
    breakpoints?: number[];
    onDismiss?: Function;
}

const Modal: React.FC<IModal> = ({
    isVisible,
    modalTitle,
    onStartButtonClick,
    startButtonLabel,
    onEndButtonClick,
    endButtonLabel,
    children,
    footerContent,
    extraClassNames,
    initialBreakpoint,
    breakpoints,
    onDismiss
}) => {
    return (
        <IonModal
            isOpen={isVisible}
            className={'generic-modal ' + extraClassNames}
            initialBreakpoint={initialBreakpoint}
            breakpoints={breakpoints}
            onIonModalDidDismiss={() => onDismiss && onDismiss()}
        >
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
                                {startButtonLabel ? startButtonLabel : 'Cancel'}
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
                                {endButtonLabel ? endButtonLabel : 'Done'}
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
