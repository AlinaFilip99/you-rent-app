import { useMemo, useState } from 'react';
import moment from 'moment';
import { IonButton, IonItem, IonLabel, IonList, IonModal, IonRow, IonTextarea } from '@ionic/react';

import './CommentsSection.scss';
import CommentItem from './CommentItem';
import ImageFallback from './ImageFallback';
import StarRating from './StarRating';
import userProfile from '../../services/userProfile';
import { formatISODateTime } from '../../utils/util';
import { deleteComment } from '../../services/comment';

interface ICommentsSection {
    comments: IComment[];
    onAddComment: Function;
    ownerId: string;
    onDeleteComment: Function;
}

const CommentsSection: React.FC<ICommentsSection> = ({ comments, onAddComment, ownerId, onDeleteComment }) => {
    const currentUserPhotoUrl = userProfile.PhotoUrl;
    const [score, setScore] = useState<number>(0);
    const [message, setMessage] = useState<string>('');
    const [showCommentOptions, setShowCommentOptions] = useState<boolean>(false);
    const [selectedComment, setSelectedComment] = useState<IComment>();
    const [selectedEditComment, setSelectedEditComment] = useState<IComment>();

    const isOwner = useMemo(() => {
        return userProfile.UserId === ownerId;
    }, [ownerId]);

    const onAdd = () => {
        let newComment: IComment = {
            message,
            createDateTime: formatISODateTime(moment()),
            userId: userProfile.UserId
        };
        if (!isOwner) {
            newComment.score = score;
        }
        onAddComment(newComment);
    };

    const onStarClick = (score: number) => {
        setScore(score);
    };

    const onDelete = async (commentId: string) => {
        await deleteComment(commentId);
        onDeleteComment(commentId);
        setShowCommentOptions(false);
        setSelectedComment(undefined);
    };

    return (
        <>
            <IonModal
                isOpen={showCommentOptions}
                initialBreakpoint={0.25}
                breakpoints={[0, 0.25]}
                onDidDismiss={() => {
                    setShowCommentOptions(false);
                    setSelectedComment(undefined);
                }}
            >
                <IonList className="ion-padding" lines="full">
                    <IonItem
                        onClick={() => {
                            setSelectedEditComment(selectedComment);
                            setShowCommentOptions(false);
                            setSelectedComment(undefined);
                        }}
                    >
                        <IonLabel>Edit</IonLabel>
                    </IonItem>
                    <IonItem
                        onClick={() => {
                            if (selectedComment?.id) {
                                onDelete(selectedComment?.id);
                            }
                        }}
                    >
                        <IonLabel color="danger">Delete</IonLabel>
                    </IonItem>
                </IonList>
            </IonModal>
            <div className="comments-section">
                {comments.map((x, i) => {
                    return (
                        <CommentItem
                            comment={x}
                            key={'comment-' + i}
                            ownerId={ownerId}
                            onShowMenu={() => {
                                setSelectedComment(x);
                                setShowCommentOptions(true);
                            }}
                            isEdit={x.id === selectedEditComment?.id}
                            onCancelEdit={() => setSelectedEditComment(undefined)}
                        />
                    );
                })}
                <IonRow className="add-comment-section">
                    <ImageFallback
                        url={currentUserPhotoUrl}
                        className="user-picture"
                        fallbackUrl="./assets/img/user-noimage.png"
                    />
                    <div className="add-comment-data">
                        <IonTextarea
                            placeholder="Add a comment..."
                            autoGrow={true}
                            value={message}
                            onIonInput={(ev) => setMessage(ev.target.value as string)}
                        ></IonTextarea>
                        <IonRow className="ion-justify-content-between ion-align-items-center">
                            {!isOwner && <StarRating score={score} onClick={onStarClick} />}
                            <IonButton disabled={message.length > 0 ? false : true} onClick={onAdd}>
                                SEND
                            </IonButton>
                        </IonRow>
                    </div>
                </IonRow>
            </div>
        </>
    );
};

export default CommentsSection;
