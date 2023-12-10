import EstateList from '../components/estates/EstateList';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const EstatesPage: React.FC = () => {
    useDocumentTitle('Estates');
    setTabBarVisibility();
    return <EstateList />;
};
export default EstatesPage;
