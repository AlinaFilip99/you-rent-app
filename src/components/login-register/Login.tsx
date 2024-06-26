import { useContext, useState } from 'react';
import { IonButton, IonIcon, IonInput, IonRow, IonText } from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { getUserDataById, login, sendResetPasswordEmail } from '../../services/user';
import AppContext from '../../contexts/AppContext';
import Init from '../../services/init';
import useNotification from '../../hooks/useNotification';

const Login = () => {
    const appState = useContext(AppContext);
    const setNotification = useNotification();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = async () => {
        if (!email || !password) {
            return;
        }
        setIsLoading(true);
        try {
            let response = await login(email, password);

            if (response.user) {
                let currentUserProfile = await getUserDataById(response.user.uid);
                if (currentUserProfile) {
                    await new Init().initUserProfile(currentUserProfile, await response.user.getIdToken());
                }
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

    const onResetPassword = async () => {
        if (isLoading) {
            return;
        }
        if (email) {
            setIsLoading(true);
            let response = await sendResetPasswordEmail(email);
            if (response) {
                setNotification('Reset password email successfully sent!');
            } else {
                setNotification('Error sending reset password email!', 'error');
            }
        } else {
            setNotification('Please fill in the email!', 'error');
        }
        setIsLoading(false);
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
            <IonText className="forgot-password" color="primary" onClick={onResetPassword}>
                Forgot password?
            </IonText>
        </>
    );
};

export default Login;
