import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
export declare class PaymentsService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    checkout(data: {
        productId: string;
        buyerName: string;
        buyerEmail: string;
        buyerPhone?: string;
        buyerAddress?: string;
        successRedirectUrl?: string;
        failureRedirectUrl?: string;
        amount?: number;
        bookingSlotId?: string;
    }): Promise<{
        checkoutUrl: any;
        orderId: string;
    }>;
    handleXenditWebhook(data: any, callbackToken: string): Promise<{
        success: boolean;
    }>;
    getOrder(orderId: string): Promise<{
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
}
