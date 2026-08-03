import { PaymentsService } from './payments.service';
import { StorageService } from '../storage/storage.service';
import type { Response } from 'express';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly storageService;
    constructor(paymentsService: PaymentsService, storageService: StorageService);
    checkout(body: any): Promise<{
        checkoutUrl: any;
        orderId: string;
    }>;
    xenditWebhook(body: any, req: any): Promise<{
        success: boolean;
    }>;
    getOrder(id: string): Promise<{
        store: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            customDomain: string | null;
            description: string | null;
            logoUrl: string | null;
            theme: string | null;
            primaryColor: string | null;
            customCss: string | null;
            headerImageUrl: string | null;
            profileImageUrl: string | null;
            socialLinks: import("@prisma/client/runtime/client").JsonValue | null;
            contentBgColor: string | null;
            bannerImageUrl: string | null;
            ctaText: string | null;
            ctaLink: string | null;
            isVerified: boolean;
            isActive: boolean;
            userId: string;
        };
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            title: string;
            storeId: string;
            type: import("@prisma/client").$Enums.ProductType;
            price: number;
            originalPrice: number | null;
            imageUrl: string | null;
            fileUrl: string | null;
            fileSize: number | null;
            mimeType: string | null;
            isPwyw: boolean;
            minPwywPrice: number | null;
            flashSaleEndDate: Date | null;
            flashSaleMaxQuota: number | null;
            totalSales: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        amount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentRef: string | null;
        storeId: string;
        productId: string;
        bookingSlotId: string | null;
        buyerEmail: string;
        buyerName: string;
        buyerPhone: string | null;
        buyerAddress: string | null;
        paymentGateway: string | null;
        paymentMethod: string | null;
        externalId: string | null;
        paidAt: Date | null;
        downloadUrl: string | null;
        downloadExpiry: Date | null;
    }>;
    getVideoUrl(id: string): Promise<{
        url: string;
    }>;
    downloadFile(id: string, res: Response): Promise<void>;
    downloadPdf(id: string, res: Response): Promise<void>;
}
