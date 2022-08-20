import {
  Controller,
  Post,
  UnsupportedMediaTypeException,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import cloudinary from 'cloudinary';
import fs from 'fs';
import { diskStorage } from 'multer';
import path from 'path';
import cloudinaryUploader from '../config/Cloudinary';

const storage = () =>
  diskStorage({
    destination: (_req, _file, cb) =>
      cb(null, path.join(__dirname, '../uploads')),
    filename: (_req, file, cb) => {
      return cb(null, `${Date.now()}.jpg`);
    },
  });

@Controller('media-uploader')
@ApiTags('Media Uploads')
export class MediaUploaderController {
  @Post('upload/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: storage(),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.includes('image')) {
          cb(null, true);
        } else {
          cb(new UnsupportedMediaTypeException('invalid file type'), false);
        }
      },
    }),
  )
  async uploadImageFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<cloudinary.UploadApiResponse> {
    const UploadedData = await cloudinaryUploader.v2.uploader.upload(file.path);

    fs.unlinkSync(file.path);
    return UploadedData;
  }

  @Post('upload/images')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: storage(),
      fileFilter: (_req, file, cb) => {
        if (file.mimetype.includes('image')) {
          cb(null, true);
        } else {
          cb(new UnsupportedMediaTypeException('invalid file type'), false);
        }
      },
    }),
  )
  async uploadImagesFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<cloudinary.UploadApiResponse[]> {
    const data: cloudinary.UploadApiResponse[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const UploadedData = await cloudinaryUploader.v2.uploader.upload(
        file.path,
      );
      fs.unlinkSync(file.path);
      data.push(UploadedData);
    }

    return data;
  }
}
