import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class WithdrawalsService {
    private prisma;
    private configService;
    private readonly FEE;
    constructor(prisma: PrismaService, configService: ConfigService);
    updateBankDetails(userId: string, data: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    }): Promise<{
        id: string;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
    }>;
    getWithdrawals(userId: string): Promise<{
        id: string;
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        status: import("@prisma/client").$Enums.WithdrawalStatus;
        fee: number;
        netAmount: number;
        processedAt: Date | null;
    }[]>;
    requestWithdrawal(userId: string, amount: number): Promise<{
        id: string;
        bankName: string;
        accountNumber: string;
        accountHolder: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        amount: number;
        status: import("@prisma/client").$Enums.WithdrawalStatus;
        fee: number;
        netAmount: number;
        processedAt: Date | null;
    }>;
}
