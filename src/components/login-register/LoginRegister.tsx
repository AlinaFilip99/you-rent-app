import { IonRow, IonText } from '@ionic/react';

import './LoginRegister.scss';
import Login from './Login';
import Register from './Register';
import PageLayout from '../base/PageLayout';
import { AppLogo } from '../../assets/svg-icons';

const LoginRegister: React.FC<{ isLogin: boolean }> = ({ isLogin }) => {
    const onChangePageContent = () => {
        if (isLogin) {
            window.location.href = '/register';
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <PageLayout pageClassName="login-register-page">
            <IonRow className="custom-ion-row full-height ion-justify-content-between">
                <AppLogo />
                <IonRow className="custom-ion-row gap30">{isLogin ? <Login /> : <Register />}</IonRow>
                <IonText className="info" color="light">
                    {isLogin ? (
                        <>
                            Don’t have an account?
                            <IonText color="primary" className="info-button" onClick={onChangePageContent}>
                                SIGN UP
                            </IonText>
                        </>
                    ) : (
                        <>
                            Already have an account?
                            <IonText color="primary" className="info-button" onClick={onChangePageContent}>
                                SIGN IN
                            </IonText>
                        </>
                    )}
                </IonText>
            </IonRow>
        </PageLayout>
    );
};

export default LoginRegister;
