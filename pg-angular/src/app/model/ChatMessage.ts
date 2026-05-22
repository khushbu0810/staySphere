import { Room } from "./Room";
import { Tenant } from "./Tenant";

export interface ChatMessage {
    id?: number;
    sender: string;
    receiver: string;
    message: string;
    timestamp?: string;
    tenantId: number;
    room?: Partial<Room>;
}
