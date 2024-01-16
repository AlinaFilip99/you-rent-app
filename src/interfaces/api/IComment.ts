interface IComment extends IBaseObject {
    createDateTime: string;
    estateId?: string;
    message: string;
    score?: number;
    userId: string;
    profileId?: string;
}
