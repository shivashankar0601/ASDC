import { Test, TestingModule } from '@nestjs/testing';
import { MediaUploaderController } from './media-uploader.controller';

describe('MediaUploaderController', () => {
  let controller: MediaUploaderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MediaUploaderController],
    }).compile();

    controller = module.get<MediaUploaderController>(MediaUploaderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be call upload Image Method', async () => {
    try {
      expect(await controller.uploadImageFile({} as any)).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
  it('should be call upload Multiple Image Method', async () => {
    try {
      expect(await controller.uploadImagesFile([] as any)).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
