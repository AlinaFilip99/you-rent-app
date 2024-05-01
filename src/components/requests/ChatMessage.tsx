import { useMemo } from 'react';
import './ChatMessage.scss';
import userProfile from '../../services/userProfile';

const ChatMessage: React.FC<{ message: IRequestMessage }> = ({ message }) => {
    const isFromCurrentUser = useMemo(() => {
        return message.senderId === userProfile.UserId;
    }, [message]);

    return <div className={'chat-message' + (isFromCurrentUser ? ' from-current-user' : '')}>{message.text}</div>;
};

export default ChatMessage;
