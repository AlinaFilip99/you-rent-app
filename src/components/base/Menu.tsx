import { IonButton, IonButtons, IonContent, IonFooter, IonHeader, IonIcon, IonMenu, IonTitle, IonToolbar } from '@ionic/react';
import { closeOutline } from 'ionicons/icons';

import './Menu.scss';
import { capitalize, hideTabBar, showTabBar } from '../../utils/util';

interface IMenu {
    children: React.ReactNode;
    menuTitle: string;
    menuId: string;
    footerContent?: React.ReactNode;
    startButtons?: React.ReactNode;
    endButtons?: React.ReactNode;
    extraClassNames?: string;
}

const Menu: React.FC<IMenu> = ({ children, menuTitle, menuId, footerContent, startButtons, endButtons, extraClassNames }) => {
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
                    {startButtons && <IonButtons slot="start">{startButtons}</IonButtons>}
                    <IonTitle>{capitalize(menuTitle)}</IonTitle>
                    {endButtons && <IonButtons slot="end">{endButtons}</IonButtons>}
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
