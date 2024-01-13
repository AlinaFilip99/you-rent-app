import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonModal, IonRow, IonSegment, IonSegmentButton } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { chevronBackOutline, ellipsisVertical, searchOutline, warningOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import './Profile.scss';
import ProfileEdit from './ProfileEdit';
import PageLayout from '../base/PageLayout';
import StarRating from '../base/StarRating';
import ImageFallback from '../base/ImageFallback';
import PageInfo from '../base/PageInfo';
import CommentsSection from '../base/CommentsSection';
import EstateItemList from '../estates/EstateItemList';
import { getUserDataById, logout } from '../../services/user';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '../../assets/svg-icons';
import IEstate from '../../interfaces/api/IEstate';
import { getEstatesByUserId } from '../../services/estate';
import ProfileDescription from './ProfileDescription';

const Profile: React.FC<{ userId: string; showBackButton: boolean }> = ({ userId, showBackButton }) => {
    const history = useHistory();
    const [userData, setUserData] = useState<IUser>();
    const [isLoading, setIsLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [estates, setEstates] = useState<IEstate[]>();
    const [comments, setComments] = useState<IEstate[]>();
    const [selectedSegment, setSelectedSegment] = useState<string>('description');

    useEffect(() => {
        load();
    }, [userId]);

    const load = async () => {
        if (!userId || isLoading) {
            return;
        }
        setIsLoading(true);
        let response = await getUserDataById(userId);
        let estateList = await getEstatesByUserId(userId);
        if (estateList) {
            setEstates(estateList);
        }
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

    const onViewEstate = (estateId?: string) => {
        if (estateId) {
            history.push('/estate/' + estateId);
        }
    };

    const logoutUser = async () => {
        await logout();
        window.localStorage.clear();
        window.location.assign('/login');
    };

    const onEditClose = (refreshPage?: boolean) => {
        setShowEdit(false);
        if (refreshPage) {
            load();
        }
    };

    const onSocialClick = (url?: string) => {
        if (url) {
            window.open(url, '_blank');
        }
    };

    return (
        <>
            {userData && <ProfileEdit isVisible={showEdit} onClose={onEditClose} userData={userData} />}
            <IonModal
                isOpen={showProfileOptions}
                initialBreakpoint={0.25}
                breakpoints={[0, 0.25]}
                onDidDismiss={() => setShowProfileOptions(false)}
            >
                <IonList className="ion-padding" lines="full">
                    <IonItem
                        onClick={() => {
                            setShowEdit(true);
                            setShowProfileOptions(false);
                        }}
                    >
                        <IonLabel>Edit</IonLabel>
                    </IonItem>
                    <IonItem onClick={logoutUser}>
                        <IonLabel color="danger">Log out</IonLabel>
                    </IonItem>
                </IonList>
            </IonModal>
            <PageLayout
                pageClassName="profile-page"
                headerContent={
                    userData ? (
                        <IonRow className="score-options-row ion-justify-content-between">
                            {showBackButton && (
                                <IonButton fill="clear" className="back-button" onClick={onBackButtonClick}>
                                    <IonIcon slot="icon-only" icon={chevronBackOutline}></IonIcon>
                                </IonButton>
                            )}
                            <StarRating score={score} />
                            {!showBackButton && (
                                <IonButton fill="clear" onClick={() => setShowProfileOptions(true)}>
                                    <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                                </IonButton>
                            )}
                        </IonRow>
                    ) : undefined
                }
                isLoading={isLoading}
            >
                {userData ? (
                    <IonRow className="profile-content">
                        <ImageFallback url={pictureUrl} fallbackUrl="./assets/img/user-noimage.png" className="profile-picture" />
                        <div className="name">{name}</div>
                        {(userData.facebookUrl || userData.instagramUrl || userData.linkedInUrl) && (
                            <IonRow className="social-media">
                                {userData.facebookUrl && <FacebookIcon onClick={() => onSocialClick(userData.facebookUrl)} />}
                                {userData.instagramUrl && <InstagramIcon onClick={() => onSocialClick(userData.instagramUrl)} />}
                                {userData.linkedInUrl && <LinkedInIcon onClick={() => onSocialClick(userData.linkedInUrl)} />}
                            </IonRow>
                        )}
                        <IonSegment
                            value={selectedSegment}
                            onIonChange={(ev) => setSelectedSegment(ev.target.value as string)}
                            mode="md"
                            className="custom-segment"
                        >
                            <IonSegmentButton value="description">
                                <IonLabel>Description</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="posts">
                                <IonLabel>Posts</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="comments">
                                <IonLabel>Comments</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <div className="tab-content">
                            {selectedSegment === 'description' && <ProfileDescription userData={userData} />}
                            {selectedSegment === 'posts' && <EstateItemList data={estates} onItemClick={onViewEstate} />}
                            {selectedSegment === 'comments' && (
                                <>
                                    {comments && comments.length > 0 ? (
                                        <>
                                            <CommentsSection />
                                        </>
                                    ) : (
                                        <PageInfo icon={<IonIcon icon={searchOutline} />} />
                                    )}
                                </>
                            )}
                        </div>
                    </IonRow>
                ) : (
                    <PageInfo icon={<IonIcon icon={warningOutline} />} text="Something went wrong!" />
                )}
            </PageLayout>
        </>
    );
};

export default Profile;
