import { IonButton, IonIcon, IonRow } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { chevronBackOutline, ellipsisVertical } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Profile.scss';
import PageLayout from '../base/PageLayout';
import StarRating from '../base/StarRating';
import ImageFallback from '../base/ImageFallback';
import { getUserDataById } from '../../services/user';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '../../assets/svg-icons';

const Profile: React.FC<{ userId: string; showBackButton: boolean }> = ({ userId, showBackButton }) => {
    const history = useHistory();
    const [userData, setUserData] = useState<IUser>();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        load();
    }, [userId]);

    const load = async () => {
        if (!userId || isLoading) {
            return;
        }
        setIsLoading(true);
        let response = await getUserDataById(userId);
        setUserData(response);
    };

    const { score, name, pictureUrl } = useMemo(() => {
        let score = 0,
            name = '',
            pictureUrl = '';
        if (userData) {
            if (userData.displayName) {
                name = userData.displayName;
            }
            if (userData.photoURL) {
                pictureUrl = userData.photoURL;
            }
        }
        setIsLoading(false);
        return { score, name, pictureUrl };
    }, [userData]);

    const onBackButtonClick = () => {
        history.goBack();
    };

    return (
        <PageLayout pageClassName="profile-page">
            <IonRow className="score-options-row ion-justify-content-between">
                {showBackButton && (
                    <IonButton fill="clear" className="back-button" onClick={onBackButtonClick}>
                        <IonIcon slot="icon-only" icon={chevronBackOutline}></IonIcon>
                    </IonButton>
                )}
                <StarRating score={score} />
                <IonButton fill="clear">
                    <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                </IonButton>
            </IonRow>
            <IonRow className="profile-content">
                <ImageFallback url={pictureUrl} fallbackUrl="./assets/img/user-noimage.png" className="profile-picture" />
                <div className="name">{name}</div>
                <IonRow className="social-media">
                    <FacebookIcon />
                    <InstagramIcon />
                    <LinkedInIcon />
                </IonRow>
            </IonRow>
        </PageLayout>
    );
};

export default Profile;
