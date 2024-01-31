
export interface IQRAccessReq {
    phone: string;
    locks: string[];
    valid_from: number;
    valid_to: number;
}

export interface IQRAccess extends IQRAccessReq{
    id: string;
    author: string;
    link?: string
}


export interface IWeeklyQRAccessReq extends IQRAccessReq{
    scheduleId: string
}

export interface IWeeklyQRAccess extends IQRAccess, IWeeklyQRAccessReq {
}


