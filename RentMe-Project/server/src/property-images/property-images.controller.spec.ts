import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyImagesController } from './property-images.controller';
import { PropertyImagesService } from './property-images.service';

describe('PropertyImagesController', () => {
  let controller: PropertyImagesController;

  const mockPropertyImagesService = {
    create: jest.fn().mockImplementation(() => {
      return Promise.resolve({});
    }),
    findAll: jest.fn().mockImplementation(() => {
      return Promise.resolve({});
    }),
    findOne: jest.fn().mockImplementation(() => {
      return Promise.resolve({});
    }),
    remove: jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyImagesController],
      providers: [PropertyImagesService],
    })
      .overrideProvider(PropertyImagesService)
      .useValue(mockPropertyImagesService)
      .compile();

    controller = module.get<PropertyImagesController>(PropertyImagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create property images', async () => {
    const dto: CreatePropertyImageDto = {
      imagePublicId: '',
      imageUrl: '',
      propertyId: -1,
      imageDescription: '',
    };
    expect(await controller.create(dto)).toBeDefined();
  });

  it('should find property images', async () => {
    expect(await controller.findAll()).toBeDefined();
  });

  it('should find one property images', async () => {
    expect(await controller.findOne('1')).toBeDefined();
  });

  it('should remove property images', async () => {
    expect(await controller.remove('1')).toBeDefined();
  });
});
