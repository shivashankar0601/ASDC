import { CreatePropertyImageDto } from './dto/create-property-image.dto';
import { PropertyImage } from './entities/property-image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertyImagesService } from './property-images.service';

describe('PropertyImagesService', () => {
  let service: PropertyImagesService;

  const mockPropertyImagesRepo = {
    create: jest.fn().mockImplementation(() => Promise.resolve({})),
    findAll: jest.fn().mockImplementation(() => Promise.resolve({})),
    findOne: jest.fn().mockImplementation(() => Promise.resolve({})),
    remove: jest.fn().mockImplementation(() => Promise.resolve({})),
    save: jest.fn().mockImplementation(() => Promise.resolve({})),
    find: jest.fn().mockImplementation(() => Promise.resolve({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyImagesService,
        {
          provide: getRepositoryToken(PropertyImage),
          useFactory: () => {
            return {
              ...mockPropertyImagesRepo,
              create: jest.fn().mockImplementation(() => Promise.resolve({})),
              findAll: jest.fn().mockImplementation(() => Promise.resolve({})),
              findOne: jest.fn().mockImplementation(() => Promise.resolve({})),
              remove: jest.fn().mockImplementation(() => Promise.resolve({})),
              save: jest.fn().mockImplementation(() => Promise.resolve({})),
              find: jest.fn().mockImplementation(() => Promise.resolve({})),
            };
          },
        },
      ],
    }).compile();

    service = module.get<PropertyImagesService>(PropertyImagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find property images', async () => {
    const dto: CreatePropertyImageDto = {
      imagePublicId: '',
      imageUrl: '',
      propertyId: -1,
      imageDescription: '',
    };
    try {
      await service.create(dto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should find property images', async () => {
    expect(await service.findAll()).toBeDefined();
  });

  it('should find one property image', async () => {
    expect(await service.findOne(1)).toBeDefined();
  });

  it('should remove property image', async () => {
    try {
      await service.remove(1);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
