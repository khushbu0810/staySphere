import { Tenant } from "./Tenant";

export interface Room {
    id?: number;
    roomNumber: number;
    roomType: string;
    capacity: number;
    currentOccupancy: number;
    vacancy: number;
    rentAmount: number;
    isAvailable: boolean;
    tenants?: Tenant[];
}

