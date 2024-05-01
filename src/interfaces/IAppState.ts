import { RefresherEventDetail } from '@ionic/react';
import { User } from 'firebase/auth';
interface IAppState {
    isAuthenticated: boolean;
    user: User | null;
    refreshEvent: CustomEvent<RefresherEventDetail> | null;
    sentRequests?: IRequest[];
    receivedRequests?: IRequest[];
}

export default IAppState;
