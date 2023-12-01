import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const EstatesPage: React.FC = () => {
    useDocumentTitle('Estates');
    setTabBarVisibility();
    return <>tbd</>;
};
export default EstatesPage;
