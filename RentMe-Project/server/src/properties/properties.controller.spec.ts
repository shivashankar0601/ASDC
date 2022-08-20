import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

describe('PropertiesController', () => {
  let controller: PropertiesController;

  const mockPropertyService = {
    create: jest.fn().mockImplementation(() => Promise.resolve({})),
    findAll: jest.fn().mockImplementation(() => Promise.resolve({})),
    findByLatLong: jest.fn().mockImplementation(() => Promise.resolve({})),
    findWithInRadius: jest.fn().mockImplementation(() => Promise.resolve({})),
    findOne: jest.fn().mockImplementation(() => Promise.resolve({})),
    update: jest.fn().mockImplementation(() => Promise.resolve({})),
    updateByAdmin: jest.fn().mockImplementation(() => Promise.resolve({})),
    remove: jest.fn().mockImplementation(() => Promise.resolve({})),
    removeByAdmin: jest.fn().mockImplementation(() => Promise.resolve({})),
    save: jest.fn().mockImplementation(() => Promise.resolve({})),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [PropertiesService],
    })
      .overrideProvider(PropertiesService)
      .useFactory({
        factory: () => {
          return {
            create: jest.fn().mockImplementation(() => Promise.resolve({})),
            findAll: jest.fn().mockImplementation(() => Promise.resolve({})),
            findByLatLong: jest
              .fn()
              .mockImplementation(() => Promise.resolve({})),
            findWithInRadius: jest
              .fn()
              .mockImplementation(() => Promise.resolve({})),
            findOne: jest.fn().mockImplementation(() => Promise.resolve({})),
            update: jest.fn().mockImplementation(() => Promise.resolve({})),
            updateByAdmin: jest
              .fn()
              .mockImplementation(() => Promise.resolve({})),
            remove: jest.fn().mockImplementation(() => Promise.resolve({})),
            removeByAdmin: jest
              .fn()
              .mockImplementation(() => Promise.resolve({})),
            save: jest.fn().mockImplementation(() => Promise.resolve({})),
          };
        },
      })
      .compile();

    controller = module.get<PropertiesController>(PropertiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create property', async () => {
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
    expect(await controller.create(dto, { user: {} } as any)).toBeDefined();
  });

  it('should find all property', async () => {
    expect(await controller.findAll()).toBeDefined();
  });

  it('should find  property by id', async () => {
    expect(await controller.findOne('1')).toBeDefined();
  });

  it('should find property by lat lng', async () => {
    expect(
      await controller.findByLatLong(36.36, 36.36, '2', 'condo', '1350', '2-3'),
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
    expect(
      await controller.update('1', dto, { user: {} } as any),
    ).toBeDefined();
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
    expect(await controller.updateByAdmin('1', dto)).toBeDefined();
  });

  it('should delete property', async () => {
    expect(await controller.remove('1', { user: {} } as any)).toBeDefined();
  });

  it('should delete property by admin', async () => {
    expect(await controller.removeByAdmin('1')).toBeDefined();
  });
});
