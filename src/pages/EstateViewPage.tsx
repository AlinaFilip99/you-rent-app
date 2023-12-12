import { useParams } from 'react-router';
import EstateView from '../components/estates/EstateView';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const EstateViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    useDocumentTitle('Estate view');
    setTabBarVisibility();
    return <EstateView estateId={id} />;
};
export default EstateViewPage;
