import { User } from 'firebase/auth';
import LocalStorage from './localStorage';
import ProfileData from './userProfile';

class Init {
    private _userProfile;
    constructor() {
        this._userProfile = ProfileData;
    }

    async initUserProfile(user: IUser, accesToken: string) {
        this._userProfile.AccessToken = accesToken;
        if (user.id) {
            this._userProfile.UserId = user.id;
        }
        if (user.photoURL) {
            this._userProfile.PhotoUrl = user.photoURL;
        }
    }

    static redirectToLogin() {
        LocalStorage.remove('AccessToken');
        LocalStorage.remove('UserId');
        window.location.href = '/login';
    }
}
export default Init;
