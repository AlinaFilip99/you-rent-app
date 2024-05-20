import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonModal, IonRow, IonSegment, IonSegmentButton } from '@ionic/react';
import { useEffect, useMemo, useState } from 'react';
import { chevronBackOutline, ellipsisVertical, warningOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

import './Profile.scss';
import ProfileEdit from './ProfileEdit';
import ProfileDescription from './ProfileDescription';
import ProfileCriteriaList from './ProfileCriteriaList';

import PageLayout from '../base/PageLayout';
import StarRating from '../base/StarRating';
import ImageFallback from '../base/ImageFallback';
import PageInfo from '../base/PageInfo';
import CommentsSection from '../base/CommentsSection';
import EstateItemList from '../estates/EstateItemList';

import { getUserCriterias, getUserDataById, logout, updateUserScore } from '../../services/user';
import { getEstatesByUserId } from '../../services/estate';
import { addComment, getProfileComments } from '../../services/comment';
import { FacebookIcon, InstagramIcon, LinkedInIcon } from '../../assets/svg-icons';
import IEstate from '../../interfaces/api/IEstate';

const Profile: React.FC<{ userId: string; showBackButton: boolean }> = ({ userId, showBackButton }) => {
    const history = useHistory();
    const [userData, setUserData] = useState<IUser>();
    const [isLoading, setIsLoading] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showProfileOptions, setShowProfileOptions] = useState(false);
    const [estates, setEstates] = useState<IEstate[]>();
    const [comments, setComments] = useState<IComment[]>([]);
    const [selectedSegment, setSelectedSegment] = useState<string>('description');

    useEffect(() => {
        setSelectedSegment('description');
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
        let commentsResponse = await getProfileComments(userId);
        if (commentsResponse) {
            setComments(commentsResponse);
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
            if (userData.score) {
                score = userData.score;
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

    const updateScore = async (newComments: IComment[]) => {
        let newScore = 0;
        newComments.forEach((x) => {
            if (x.score) {
                newScore += x.score;
            }
        });

        await updateUserScore(newScore / newComments.length, userId);

        if (userData) {
            let newUserData = { ...userData };
            newUserData.score = newScore / newComments.length;
            setUserData(newUserData);
        }
    };

    const onComment = async (newComment: IComment) => {
        newComment.profileId = userId;
        let response = await addComment(newComment);
        if (response.id) {
            let newComments = [...comments];
            newComments.push({ ...newComment, id: response.id });
            setComments(newComments);
            updateScore(newComments);
        }
    };

    const onDeleteComment = async (commentId: string) => {
        let newComments = [...comments];
        newComments = newComments.filter((x) => x.id !== commentId);
        setComments(newComments);
        updateScore(newComments);
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
                                <IonLabel>Info</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="posts">
                                <IonLabel>Posts</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="comments">
                                <IonLabel>Comments</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="criterias">
                                <IonLabel>Criterias</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        <div className="tab-content">
                            {selectedSegment === 'description' && <ProfileDescription userData={userData} />}
                            {selectedSegment === 'posts' && <EstateItemList data={estates} onItemClick={onViewEstate} />}
                            {selectedSegment === 'comments' && (
                                <CommentsSection
                                    comments={comments}
                                    onAddComment={onComment}
                                    ownerId={userData.id || ''}
                                    onDeleteComment={onDeleteComment}
                                />
                            )}
                            {selectedSegment === 'criterias' && <ProfileCriteriaList userId={userId} />}
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
