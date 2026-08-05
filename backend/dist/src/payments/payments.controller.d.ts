import { PaymentsService } from './payments.service';
import { StorageService } from '../storage/storage.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import type { Response } from 'express';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly storageService;
    private readonly subscriptionsService;
    constructor(paymentsService: PaymentsService, storageService: StorageService, subscriptionsService: SubscriptionsService);
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
            userId: string;
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
        };
        product: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            storeId: string;
            type: import("@prisma/client").$Enums.ProductType;
            title: string;
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
        storeId: string;
        productId: string;
        bookingSlotId: string | null;
        buyerEmail: string;
        buyerName: string;
        buyerPhone: string | null;
        buyerAddress: string | null;
        amount: number;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentGateway: string | null;
        paymentMethod: string | null;
        paymentRef: string | null;
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
