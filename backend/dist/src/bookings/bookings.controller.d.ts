import { BookingsService } from './bookings.service';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, body: any): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        startTime: Date;
        endTime: Date;
        maxParticipants: number;
        meetingLink: string | null;
    }>;
    getByProduct(productId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        startTime: Date;
        endTime: Date;
        maxParticipants: number;
        meetingLink: string | null;
    }[]>;
    remove(req: any, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        productId: string;
        startTime: Date;
        endTime: Date;
        maxParticipants: number;
        meetingLink: string | null;
    }>;
}
