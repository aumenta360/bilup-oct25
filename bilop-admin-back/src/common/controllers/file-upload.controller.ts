import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../services/file-upload.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post(':type')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param('type') type: string,
  ) {
    const filePath = await this.fileUploadService.uploadFile(file, type);
    return {
      url: this.fileUploadService.getFileUrl(filePath),
      path: filePath,
    };
  }
} 