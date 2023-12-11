import { RefresherEventDetail } from '@ionic/react';
import { User } from 'firebase/auth';
interface IAppState {
    isAuthenticated: boolean;
    user: User | null;
    refreshEvent: CustomEvent<RefresherEventDetail> | null;
}

export default IAppState;
