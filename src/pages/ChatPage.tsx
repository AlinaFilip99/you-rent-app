import { useParams } from 'react-router';
import Chat from '../components/requests/Chat';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const ChatPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    useDocumentTitle('Chat');
    setTabBarVisibility();
    return <Chat requestId={id} />;
};
export default ChatPage;
