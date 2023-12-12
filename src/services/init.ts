import { User } from 'firebase/auth';
import LocalStorage from './localStorage';
import ProfileData from './userProfile';

class Init {
    private _userProfile;
    constructor() {
        this._userProfile = ProfileData;
    }

    async initUserProfile(user: User) {
        this._userProfile.AccessToken = await user.getIdToken();
        this._userProfile.UserId = user.uid;
    }

    static redirectToLogin() {
        LocalStorage.remove('AccessToken');
        LocalStorage.remove('UserId');
        window.location.href = '/login';
    }
}
export default Init;
