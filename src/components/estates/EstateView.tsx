import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonButton, IonIcon, IonLabel, IonRow, IonSegment, IonSegmentButton, IonText } from '@ionic/react';
import { chevronBackOutline, pencil } from 'ionicons/icons';

import './EstateView.scss';
import EstateAddEdit from './EstateAddEdit';
import EstateDescription from './EstateDescription';
import PageLayout from '../base/PageLayout';
import PageInfo from '../base/PageInfo';
import OverflowText from '../base/OverflowText';
import StarRating from '../base/StarRating';
import CommentsSection from '../base/CommentsSection';
import ImageSwiper from '../base/ImageSwiper';
import ImageFallback from '../base/ImageFallback';
import IEstate from '../../interfaces/api/IEstate';
import { getEstateById, updateEstateScore } from '../../services/estate';
import userProfile from '../../services/userProfile';
import { addComment, getEstateComments } from '../../services/comment';
import { BathroomIcon, BedroomIcon, OverviewIcon } from '../../assets/svg-icons';
import { ToFullAddress, capitalize } from '../../utils/util';

interface IEstateView {
    estateId: string;
}

const EstateView: React.FC<IEstateView> = ({ estateId }) => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [estate, setEstate] = useState<IEstate>();
    const [editEstate, setEditEstate] = useState<IEstate>();
    const [selectedSegment, setSelectedSegment] = useState<string>('description');
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [viewPicturesVisible, setViewPicturesVisible] = useState<boolean>(false);
    const [comments, setComments] = useState<IComment[]>([]);

    const { scoreValue, estatePicture } = useMemo(() => {
        let value = 0,
            estatePicture = './assets/img/estate-fallback.png';

        if (estate?.score) {
            value = estate.score;
        }
        if (estate?.pictureUrls && estate.pictureUrls.length > 0) {
            estatePicture = estate.pictureUrls[0];
        }

        return { scoreValue: value, estatePicture };
    }, [estate]);

    useEffect(() => {
        load();
    }, [estateId]);

    const load = async () => {
        if (!estateId || isLoading) {
            return;
        }
        setIsLoading(true);
        let response = await getEstateById(estateId);
        if (response) {
            setEstate(response);
        } else {
            history.goBack();
        }
        let commentsResponse = await getEstateComments(estateId);
        if (commentsResponse) {
            setComments(commentsResponse);
        }
        setIsLoading(false);
    };

    const onEdit = () => {
        setEditEstate(estate);
        setShowEdit(true);
    };

    const onEditClose = (refreshPage?: boolean) => {
        setEditEstate(undefined);
        setShowEdit(false);
        if (refreshPage) {
            load();
        }
    };

    const updateScore = async (newComments: IComment[]) => {
        let newScore = 0;
        newComments.forEach((x) => {
            if (x.score) {
                newScore += x.score;
            }
        });

        await updateEstateScore(newScore / newComments.length, estateId);

        if (estate) {
            let newEstate = { ...estate };
            newEstate.score = newScore / newComments.length;
            setEstate(newEstate);
        }
    };

    const onComment = async (newComment: IComment) => {
        newComment.estateId = estateId;
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
            <EstateAddEdit isVisible={showEdit} onClose={onEditClose} estate={editEstate} />
            {estate?.pictureUrls && estate.pictureUrls.length > 0 && (
                <ImageSwiper
                    urls={estate?.pictureUrls}
                    fullScreenMode={{ isVisible: viewPicturesVisible, onClose: () => setViewPicturesVisible(false) }}
                />
            )}
            <PageLayout pageClassName="estate-view-page" isLoading={isLoading}>
                {estate ? (
                    <>
                        <div className="estate-image-overlay">
                            <ImageFallback className="estate-image" url={estatePicture} />
                            <div
                                className="image-overlay"
                                onClick={() => {
                                    setViewPicturesVisible(true);
                                }}
                            ></div>
                            <IonButton className="estate-button back-button" onClick={() => history.goBack()}>
                                <IonIcon slot="icon-only" icon={chevronBackOutline}></IonIcon>
                            </IonButton>
                            {estate.userId && estate.userId === userProfile.UserId && (
                                <IonButton className="estate-button edit-button" onClick={onEdit}>
                                    <IonIcon slot="icon-only" icon={pencil}></IonIcon>
                                </IonButton>
                            )}
                            <div className="data-overlay">
                                <IonRow>
                                    <IonLabel className="estate-name">{capitalize(estate.name)}</IonLabel>
                                </IonRow>
                                <IonRow>
                                    <IonText className="estate-address">
                                        {ToFullAddress(
                                            estate.country,
                                            estate.city,
                                            estate.zip,
                                            estate.street,
                                            estate.number,
                                            estate.region,
                                            estate.addressExtra
                                        )}
                                    </IonText>
                                </IonRow>
                                {(estate.bedrooms || estate.bathrooms) && (
                                    <IonRow className="estate-details ion-justify-content-between">
                                        {estate.bedrooms && (
                                            <IonRow className="estate-detail">
                                                <div className="detail-icon">
                                                    <BedroomIcon />
                                                </div>
                                                <OverflowText
                                                    text={estate.bedrooms + ' bedroom' + (estate.bedrooms > 1 ? 's' : '')}
                                                />
                                            </IonRow>
                                        )}
                                        {estate.bathrooms && (
                                            <IonRow className="estate-detail">
                                                <div className="detail-icon">
                                                    <BathroomIcon />
                                                </div>
                                                <OverflowText
                                                    text={estate.bathrooms + ' bathroom' + (estate.bathrooms > 1 ? 's' : '')}
                                                />
                                            </IonRow>
                                        )}
                                    </IonRow>
                                )}
                            </div>
                        </div>
                        <IonRow className="estate-price-score ion-justify-content-between">
                            <StarRating score={scoreValue} />
                            <div className="estate-price">{estate.price + ' €'}</div>
                        </IonRow>

                        <IonSegment
                            value={selectedSegment}
                            onIonChange={(ev) => setSelectedSegment(ev.target.value as string)}
                            mode="md"
                            className="custom-segment"
                        >
                            <IonSegmentButton value="description">
                                <IonLabel>Description</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="comments">
                                <IonLabel>Comments</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        {selectedSegment === 'description' ? (
                            <EstateDescription estate={estate} />
                        ) : (
                            <CommentsSection
                                comments={comments}
                                onAddComment={onComment}
                                ownerId={estate.userId}
                                onDeleteComment={onDeleteComment}
                            />
                        )}
                    </>
                ) : (
                    <PageInfo icon={<OverviewIcon color="var(--ion-color-light)" />} />
                )}
            </PageLayout>
        </>
    );
};

export default EstateView;
