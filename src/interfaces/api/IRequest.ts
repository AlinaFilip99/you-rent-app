interface IRequest extends IBaseObject {
    estateId: string;
    estateName: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    receiverId: string;
    isAccepted: boolean;
    isPending: boolean;
    lastMessage: string;
}
