import LoginRegister from '../components/login-register/LoginRegister';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { setTabBarVisibility } from '../utils/util';

const RegisterPage: React.FC = () => {
    setTabBarVisibility();
    useDocumentTitle('Register');
    return <LoginRegister isLogin={false} />;
};
export default RegisterPage;
