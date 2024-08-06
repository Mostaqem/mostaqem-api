import { Test, TestingModule } from '@nestjs/testing';
import { ReciterController } from './reciter.controller';
import { ReciterService } from './reciter.service';
import { CreateReciterDto } from './dto/create-reciter.dto';
import { AddImageDto } from './dto/add-image.dto';
import { Reciter } from './entities/reciter.entity';

describe('ReciterController', () => {
  let controller: ReciterController;
  let service: ReciterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReciterController],
      providers: [
        {
          provide: ReciterService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateReciterImage: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReciterController>(ReciterController);
    service = module.get<ReciterService>(ReciterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reciter', async () => {
      const createReciterDto: CreateReciterDto = {
        id: 1,
        name_english: 'John Doe',
        name_arabic: 'جون دو',
        image: 'http://example.com/image.jpg',
      };
      const expectedResult = { id: 1, ...createReciterDto };

      jest
        .spyOn(service, 'create')
        .mockResolvedValue(expectedResult as Reciter);

      expect(await controller.create(createReciterDto)).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createReciterDto);
    });
  });

  describe('findAll', () => {
    it('should return all reciters', async () => {
      const expectedResult = [
        { id: 1, name_english: 'John Doe', name_arabic: 'جون دو' },
      ];
      jest
        .spyOn(service, 'findAll')
        .mockResolvedValue(expectedResult as Reciter[]);

      expect(await controller.findAll('eng')).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith('eng');
    });
  });

  describe('findOne', () => {
    it('should return a single reciter', async () => {
      const expectedResult = {
        id: 1,
        name_english: 'John Doe',
        name_arabic: 'جون دو',
      };
      jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(expectedResult as Reciter);

      expect(await controller.findOne('1')).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('addSurahImage', () => {
    it('should update reciter image', async () => {
      const addImageDto: AddImageDto = {
        image: 'http://example.com/new-image.jpg',
      };
      const expectedResult = {
        id: 1,
        name_english: 'John Doe',
        name_arabic: 'جون دو',
        image: addImageDto.image,
      };
      jest
        .spyOn(service, 'updateReciterImage')
        .mockResolvedValue(expectedResult as Reciter);

      expect(await controller.addSurahImage(1, addImageDto)).toBe(
        expectedResult,
      );
      expect(service.updateReciterImage).toHaveBeenCalledWith(
        1,
        addImageDto.image,
      );
    });
  });
});
