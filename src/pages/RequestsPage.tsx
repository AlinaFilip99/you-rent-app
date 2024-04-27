import RequestList from '../components/requests/RequestList';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const RequestsPage: React.FC = () => {
    useDocumentTitle('Requests');
    setTabBarVisibility();
    return <RequestList />;
};
export default RequestsPage;
