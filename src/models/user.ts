export interface IUser {
    token: string;
    expiresIn: string;
    user: IUserData
}

export interface IUserData {
    _id?: string;
    email?: string;
    AgendaId?: string;
    customerName?: string;
    deviceId?: string;
    MACAddress?: string;
    expiresIn?: number;
}   
