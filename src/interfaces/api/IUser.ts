interface IUser extends IBaseObject {
    displayName?: string;
    email: string;
    emailVerified: boolean;
    phoneNumber?: string;
    photoURL?: string;
    description?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedInUrl?: string;
    workPlace?: string;
    highestEducation?: string;
    from?: string;
    birthday?: string;
    relationshipStatusType?: number;
    gender?: number;
}
