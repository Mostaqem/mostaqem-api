import { Test, TestingModule } from '@nestjs/testing';
import { SurahService } from './surah.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Surah } from './entities/surah.entity';
import { Repository } from 'typeorm';
import { CreateSurahDto } from './dto/create-surah.dto';
import {
  NotFoundException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { SurahFilterDto } from './dto/surah-filter.dto';

const surahFilterDto: SurahFilterDto = {
  name: 'الفاتحة',
  page: 1,
  take: 10,
};

const surahs: Surah[] = [
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

const queryBuilderMock = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  orWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue(surahs),
  getCount: jest.fn().mockResolvedValue(1),
};
jest.mock('../../quran.json', () => [
  {
    id: 1,
    name: 'الفاتحة',
    transliteration: 'Al-Fatiha',
    total_verses: 7,
    type: 'Meccan',
  },
]);

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
};

describe('SurahService', () => {
  let surahService: SurahService;
  let surahRepository: Repository<Surah>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        SurahService,
        {
          provide: getRepositoryToken(Surah),
          useClass: Repository,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    surahService = moduleRef.get<SurahService>(SurahService);
    surahRepository = moduleRef.get<Repository<Surah>>(
      getRepositoryToken(Surah),
    );
  });

  it('should be defined', () => {
    expect(surahService).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new surah', async () => {
      const createSurahDto: CreateSurahDto = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
      };
      const createResult = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
        image: null,
        verses: [],
        reciterSurah: [],
      };

      jest
        .spyOn(surahRepository, 'create')
        .mockReturnValue(createResult as Surah);
      jest.spyOn(surahRepository, 'save').mockResolvedValue(createResult);

      const result = await surahService.create(createSurahDto);

      expect(surahRepository.create).toHaveBeenCalledWith(createSurahDto);
      expect(surahRepository.save).toHaveBeenCalledWith(createResult);
      expect(result).toEqual(createResult);
    });

    it('should handle errors while saving a surah', async () => {
      const createSurahDto: CreateSurahDto = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
      };

      jest
        .spyOn(surahRepository, 'create')
        .mockReturnValue(createSurahDto as Surah);
      jest
        .spyOn(surahRepository, 'save')
        .mockRejectedValue(new Error('Failed to save surah'));

      await expect(surahService.create(createSurahDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe('findAll', () => {
    it('should return paginated surahs based on filter', async () => {
      jest
        .spyOn(surahRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await surahService.findAll(surahFilterDto);

      expect(queryBuilderMock.where).toHaveBeenCalledWith('1 = 1');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'surah.name_arabic like :name',
        { name: 'الفاتحة%' },
      );
      expect(queryBuilderMock.orWhere).toHaveBeenCalledWith(
        'surah.name_complex like :name',
        { name: 'الفاتحة%' },
      );
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.getMany).toHaveBeenCalled();
      expect(queryBuilderMock.getCount).toHaveBeenCalled();
      expect(result).toEqual({
        surah: surahs,
        totalData: 1,
        totalPages: 1,
      });
    });

    it('should return paginated surahs without filter', async () => {
      const basicSurahFilterDto: SurahFilterDto = {
        page: 1,
        take: 10,
      };
      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(surahs),
        getCount: jest.fn().mockResolvedValue(1),
      };

      jest
        .spyOn(surahRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);
      const result = await surahService.findAll(basicSurahFilterDto);

      expect(queryBuilderMock.where).toHaveBeenCalledWith('1 = 1');
      // expect(queryBuilderMock.andWhere).not.toHaveBeenCalled();
      expect(queryBuilderMock.orWhere).not.toHaveBeenCalled();
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.getMany).toHaveBeenCalled();
      expect(queryBuilderMock.getCount).toHaveBeenCalled();
      expect(result).toEqual({
        surah: surahs,
        totalData: 1,
        totalPages: 1,
      });
    });
  });

  describe('findOne', () => {
    it('should return a surah by id', async () => {
      const surah: Surah = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
        image: null,
        verses: [],
        reciterSurah: [],
      };

      jest.spyOn(surahRepository, 'findOneBy').mockResolvedValueOnce(surah);

      const result = await surahService.findOne(1);

      expect(surahRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(surah);
    });

    it('should throw NotFoundException if surah is not found', async () => {
      jest.spyOn(surahRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(surahService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateSurahImage', () => {
    it('should update the surah image', async () => {
      const surah: Surah = {
        id: 1,
        name_arabic: 'الفاتحة',
        name_complex: 'Al-Fatiha',
        verses_count: 7,
        revelation_place: 'Meccan',
        image: null,
        verses: [],
        reciterSurah: [],
      };
      const updatedSurah: Surah = {
        ...surah,
        image: 'http://example.com/image.jpg',
      };

      jest.spyOn(surahRepository, 'findOneBy').mockResolvedValueOnce(surah);
      jest.spyOn(surahRepository, 'save').mockResolvedValueOnce(updatedSurah);

      const result = await surahService.updateSurahImage(
        1,
        'http://example.com/image.jpg',
      );

      expect(surahRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(surah.image).toEqual('http://example.com/image.jpg');
      expect(surahRepository.save).toHaveBeenCalledWith(surah);
      expect(result).toEqual(updatedSurah);
    });

    it('should throw NotFoundException if surah is not found', async () => {
      jest.spyOn(surahRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(
        surahService.updateSurahImage(1, 'http://example.com/image.jpg'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('initializeSurah', () => {
    it('should seed surahs if not already seeded', async () => {
      jest.spyOn(surahRepository, 'find').mockResolvedValueOnce([]);
      jest
        .spyOn(surahRepository, 'create')
        .mockImplementation((dto) => dto as Surah);
      jest
        .spyOn(surahRepository, 'save')
        .mockImplementation(async (surah) => surah as Surah);
      const logSpy = jest.spyOn(Logger, 'log');

      await surahService.initializeSurah();

      expect(surahRepository.find).toHaveBeenCalled();
      expect(surahRepository.create).toHaveBeenCalledTimes(1);
      expect(surahRepository.save).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith('Surah Seeder Completed');
    });

    it('should not seed surahs if already seeded', async () => {
      const mockSurahs = Array(114).fill({} as Surah);
      jest.spyOn(surahRepository, 'find').mockResolvedValueOnce(mockSurahs);
      const createSpy = jest.spyOn(surahRepository, 'create');
      const saveSpy = jest.spyOn(surahRepository, 'save');

      await surahService.initializeSurah();

      expect(surahRepository.find).toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
    });
  });
});
