import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PDFDocument, rgb, degrees } from 'pdf-lib';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private bucket: string;

  constructor() {
    this.bucket = process.env.R2_BUCKET_NAME || 'creator-platform-files';
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: process.env.R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async getVideoSignedUrl(key: string, expirySeconds = 900): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      return await getSignedUrl(this.s3, command, { expiresIn: expirySeconds });
    } catch (e) {
      throw new InternalServerErrorException('Failed to generate video signed URL');
    }
  }

  async getWatermarkedPdf(key: string, buyerName: string, buyerEmail: string, buyerPhone: string): Promise<Uint8Array> {
    try {
      // 1. Download file from R2
      const command = new GetObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      
      const response = await this.s3.send(command);
      if (!response.Body) throw new Error('File not found in storage');
      
      const fileBytes = await response.Body.transformToByteArray();
      
      // Enforce 15MB limit check during rendering
      if (fileBytes.length > 15 * 1024 * 1024) {
         throw new Error('PDF file size exceeds the 15MB limit for watermarking');
      }

      // 2. Add Watermark using pdf-lib
      const pdfDoc = await PDFDocument.load(fileBytes);
      const pages = pdfDoc.getPages();
      
      const watermarkText = `Licensed to ${buyerName} | ${buyerEmail} | ${buyerPhone}`;
      
      for (const page of pages) {
        const { width, height } = page.getSize();
        
        // Diagonal watermark
        page.drawText(watermarkText, {
          x: width / 2 - 200,
          y: height / 2,
          size: 20,
          color: rgb(0.8, 0.8, 0.8),
          rotate: degrees(45),
          opacity: 0.3,
        });
        
        // Footer watermark
        page.drawText(watermarkText, {
          x: 20,
          y: 20,
          size: 10,
          color: rgb(0.5, 0.5, 0.5),
          opacity: 0.8,
        });
      }

      return await pdfDoc.save();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to generate watermarked PDF');
    }
  }
}
