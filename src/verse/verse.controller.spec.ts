import { Test, TestingModule } from '@nestjs/testing';
import { VerseController } from './verse.controller';
import { VerseService } from './verse.service';
import { CreateVerseDto } from './dto/create-verse.dto';
import { GetVerseFilterDto } from './dto/filter-get-verse.dto';
import { Verse } from './entities/verse.entity';

describe('VerseController', () => {
  let verseController: VerseController;
  let verseService: VerseService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [VerseController],
      providers: [
        {
          provide: VerseService,
          useValue: {
            create: jest.fn(),
            getSurahVerses: jest.fn(),
          },
        },
      ],
    }).compile();

    verseController = moduleRef.get<VerseController>(VerseController);
    verseService = moduleRef.get<VerseService>(VerseService);
  });

  it('should be defined', () => {
    expect(verseController).toBeDefined();
  });

  describe('create', () => {
    it('should call verseService.create with the correct parameters', async () => {
      const createVerseDto: CreateVerseDto = {
        vers: 'In the name of Allah, the Most Merciful, the Most Compassionate.',
        verse_number: 1,
        vers_lang: 'ar',
        surah_id: 1,
      };
      const createResult: Verse = {
        id: 1,
        ...createVerseDto,
        surah: null,
      };

      jest.spyOn(verseService, 'create').mockResolvedValueOnce(createResult);

      const result = await verseController.create(createVerseDto);

      expect(verseService.create).toHaveBeenCalledWith(createVerseDto);
      expect(result).toEqual(createResult);
    });
  });

  describe('getSurahVerses', () => {
    it('should call verseService.getSurahVerses with the correct parameters', async () => {
      const getVerseFilterDto: GetVerseFilterDto = { surah_id: 1 };
      const verses: Verse[] = [
        { id: 1, vers: 'In the name of Allah, the Most Merciful, the Most Compassionate.', verse_number: 1, vers_lang: 'ar', surah_id: 1, surah: null },
        { id: 2, vers: 'Praise be to Allah, the Lord of all the worlds.', verse_number: 2, vers_lang: 'ar', surah_id: 1, surah: null },
      ];
      const getSurahVersesResult = { verses, totalVerseNumber: verses.length };

      jest.spyOn(verseService, 'getSurahVerses').mockResolvedValueOnce(getSurahVersesResult);

      const result = await verseController.getSurahVerses(getVerseFilterDto);

      expect(verseService.getSurahVerses).toHaveBeenCalledWith(1);
      expect(result).toEqual(getSurahVersesResult);
    });
  });
});
