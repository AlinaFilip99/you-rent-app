import { IonContent, IonFooter, IonHeader, IonLoading, IonPage, IonRefresher, IonRefresherContent } from '@ionic/react';
import React, { useMemo } from 'react';

interface IPageLayout {
    pageClassName?: string;
    isLoading?: boolean;
    children: React.ReactNode;
    contentRef?: React.RefObject<HTMLIonContentElement>;
    onRefresh?: Function;
    headerContent?: React.ReactNode;
    footerContent?: React.ReactNode;
}

const PageLayout: React.FC<IPageLayout> = ({
    isLoading,
    children,
    contentRef,
    pageClassName,
    onRefresh,
    headerContent,
    footerContent
}) => {
    const tabBar = document.getElementById('app-tab-bar');

    const pageHeightAdjustValue = useMemo(() => {
        let adjustValue = 0;
        if (tabBar !== null) {
            adjustValue = tabBar.offsetHeight;
        }
        return adjustValue;
    }, [tabBar?.offsetHeight]);

    const pageHeight = useMemo(
        () => Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - pageHeightAdjustValue + 'px',
        [pageHeightAdjustValue]
    );

    return (
        <IonPage className={pageClassName} style={{ height: pageHeight }} id="main-content">
            {headerContent && <IonHeader collapse="fade">{headerContent}</IonHeader>}
            <IonLoading isOpen={isLoading} message="Loading" />
            <IonContent className="ion-padding custom-padding" ref={contentRef}>
                {onRefresh && (
                    <IonRefresher
                        slot="fixed"
                        onIonRefresh={(e) => {
                            onRefresh(e);
                        }}
                    >
                        <IonRefresherContent></IonRefresherContent>
                    </IonRefresher>
                )}
                {children}
            </IonContent>
            {footerContent && <IonFooter>{footerContent}</IonFooter>}
        </IonPage>
    );
};

export default PageLayout;
