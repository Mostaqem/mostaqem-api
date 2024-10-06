import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VerseService } from './verse.service';
import { Verse } from './entities/verse.entity';
import { CreateVerseDto } from './dto/create-verse.dto';
import { Repository } from 'typeorm';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { GetVerseFilterDto } from './dto/filter-get-verse.dto';

jest.mock('../../quran.json', () => [
  {
    id: 1,
    verses: [
      {
        id: 1,
        text: 'In the name of Allah, the Most Merciful, the Most Compassionate.',
      },
      { id: 2, text: 'Praise be to Allah, the Lord of all the worlds.' },
    ],
  },
]);

describe('VerseService', () => {
  let verseService: VerseService;
  let verseRepository: Repository<Verse>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VerseService,
        {
          provide: getRepositoryToken(Verse),
          useClass: Repository,
        },
      ],
    }).compile();

    verseService = module.get<VerseService>(VerseService);
    verseRepository = module.get<Repository<Verse>>(getRepositoryToken(Verse));
  });

  describe('create', () => {
    it('should create a verse', async () => {
      const createVerseDto: CreateVerseDto = {
        vers: 'verse',
        verse_number: 1,
        vers_lang: 'eng',
        surah_id: 1,
      };

      const createSpy = jest
        .spyOn(verseRepository, 'create')
        .mockReturnValue(createVerseDto as unknown as Verse);

      const saveSpy = jest
        .spyOn(verseRepository, 'save')
        .mockResolvedValueOnce({} as Verse);

      const result = await verseService.create(createVerseDto);

      expect(createSpy).toHaveBeenCalledWith(createVerseDto);
      expect(saveSpy).toHaveBeenCalledWith(createVerseDto);
      expect(result).toEqual({} as Verse);
    });

    it('should throw an InternalServerErrorException if save fails', async () => {
      const createVerseDto: CreateVerseDto = {
        vers: 'verse',
        verse_number: 1,
        vers_lang: 'eng',
        surah_id: 1,
      };

      jest
        .spyOn(verseRepository, 'create')
        .mockReturnValue(createVerseDto as unknown as Verse);

      jest
        .spyOn(verseRepository, 'save')
        .mockRejectedValueOnce(new InternalServerErrorException());

      await expect(verseService.create(createVerseDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getVerse', () => {
    const getVerseFilterDto: GetVerseFilterDto = {
      surah_id: 1,
      name: 'Allah',
      page: 1,
      take: 10,
    };

    const verses: Verse[] = [
      {
        id: 1,
        vers: 'In the name of Allah, the Most Merciful, the Most Compassionate.',
        verse_number: 1,
        vers_lang: 'ar',
        surah_id: 1,
      } as Verse,
    ];

    const queryBuilderMock = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue(verses),
      getCount: jest.fn().mockResolvedValue(1),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
    };

    it('should return filtered verses with pagination', async () => {
      const queryBuilderMock = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(verses),
        getCount: jest.fn().mockResolvedValue(1),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
      };

      jest
        .spyOn(verseRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await verseService.getVerse(getVerseFilterDto);

      expect(queryBuilderMock.where).toHaveBeenCalledWith('1 = 1');
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'verse.surah_id = :surah_id',
        { surah_id: 1 },
      );
      expect(queryBuilderMock.andWhere).toHaveBeenCalledWith(
        'MATCH(verse.vers) AGAINST(:name IN NATURAL LANGUAGE MODE)',
        { name: 'Allah' },
      );
      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.getMany).toHaveBeenCalled();
      expect(queryBuilderMock.getCount).toHaveBeenCalled();

      expect(result).toEqual({
        verses,
        totalData: 1,
        totalPages: 1,
      });
    });

    it('should return all verses if no filters are provided', async () => {
      const basicFilterDto: GetVerseFilterDto = {
        page: 1,
        take: 10,
      };

      jest
        .spyOn(verseRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilderMock as any);

      const result = await verseService.getVerse(basicFilterDto);

      expect(queryBuilderMock.where).toHaveBeenCalledWith('1 = 1');
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalledWith(
        'verse.surah_id = :surah_id',
        expect.anything(),
      );
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalledWith(
        'MATCH(verse.vers) AGAINST(:name IN NATURAL LANGUAGE MODE)',
        expect.anything(),
      );

      expect(queryBuilderMock.skip).toHaveBeenCalledWith(0);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(10);
      expect(queryBuilderMock.getMany).toHaveBeenCalled();
      expect(queryBuilderMock.getCount).toHaveBeenCalled();

      expect(result).toEqual({
        verses,
        totalData: 1,
        totalPages: 1,
      });
    });
  });

  describe('initialVerses', () => {
    it('should seed verses if verses table is empty', async () => {
      const verses: Verse[] = [];
      const findSpy = jest
        .spyOn(verseRepository, 'find')
        .mockResolvedValueOnce(verses);
      const createSpy = jest
        .spyOn(verseRepository, 'create')
        .mockResolvedValue({
          id: 1,
          vers: 'verse',
          verse_number: 1,
          vers_lang: 'eng',
          surah_id: 1,
        } as never);

      const saveSpy = jest
        .spyOn(verseRepository, 'save')
        .mockResolvedValue({} as never);
      const logSpy = jest
        .spyOn(Logger, 'log')
        .mockResolvedValueOnce('Verse Seeder Completed' as never);

      await verseService.initialVerses();

      expect(findSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalledTimes(2);
      expect(saveSpy).toHaveBeenCalledTimes(2);
      expect(logSpy).toHaveBeenCalledWith('Verse Seeder Completed');
    });

    it('should not seed verses if verses table is not empty', async () => {
      const verses: Verse[] = [
        {
          id: 1,
          vers: 'verse',
          verse_number: 1,
          vers_lang: 'eng',
          surah_id: 1,
        } as Verse,
      ];

      const createSpy = jest.spyOn(verseRepository, 'create');
      const saveSpy = jest.spyOn(verseRepository, 'save');
      // const logSpy = jest.spyOn(Logger, 'log');
      const findSpy = jest
        .spyOn(verseRepository, 'find')
        .mockResolvedValueOnce(verses as any);

      await verseService.initialVerses();

      expect(findSpy).toHaveBeenCalled();
      expect(createSpy).not.toHaveBeenCalled();
      expect(saveSpy).not.toHaveBeenCalled();
      // expect(logSpy).not.toHaveBeenCalled();
    });
  });
});
