import { Module } from '@nestjs/common';
import { BugReportService } from './bug-report.service';
import { BugReportController } from './bug-report.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BugReport } from './entities/bug-report.entity';
import { FileService } from 'src/shared/services/file.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BugReport]), UserModule],
  controllers: [BugReportController],
  providers: [BugReportService, FileService],
})
export class BugReportModule {}
