import { Room } from "./Room";

export interface Tenant {
    id?: number;
    name: string;
    phoneNumber: string;
    address: string;
    joinDate: string;
    endDate?: string;
    depositAmount: number;
    occupancyStatus: string;
    rentPaid: boolean;

    room?: Room | null;
}
