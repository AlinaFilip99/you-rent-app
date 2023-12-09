import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

import './Menu.scss';
import { capitalize, hideTabBar, showTabBar } from '../../utils/util';

interface IMenu {
    children: React.ReactNode;
    menuTitle: string;
    menuId: string;
    footerContent?: React.ReactNode;
    onClear?: Function;
    onClose?: Function;
    extraClassNames?: string;
}

const Menu: React.FC<IMenu> = ({ children, menuTitle, menuId, footerContent, onClear, onClose, extraClassNames }) => {
    return (
        <IonMenu
            menuId={menuId}
            contentId="main-content"
            className={'generic-menu ' + extraClassNames}
            onIonWillOpen={() => hideTabBar()}
            onIonDidClose={() => showTabBar()}
        >
            <IonHeader>
                <IonToolbar>
                    {onClear && (
                        <IonButtons slot="start">
                            <IonButton
                                onClick={(ev) => {
                                    onClear(ev);
                                }}
                                className="start-button"
                            >
                                Clear
                            </IonButton>
                        </IonButtons>
                    )}
                    <IonTitle>{capitalize(menuTitle)}</IonTitle>
                    {onClose && (
                        <IonButtons slot="end">
                            <IonButton
                                fill="clear"
                                onClick={(ev) => {
                                    onClose(ev);
                                }}
                            >
                                <IonIcon slot="icon-only" icon={closeOutline}></IonIcon>
                            </IonButton>
                        </IonButtons>
                    )}
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">{children}</IonContent>
            {footerContent && (
                <IonFooter className="menu-footer">
                    <IonToolbar>{footerContent}</IonToolbar>
                </IonFooter>
            )}
        </IonMenu>
    );
};

export default Menu;
