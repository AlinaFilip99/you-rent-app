import { useContext, useState } from 'react';
import { IonButton, IonIcon, IonInput, IonRow, IonText, useIonToast } from '@ionic/react';
import { closeOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { login } from '../../services/user';
import AppContext from '../../contexts/AppContext';
import { capitalize } from '../../utils/util';
import Init from '../../services/init';

const Login = () => {
    const appState = useContext(AppContext);
    const [present] = useIonToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const setNotification = (message: string, type?: string, callback?: Function) => {
        present({
            message: capitalize(message),
            duration: type === 'error' ? undefined : 1500,
            position: 'top',
            buttons:
                type === 'error'
                    ? [
                          {
                              icon: closeOutline,
                              role: 'cancel'
                          }
                      ]
                    : undefined,
            color: type === 'error' ? 'danger' : 'success',
            onDidDismiss: () => {
                callback && callback();
            }
        });
    };

    const onLogin = async () => {
        if (!email || !password) {
            return;
        }
        setIsLoading(true);
        try {
            let response = await login(email, password);
            console.log({ response });
            if (response.user) {
                await new Init().initUserProfile(response.user);
                setNotification('Logged in successfully!', 'success', () => {
                    appState?.setState({ ...appState.state, isAuthenticated: true, user: response.user });
                    window.location.href = '/estates';
                });
            }
        } catch (error) {
            setNotification('Error!', 'error');
        }
        setIsLoading(false);
    };

    const onEmailInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;
        setEmail(value);
    };

    const onPasswordInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;
        setPassword(value);
    };

    return (
        <>
            <IonText color="medium" className="page-title">
                Welcome back!
            </IonText>
            <IonRow className="custom-ion-row gap16">
                <div className="input-item">
                    <IonInput
                        value={email}
                        placeholder="Email"
                        class="custom-input-field"
                        color="medium"
                        type="email"
                        onIonInput={onEmailInput}
                    />
                </div>
                <div className="input-item">
                    <IonInput
                        value={password}
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        class="custom-input-field"
                        color="medium"
                        clearOnEdit={false}
                        onIonInput={onPasswordInput}
                    />
                    <IonIcon
                        className="input-icon"
                        color="primary"
                        icon={showPassword ? eyeOutline : eyeOffOutline}
                        onClick={() => {
                            !isLoading && setShowPassword(!showPassword);
                        }}
                    ></IonIcon>
                </div>
            </IonRow>
            <IonButton onClick={onLogin}>SIGN IN</IonButton>
            <IonText className="forgot-password" color="primary">
                Forgot password?
            </IonText>
        </>
    );
};

export default Login;
