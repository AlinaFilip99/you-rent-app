interface IUser extends IBaseObject {
    displayName?: string;
    email: string;
    emailVerified: boolean;
    phoneNumber?: string;
    photoURL?: string;
}
