import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { UPLOAD_PATH } from 'src/app.module';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly uploadPath = UPLOAD_PATH;
  private readonly allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

  constructor() {
    // Ensure the uploads directory exists
    this.ensureUploadDirectoryExists();
  }

  private ensureUploadDirectoryExists(): void {
    try {
      if (!fs.existsSync(this.uploadPath)) {
        fs.mkdirSync(this.uploadPath, { recursive: true });
      }
    } catch (error) {
      this.logger.error(`Failed to create upload directory: ${error.message}`);
      throw new Error(`Failed to create upload directory: ${error.message}`);
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    try {
      if (!file || !file.buffer) {
        throw new BadRequestException('No file or empty buffer provided');
      }

      // Ensure upload directory exists
      this.ensureUploadDirectoryExists();

      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
      const filePath = path.join(this.uploadPath, fileName);
      const photoUrl = `${process.env.PUBLIC_URL}/uploads/${fileName}`;

      // Use fs.promises for better error handling
      await fs.promises.writeFile(filePath, file.buffer);

      return photoUrl;
    } catch (error) {
      this.logger.error(`Failed to save file: ${error.message}`, error.stack);
      throw new BadRequestException(`Failed to save file: ${error.message}`);
    }
  }

  // Convert URL path to file system path
  private urlToFilePath(urlPath: string): string {
    try {
      // Extract just the filename from the URL
      const fileName = urlPath.split('/uploads/')[1];
      if (!fileName) throw new Error('Invalid file path format');
      return path.join(this.uploadPath, fileName);
    } catch (error) {
      this.logger.error('Error converting URL to file path:', error.message);
      return null;
    }
  }

  async deleteFile(urlPath: string): Promise<void> {
    if (!urlPath) return;

    // Convert URL to file system path
    const filePath = this.urlToFilePath(urlPath);
    if (!filePath) {
      this.logger.warn(`Could not convert URL to file path: ${urlPath}`);
      return;
    }

    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        this.logger.log(`File deleted successfully: ${filePath}`);
      } catch (error) {
        this.logger.error(`Error deleting file: ${filePath}`, error.message);
      }
    } else {
      this.logger.warn(`File not found: ${filePath}`);
    }
  }

  async validateFile(file?: Express.Multer.File): Promise<void> {
    if (file) {
      const ext = file.mimetype.split('/')[1];
      if (!this.allowedExtensions.includes(ext.toLowerCase())) {
        this.logger.warn(
          `Invalid file format. Allowed: ${this.allowedExtensions.join(', ')}`,
        );
        throw new BadRequestException(
          `Invalid file format. Allowed: ${this.allowedExtensions.join(', ')}`,
        );
      }
    }
  }
}
