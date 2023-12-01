import { RefresherEventDetail } from '@ionic/react';
interface IAppState {
    isAuthenticated: boolean;
    user: any;
    refreshEvent: CustomEvent<RefresherEventDetail> | null;
}

export default IAppState;
