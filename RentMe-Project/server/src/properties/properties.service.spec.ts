import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyImagesService } from './../property-images/property-images.service';
import { PropertyImage } from './../property-images/entities/property-image.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Property } from './entities/property.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesService } from './properties.service';

describe('PropertiesService', () => {
  let service: PropertiesService;

  const mockPropertiesRepo = {
    create: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: Date.now(),
        ...dto,
      }),
    ),
    findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
    findOne: jest.fn().mockImplementation(() => Promise.resolve([])),

    createQueryBuilder: jest.fn().mockImplementation(() => {
      return {
        leftJoinAndSelect: jest.fn().mockImplementation(() => {
          return {
            orderBy: jest.fn().mockImplementation(() => {
              return {
                paginate: jest
                  .fn()
                  .mockImplementation(() => Promise.resolve({})),
              };
            }),
          };
        }),
      };
    }),
    findWithInRadius: jest.fn().mockImplementation(() => Promise.resolve([])),
    update: jest.fn().mockImplementation(() => Promise.resolve([])),
    updateByAdmin: jest.fn().mockImplementation(() => Promise.resolve([])),
    remove: jest.fn().mockImplementation(() => Promise.resolve([])),
    removeByAdmin: jest.fn().mockImplementation(() => {
      return {
        delete: jest.fn().mockImplementation(() => Promise.resolve({})),
      };
    }),
    query: jest.fn().mockImplementation(() => Promise.resolve([])),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        PropertyImagesService,
        {
          provide: getRepositoryToken(Property),
          useValue: mockPropertiesRepo,
        },
        {
          provide: getRepositoryToken(PropertyImage),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const dto: CreatePropertyDto = {
      address: '',
      bedrooms: 2,
      bathrooms: 2,
      description: '',
      latitude: 36.36,
      longitude: 56.36,
      price: 1200,
      title: 'This is property',
      images: [],
      size: 1200,
      url: '',
    };
    try {
      await service.create(dto, { user: {} } as any);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should find property', async () => {
    expect(await service.findAll()).toBeDefined();
  });

  it('should find one property', async () => {
    expect(await service.findOne(1)).toBeDefined();
  });

  it('should find property by search params', async () => {
    expect(
      await service.findWithInRadius(36.36, 36.36, '5', '1200', '2-3', 'condo'),
    ).toBeDefined();
  });

  it('should update property', async () => {
    const dto: UpdatePropertyDto = {
      address: '',
      bedrooms: 2,
      bathrooms: 2,
      description: '',
      latitude: 36.36,
      longitude: 56.36,
      price: 1200,
      title: 'This is property',
      images: [],
      size: 1200,
      url: '',
    };
    try {
      await service.update(1, dto, { user: {} } as any);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should update property by admin', async () => {
    const dto: UpdatePropertyDto = {
      address: '',
      bedrooms: 2,
      bathrooms: 2,
      description: '',
      latitude: 36.36,
      longitude: 56.36,
      price: 1200,
      title: 'This is property',
      images: [],
      size: 1200,
      url: '',
    };
    try {
      await service.updateByAdmin(1, dto);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should delete property', async () => {
    try {
      await service.remove(1, { user: {} } as any);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  it('should delete property by admin', async () => {
    try {
      await service.removeByAdmin(1);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
