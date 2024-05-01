interface IRequestMessage extends IBaseObject {
    sendDate: string;
    senderId: string;
    status: number; // 1-sent, 2-seen, 0-pending
    text: string;
}
