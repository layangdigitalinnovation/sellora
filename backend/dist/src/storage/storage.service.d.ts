export declare class StorageService {
    private s3;
    private bucket;
    constructor();
    getVideoSignedUrl(key: string, expirySeconds?: number): Promise<string>;
    getWatermarkedPdf(key: string, buyerName: string, buyerEmail: string, buyerPhone: string): Promise<Uint8Array>;
}
