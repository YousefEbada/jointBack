export interface TypingStatus {
    roomId: string;
    userId: string;
    userType: 'patient' | 'doctor';
    userName: string;
    isTyping: boolean;
    timestamp: Date;
}

export interface OnlineUser {
    userId: string;
    userType: 'patient' | 'doctor';
    socketId: string;
    roomIds: string[];
    lastSeen: Date;
}