import LoginRegister from '../components/login-register/LoginRegister';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const LoginPage: React.FC = () => {
    setTabBarVisibility();
    useDocumentTitle('Login');
    return <LoginRegister isLogin={true} />;
};
export default LoginPage;
