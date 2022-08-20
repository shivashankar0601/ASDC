import { Module } from '@nestjs/common';
import { MediaUploaderController } from './media-uploader.controller';

@Module({
  controllers: [MediaUploaderController],
})
export class MediaUploaderModule {}
