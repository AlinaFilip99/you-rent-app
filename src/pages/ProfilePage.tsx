import { useParams } from 'react-router';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';
import Profile from '../components/profile/Profile';
import userProfile from '../services/userProfile';

const ProfilePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    useDocumentTitle('Profile');
    setTabBarVisibility();
    return <Profile userId={id || userProfile.UserId} showBackButton={id ? true : false} />;
};
export default ProfilePage;
