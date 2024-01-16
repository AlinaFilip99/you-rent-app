import LocalStorage from './localStorage';

class ProfileData {
    constructor() {
        if (!this.checkAuthStatus()) {
            return;
        }
    }

    get PhotoUrl(): string {
        return LocalStorage.read('PhotoUrl');
    }
    set PhotoUrl(value: string) {
        LocalStorage.write('PhotoUrl', value);
    }

    get UserId(): string {
        return LocalStorage.read('UserId');
    }
    set UserId(value: string) {
        LocalStorage.write('UserId', value);
    }

    get AccessToken(): string {
        return LocalStorage.read('AccessToken');
    }
    set AccessToken(value: string) {
        LocalStorage.write('AccessToken', value);
    }

    checkAuthStatus = () => {
        const AlreadyRedirectedToLogin = LocalStorage.read('AlreadyRedirectedToLogin');
        if (!this.AccessToken && !AlreadyRedirectedToLogin) {
            LocalStorage.clear();
            LocalStorage.write('AlreadyRedirectedToLogin', 'true');
            window.location.href = '/login';
            return false;
        }
        return true;
    };
}
export default new ProfileData();
