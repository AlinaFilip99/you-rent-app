import { useContext, useState } from 'react';
import { IonButton, IonCheckbox, IonIcon, IonInput, IonRow, IonText, useIonToast } from '@ionic/react';
import { checkmarkOutline, closeOutline, eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { addUser, signUp } from '../../services/user';
import AppContext from '../../contexts/AppContext';
import { capitalize } from '../../utils/util';
import Init from '../../services/init';

const Register = () => {
    const appState = useContext(AppContext);
    const [present] = useIonToast();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [samePassword, setSamePassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [acceptPolicy, setacceptPolicy] = useState(false);

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

    const onPasswordInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;
        if (value === confirmPassword) {
            setSamePassword(true);
        } else {
            setSamePassword(false);
        }
        setPassword(value);
    };

    const onConfirmPasswordInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;
        if (value === password) {
            setSamePassword(true);
        } else {
            setSamePassword(false);
        }
        setConfirmPassword(value);
    };

    const onEmailInput = (ev: Event) => {
        const value = (ev.target as HTMLIonInputElement).value as string;
        setEmail(value);
    };

    const onCreateAccount = async () => {
        if (!email || !samePassword || !acceptPolicy) {
            return;
        }
        setIsLoading(true);
        try {
            let response = await signUp(email, password);

            if (response.user) {
                let userProfile: IUser = { email: email, emailVerified: response.user.emailVerified };
                await addUser(userProfile, response.user.uid);
                await new Init().initUserProfile(response.user);
                setNotification('Account created successfully!', 'success', () => {
                    appState?.setState({ ...appState.state, isAuthenticated: true, user: response.user });
                    window.location.href = '/estates';
                });
            }
        } catch (error) {
            setNotification('Error!', 'error');
        }
        setIsLoading(false);
    };

    return (
        <>
            <IonText color="medium" className="page-title">
                Create an account
            </IonText>
            <IonRow className="custom-ion-row gap16">
                <div className="input-item">
                    <IonInput
                        value={email}
                        placeholder="Email"
                        class="custom-input-field"
                        color="medium"
                        type="email"
                        autocomplete="off"
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
                        autocomplete="off"
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
                <div className="input-item">
                    <IonInput
                        value={confirmPassword}
                        placeholder="Confirm password"
                        type={showPassword ? 'text' : 'password'}
                        class="custom-input-field"
                        color="medium"
                        clearOnEdit={false}
                        autocomplete="off"
                        onIonInput={onConfirmPasswordInput}
                    />
                    <IonIcon
                        className="input-icon"
                        color={samePassword ? 'success' : 'primary'}
                        icon={samePassword ? checkmarkOutline : showPassword ? eyeOutline : eyeOffOutline}
                        onClick={() => {
                            !isLoading && !samePassword && setShowPassword(!showPassword);
                        }}
                    ></IonIcon>
                </div>
            </IonRow>
            <IonRow className="ion-justify-content-between">
                <IonText className="info" color="light">
                    I have read the <IonText color="primary">Privacy Policy</IonText>
                </IonText>
                <IonCheckbox checked={acceptPolicy} onIonChange={() => setacceptPolicy(!acceptPolicy)} />
            </IonRow>
            <IonButton onClick={onCreateAccount}>GET STARTED</IonButton>
        </>
    );
};

export default Register;
