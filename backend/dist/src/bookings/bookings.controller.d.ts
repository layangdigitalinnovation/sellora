import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        maxParticipants: number;
        meetingLink: string | null;
        productId: string;
    }>;
    getByProduct(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        maxParticipants: number;
        meetingLink: string | null;
        productId: string;
    }[]>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        startTime: Date;
        endTime: Date;
        maxParticipants: number;
        meetingLink: string | null;
        productId: string;
    }>;
}
