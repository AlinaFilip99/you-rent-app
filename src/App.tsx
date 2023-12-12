import { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import PrivateRoute from './components/base/PrivateRoute';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/customTheme.scss';

import { NotificationIcon, OverviewIcon, UserProfileIcon } from './assets/svg-icons';

import AppContext from './contexts/AppContext';
import IAppState from './interfaces/IAppState';
import { getToken } from './utils/localStorageUtil';

import LoginPage from './pages/LoginPage';
import EstatesPage from './pages/EstatesPage';
import RegisterPage from './pages/RegisterPage';
import EstateViewPage from './pages/EstateViewPage';

setupIonicReact({ mode: 'ios' });

declare global {
    interface Window {
        env: any;
    }
}

window.env = window.env || {};
const isAuthenticated = getToken() !== '';

const App: React.FC = () => {
    const [appState, setAppState] = useState<IAppState>({
        isAuthenticated,
        user: null,
        refreshEvent: null
    });

    return (
        <AppContext.Provider
            value={{
                state: appState,
                setState: setAppState
            }}
        >
            <IonApp>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route path="/login" component={LoginPage} exact={true} />
                            <Route path="/register" component={RegisterPage} exact={true} />
                            <Route path="/" exact={true}>
                                <Redirect to="/estates" />
                            </Route>
                            <PrivateRoute path="/estates" component={EstatesPage} exact={true}></PrivateRoute>
                            <PrivateRoute path="/estate/:id" component={EstateViewPage} exact={true}></PrivateRoute>
                        </IonRouterOutlet>

                        <IonTabBar slot="bottom" mode="ios" id="app-tab-bar" style={{ display: 'none' }}>
                            <IonTabButton tab="home" href="/estates">
                                <OverviewIcon />
                                <IonLabel>Home</IonLabel>
                            </IonTabButton>

                            {/* <IonTabButton tab="requests" href="/requests">
                                <NotificationIcon />
                                <IonLabel>Requests</IonLabel>
                            </IonTabButton> */}

                            <IonTabButton tab="profile" href="/profile">
                                <UserProfileIcon />
                                <IonLabel>Profile</IonLabel>
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>
                </IonReactRouter>
            </IonApp>
        </AppContext.Provider>
    );
};

export default App;
