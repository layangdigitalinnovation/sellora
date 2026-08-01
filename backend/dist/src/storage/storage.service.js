"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const pdf_lib_1 = require("pdf-lib");
let StorageService = class StorageService {
    s3;
    bucket;
    constructor() {
        this.bucket = process.env.R2_BUCKET_NAME || 'creator-platform-files';
        this.s3 = new client_s3_1.S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
            },
        });
    }
    async getVideoSignedUrl(key, expirySeconds = 900) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            return await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: expirySeconds });
        }
        catch (e) {
            throw new common_1.InternalServerErrorException('Failed to generate video signed URL');
        }
    }
    async getWatermarkedPdf(key, buyerName, buyerEmail, buyerPhone) {
        try {
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            const response = await this.s3.send(command);
            if (!response.Body)
                throw new Error('File not found in storage');
            const fileBytes = await response.Body.transformToByteArray();
            if (fileBytes.length > 15 * 1024 * 1024) {
                throw new Error('PDF file size exceeds the 15MB limit for watermarking');
            }
            const pdfDoc = await pdf_lib_1.PDFDocument.load(fileBytes);
            const pages = pdfDoc.getPages();
            const watermarkText = `Licensed to ${buyerName} | ${buyerEmail} | ${buyerPhone}`;
            for (const page of pages) {
                const { width, height } = page.getSize();
                page.drawText(watermarkText, {
                    x: width / 2 - 200,
                    y: height / 2,
                    size: 20,
                    color: (0, pdf_lib_1.rgb)(0.8, 0.8, 0.8),
                    rotate: (0, pdf_lib_1.degrees)(45),
                    opacity: 0.3,
                });
                page.drawText(watermarkText, {
                    x: 20,
                    y: 20,
                    size: 10,
                    color: (0, pdf_lib_1.rgb)(0.5, 0.5, 0.5),
                    opacity: 0.8,
                });
            }
            return await pdfDoc.save();
        }
        catch (error) {
            console.error(error);
            throw new common_1.InternalServerErrorException('Failed to generate watermarked PDF');
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map