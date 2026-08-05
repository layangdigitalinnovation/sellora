import { WithdrawalsService } from './withdrawals.service';
export declare class WithdrawalsController {
    private readonly withdrawalsService;
    constructor(withdrawalsService: WithdrawalsService);
    getWithdrawals(req: any): Promise<{
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
    requestWithdrawal(req: any, body: {
        amount: number;
    }): Promise<{
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
    updateBankDetails(req: any, body: {
        bankName: string;
        accountNumber: string;
        accountHolder: string;
    }): Promise<{
        id: string;
        bankName: string | null;
        accountNumber: string | null;
        accountHolder: string | null;
    }>;
}
