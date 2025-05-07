import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { SigendUser } from 'src/shared/decorators/signed-user.decorators';
import { User } from 'src/user/entities/user.entity';
import { BugReportService } from './bug-report.service';
import { CreateBugReportDto } from './dto/create-bug-report.dto';

@Controller('bug-report')
@UseGuards(JwtGuard)
export class BugReportController {
  constructor(private readonly bugReportService: BugReportService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createBugReportDto: CreateBugReportDto,
    @UploadedFile() image: Express.Multer.File,
    @SigendUser() user: User,
  ) {
    // Set the user ID from the authenticated user
    createBugReportDto.user_id = user.id;
    const result = await this.bugReportService.create(
      createBugReportDto,
      image,
    );
    return result;
  }
}
