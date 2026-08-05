import { PrismaService } from '../prisma/prisma.service';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: {
        productId: string;
        startTime: Date;
        endTime: Date;
        maxParticipants?: number;
        meetingLink?: string;
    }): Promise<{
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
    remove(userId: string, id: string): Promise<{
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
