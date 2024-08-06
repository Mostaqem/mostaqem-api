import { Test, TestingModule } from '@nestjs/testing';
import { SurahController } from './surah.controller';
import { SurahService } from './surah.service';
import { CreateSurahDto } from './dto/create-surah.dto';
import { AddImageDto } from './dto/add-image.dto';
import { NotFoundException } from '@nestjs/common';

describe('SurahController', () => {
  let surahController: SurahController;
  let surahService: SurahService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [SurahController],
      providers: [
        {
          provide: SurahService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            updateSurahImage: jest.fn(),
          },
        },
      ],
    }).compile();

    surahController = moduleRef.get<SurahController>(SurahController);
    surahService = moduleRef.get<SurahService>(SurahService);
  });

  it('should be defined', () => {
    expect(surahController).toBeDefined();
  });

  describe('create', () => {
    it('should call surahService.create with the correct parameters', async () => {
      const createSurahDto: CreateSurahDto = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
      };
      const result = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
        image: null,
        verses: [],
        reciterSurah: [],
      };

      jest.spyOn(surahService, 'create').mockResolvedValue(result);

      expect(await surahController.create(createSurahDto)).toEqual(result);
      expect(surahService.create).toHaveBeenCalledWith(createSurahDto);
    });

    it('should handle errors in creation', async () => {
      const createSurahDto: CreateSurahDto = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
      };

      jest
        .spyOn(surahService, 'create')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(surahController.create(createSurahDto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all surahs', async () => {
      const surahs = [
        {
          id: 1,
          name_arabic: 'الفاتحة',
          name_complex: 'Al-Fatiha',
          verses_count: 7,
          revelation_place: 'Meccan',
          image: null,
          verses: [],
          reciterSurah: [],
        },
      ];

      jest.spyOn(surahService, 'findAll').mockResolvedValue(surahs);

      expect(await surahController.findAll()).toEqual(surahs);
      expect(surahService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a surah by id', async () => {
      const surah = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
        image: null,
        verses: [],
        reciterSurah: [],
      };

      jest.spyOn(surahService, 'findOne').mockResolvedValue(surah);

      expect(await surahController.findOne('1')).toEqual(surah);
      expect(surahService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if surah is not found', async () => {
      jest
        .spyOn(surahService, 'findOne')
        .mockRejectedValue(new NotFoundException());

      await expect(surahController.findOne('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('addSurahImage', () => {
    it('should call surahService.updateSurahImage with the correct parameters', async () => {
      const addImageDto: AddImageDto = {
        image: 'http://example.com/image.jpg',
      };
      const result = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
        image: 'http://example.com/image.jpg',
        verses: [],
        reciterSurah: [],
      };

      jest.spyOn(surahService, 'updateSurahImage').mockResolvedValue(result);

      expect(await surahController.addSurahImage(1, addImageDto)).toEqual(
        result,
      );
      expect(surahService.updateSurahImage).toHaveBeenCalledWith(
        1,
        addImageDto.image,
      );
    });

    it('should handle errors while updating image', async () => {
      jest
        .spyOn(surahService, 'updateSurahImage')
        .mockRejectedValue(new NotFoundException());

      await expect(
        surahController.addSurahImage(1, {
          image: 'http://example.com/image.jpg',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
