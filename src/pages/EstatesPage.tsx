import { useParams } from 'react-router';
import EstateList from '../components/estates/EstateList';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const EstatesPage: React.FC = () => {
    const { searchCriteriaId } = useParams<{ searchCriteriaId: string }>();
    useDocumentTitle('Estates');
    setTabBarVisibility();
    return <EstateList searchCriteriaId={searchCriteriaId} />;
};
export default EstatesPage;
