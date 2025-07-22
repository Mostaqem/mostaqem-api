import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BugReport } from './entities/bug-report.entity';
import { CreateBugReportDto } from './dto/create-bug-report.dto';
import { FileService } from 'src/shared/services/file.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class BugReportService {
  constructor(
    @InjectRepository(BugReport)
    private readonly bugReportRepository: Repository<BugReport>,
    private readonly fileService: FileService,
    private readonly userService: UserService,
  ) {}

  async create(
    createBugReportDto: CreateBugReportDto,
    image?: Express.Multer.File,
  ): Promise<BugReport> {
    // Create a new object to map fields between DTO and entity
    const bugReportData = {
      user_id: createBugReportDto.user_id,
      android_version: createBugReportDto.android_version,
      brand: createBugReportDto.brand,
      body: createBugReportDto.body,
      image_url: null,
    };

    // Handle the image if provided
    if (image) {
      await this.fileService.validateFile(image);
      bugReportData.image_url = await this.fileService.saveFile(image);
    }

    // Create and save the bug report
    const bugReport = this.bugReportRepository.create(bugReportData);

    return this.bugReportRepository.save(bugReport);
  }
}
