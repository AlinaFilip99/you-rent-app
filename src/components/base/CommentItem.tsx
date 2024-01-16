import { useMemo, useState } from 'react';
import { IonButton, IonCard, IonIcon, IonRow, IonTextarea } from '@ionic/react';
import { ellipsisVertical } from 'ionicons/icons';
import moment from 'moment';

import './CommentItem.scss';
import ImageFallback from './ImageFallback';
import StarRating from './StarRating';
import OverflowText from './OverflowText';
import { getUserDataById } from '../../services/user';
import userProfile from '../../services/userProfile';
import { updateCommentMessage } from '../../services/comment';

interface ICommentItem {
    comment: IComment;
    ownerId: string;
    onShowMenu: Function;
    isEdit: boolean;
    onCancelEdit: Function;
}

const CommentItem: React.FC<ICommentItem> = ({ comment, ownerId, onShowMenu, isEdit, onCancelEdit }) => {
    const [userData, setUserData] = useState<IUser>();
    const [editMessage, setEditMessage] = useState<string>('');

    const { isOwner, commentTime, isOwnComment } = useMemo(() => {
        const getUserData = async (userId: string) => {
            let response = await getUserDataById(userId);
            if (response) {
                setUserData(response);
            }
        };

        let isOwner = comment.userId === ownerId,
            commentTime = moment(comment.createDateTime).fromNow(),
            isOwnComment = comment.userId === userProfile.UserId;

        setEditMessage(comment.message);
        getUserData(comment.userId);

        return { isOwner, commentTime, isOwnComment };
    }, [comment]);

    const onUpdate = async () => {
        if (comment.id) {
            await updateCommentMessage(editMessage, comment.id);
            comment.message = editMessage;
            onCancelEdit();
        }
    };

    return (
        <IonCard className="comment-card">
            {userData && (
                <IonRow className="comment-header ion-align-items-center">
                    <ImageFallback
                        url={userData.photoURL || ''}
                        fallbackUrl="./assets/img/user-noimage.png"
                        className="user-picture"
                    />
                    <div className="user-name">
                        <OverflowText text={userData.displayName || ''} />
                    </div>
                    {isOwnComment && <div className="own-comment-label">you</div>}
                    {!isEdit && (
                        <div className="comment-time">
                            <OverflowText text={commentTime} />
                        </div>
                    )}
                    {isOwnComment && !isEdit && (
                        <IonButton fill="clear" onClick={() => onShowMenu()}>
                            <IonIcon slot="icon-only" icon={ellipsisVertical}></IonIcon>
                        </IonButton>
                    )}
                </IonRow>
            )}
            {comment.score && !isOwner && !isEdit && <StarRating score={comment.score} />}
            {!isEdit ? (
                <div className="comment-message">{comment.message}</div>
            ) : (
                <>
                    <IonTextarea
                        placeholder="Add a comment..."
                        autoGrow={true}
                        value={editMessage}
                        onIonInput={(ev) => setEditMessage(ev.target.value as string)}
                    ></IonTextarea>
                    <IonRow className="edit-buttons">
                        <IonButton
                            disabled={editMessage.length > 0 ? false : true}
                            onClick={() => onCancelEdit()}
                            className="update-button"
                            fill="clear"
                            color="danger"
                        >
                            CANCEL
                        </IonButton>
                        <IonButton disabled={editMessage.length > 0 ? false : true} onClick={onUpdate} className="update-button">
                            UPDATE
                        </IonButton>
                    </IonRow>
                </>
            )}
        </IonCard>
    );
};

export default CommentItem;
