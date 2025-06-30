import { Test, TestingModule } from '@nestjs/testing';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { FilterAudioLrcDto } from './dto/filter-lrc.dto';
import { RandomDto } from './dto/random.dto';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('AudioController', () => {
  let controller: AudioController;
  let service: AudioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioController],
      providers: [
        {
          provide: AudioService,
          useValue: {
            create: jest.fn(),
            getAudio: jest.fn(),
            getAudioLrc: jest.fn(),
            getRandomAudio: jest.fn(),
          },
        },
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            reset: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AudioController>(AudioController);
    service = module.get<AudioService>(AudioService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new audio', async () => {
      const createAudioDto: CreateAudioDto = {
        surah_id: 1,
        tilawa_id: 1,
        url: 'https://example.com/audio.mp3',
      };
      const expectedResult: Partial<TilawaSurah> & { reciter_id: number } = {
        surah_id: 1,
        tilawa_id: 1,
        url: 'https://example.com/audio.mp3',
        tilawa: {
          id: 1,
          name: 'Test Tilawa',
          name_english: 'Test Tilawa',
          reciter_id: 1,
          reciter: {},
          tilawaSurah: [],
        } as any,
        surah: {} as any,
        reciter_id: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        ...expectedResult,
        reciter_id: 1,
      } as TilawaSurah & { reciter_id: number });

      const result = await controller.create(createAudioDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createAudioDto);
    });

    it('should handle creation with different URL formats', async () => {
      const createAudioDto: CreateAudioDto = {
        surah_id: 2,
        tilawa_id: 2,
        url: 'https://cdn.example.com/quran/audio/002_001.mp3',
      };
      const expectedResult: Partial<TilawaSurah> & { reciter_id: number } = {
        surah_id: 2,
        tilawa_id: 2,
        url: 'https://cdn.example.com/quran/audio/002_001.mp3',
        tilawa: {
          id: 2,
          name: 'Test Tilawa 2',
          name_english: 'Test Tilawa 2',
          reciter_id: 2,
          reciter: {},
          tilawaSurah: [],
        } as any,
        surah: {} as any,
        reciter_id: 2,
      };

      jest.spyOn(service, 'create').mockResolvedValue({
        ...expectedResult,
        reciter_id: 2,
      } as TilawaSurah & { reciter_id: number });

      const result = await controller.create(createAudioDto);

      expect(result).toEqual(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createAudioDto);
    });

    it('should handle service errors during creation', async () => {
      const createAudioDto: CreateAudioDto = {
        surah_id: 1,
        tilawa_id: 1,
        url: 'https://example.com/audio.mp3',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Creation failed'));

      await expect(controller.create(createAudioDto)).rejects.toThrow(
        'Creation failed',
      );
      expect(service.create).toHaveBeenCalledWith(createAudioDto);
    });
  });

  describe('get', () => {
    it('should get audio by filter', async () => {
      const filterAudioDto: FilterAudioDto = {
        surah_id: 1,
        reciter_id: 1,
      };
      const expectedResult = {
        tilawa_id: 1,
        url: 'https://example',
        surah: {
          name_arabic: 'الفاتحة',
          name_complex: 'Al-Fatiha',
        },
        reciter: {
          name_arabic: 'عبدالرحمن السديس',
          name_english: 'Abdur-Rahman as-Sudais',
        },
      };

      jest.spyOn(service, 'getAudio').mockResolvedValue(expectedResult as any);

      const result = await controller.get(filterAudioDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAudio).toHaveBeenCalledWith(filterAudioDto);
    });

    it('should get audio by filter with tilawa_id', async () => {
      const filterAudioDto: FilterAudioDto = {
        surah_id: 1,
        tilawa_id: 1,
        reciter_id: undefined,
      };
      const expectedResult = {
        tilawa_id: 1,
        url: 'https://example2.com/audio.mp3',
        surah: {
          name_arabic: 'الفاتحة',
          name_complex: 'Al-Fatiha',
        },
        tilawa: {
          reciter: {
            name_arabic: 'عبدالباسط عبدالصمد',
            name_english: 'Abdul Basit Abdul Samad',
          },
        },
      };

      jest.spyOn(service, 'getAudio').mockResolvedValue(expectedResult as any);

      const result = await controller.get(filterAudioDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAudio).toHaveBeenCalledWith(filterAudioDto);
    });

    it('should handle service errors', async () => {
      const filterAudioDto: FilterAudioDto = {
        surah_id: 1,
        reciter_id: undefined,
      };

      jest
        .spyOn(service, 'getAudio')
        .mockRejectedValue(new Error('Service error'));

      await expect(controller.get(filterAudioDto)).rejects.toThrow(
        'Service error',
      );
      expect(service.getAudio).toHaveBeenCalledWith(filterAudioDto);
    });
  });

  describe('getLrc', () => {
    it('should get LRC content for audio', async () => {
      const filterAudioLrcDto: FilterAudioLrcDto = {
        surah_id: 1,
        tilawa_id: 1,
      };
      const expectedResult = {
        lrc_content:
          '[00:00.00] بِسۡمِ/[00:01.04] ٱللَّهِ/[00:01.66] ٱلرَّحۡمَٰنِ/[00:02.61] ٱلرَّحِيمِ',
      };

      jest
        .spyOn(service, 'getAudioLrc')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.getLrc(filterAudioLrcDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAudioLrc).toHaveBeenCalledWith(filterAudioLrcDto);
    });

    it('should handle when no LRC content is found', async () => {
      const filterAudioLrcDto: FilterAudioLrcDto = {
        surah_id: 999,
        tilawa_id: 999,
      };

      jest.spyOn(service, 'getAudioLrc').mockResolvedValue(null);

      const result = await controller.getLrc(filterAudioLrcDto);

      expect(result).toBeNull();
      expect(service.getAudioLrc).toHaveBeenCalledWith(filterAudioLrcDto);
    });

    it('should get LRC content for different surahs', async () => {
      const filterAudioLrcDto: FilterAudioLrcDto = {
        surah_id: 18, // Surah Al-Kahf
        tilawa_id: 1,
      };
      const expectedResult = {
        lrc_content:
          '[00:00.00] ٱلۡحَمۡدُ/[00:01.04] لِلَّهِ/[00:01.66] ٱلَّذِیۤ/[00:02.61] أَنزَلَ',
      };

      jest
        .spyOn(service, 'getAudioLrc')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.getLrc(filterAudioLrcDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAudioLrc).toHaveBeenCalledWith(filterAudioLrcDto);
    });

    it('should handle service errors in getLrc', async () => {
      const filterAudioLrcDto: FilterAudioLrcDto = {
        surah_id: 1,
        tilawa_id: 1,
      };

      jest
        .spyOn(service, 'getAudioLrc')
        .mockRejectedValue(new Error('LRC service error'));

      await expect(controller.getLrc(filterAudioLrcDto)).rejects.toThrow(
        'LRC service error',
      );
      expect(service.getAudioLrc).toHaveBeenCalledWith(filterAudioLrcDto);
    });
  });

  describe('getRandom', () => {
    it('should get random audio with default parameters', async () => {
      const randomDto: RandomDto = {
        limit: 5,
      };
      const expectedResult = [
        {
          tilawa_id: 1,
          url: 'https://example1.com/audio.mp3',
          surah: { name_arabic: 'الفاتحة' },
          reciter: { name_arabic: 'عبدالرحمن السديس' },
        },
        {
          tilawa_id: 2,
          url: 'https://example2.com/audio.mp3',
          surah: { name_arabic: 'البقرة' },
          reciter: { name_arabic: 'عبدالباسط' },
        },
      ];

      jest
        .spyOn(service, 'getRandomAudio')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.getRandom(randomDto);

      expect(result).toEqual(expectedResult);
      expect(service.getRandomAudio).toHaveBeenCalledWith(
        randomDto.limit,
        randomDto.reciter_id,
        randomDto.timeZone,
      );
    });

    it('should get random audio with reciter filter', async () => {
      const randomDto: RandomDto = {
        limit: 3,
        reciter_id: 1,
        timeZone: 'UTC',
      };
      const expectedResult = [
        {
          tilawa_id: 1,
          url: 'https://example1.com/audio.mp3',
          surah: { name_arabic: 'الفاتحة' },
          reciter: { name_arabic: 'عبدالرحمن السديس' },
        },
      ];

      jest
        .spyOn(service, 'getRandomAudio')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.getRandom(randomDto);

      expect(result).toEqual(expectedResult);
      expect(service.getRandomAudio).toHaveBeenCalledWith(
        randomDto.limit,
        randomDto.reciter_id,
        randomDto.timeZone,
      );
    });

    it('should get random audio with Friday special case', async () => {
      const randomDto: RandomDto = {
        limit: 5,
        timeZone: 'UTC',
      };
      const expectedResult = [
        {
          tilawa_id: 1,
          url: 'https://example1.com/audio.mp3',
          surah: { name_arabic: 'الكهف', surah_id: 18 }, // Surah Al-Kahf
          reciter: { name_arabic: 'عبدالرحمن السديس' },
        },
        {
          tilawa_id: 2,
          url: 'https://example2.com/audio.mp3',
          surah: { name_arabic: 'الفاتحة' },
          reciter: { name_arabic: 'عبدالباسط' },
        },
      ];

      jest
        .spyOn(service, 'getRandomAudio')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.getRandom(randomDto);

      expect(result).toEqual(expectedResult);
      expect(service.getRandomAudio).toHaveBeenCalledWith(
        randomDto.limit,
        randomDto.reciter_id,
        randomDto.timeZone,
      );
    });

    it('should handle empty result from service', async () => {
      const randomDto: RandomDto = {
        limit: 5,
      };

      jest.spyOn(service, 'getRandomAudio').mockResolvedValue([]);

      const result = await controller.getRandom(randomDto);

      expect(result).toEqual([]);
      expect(service.getRandomAudio).toHaveBeenCalledWith(
        randomDto.limit,
        randomDto.reciter_id,
        randomDto.timeZone,
      );
    });

    it('should handle service errors in getRandom', async () => {
      const randomDto: RandomDto = {
        limit: 5,
      };

      jest
        .spyOn(service, 'getRandomAudio')
        .mockRejectedValue(new Error('Random audio service error'));

      await expect(controller.getRandom(randomDto)).rejects.toThrow(
        'Random audio service error',
      );
      expect(service.getRandomAudio).toHaveBeenCalledWith(
        randomDto.limit,
        randomDto.reciter_id,
        randomDto.timeZone,
      );
    });

    it('should handle limit boundary cases', async () => {
      const randomDto: RandomDto = {
        limit: 1,
        reciter_id: 1,
      };
      const expectedResult = [
        {
          tilawa_id: 1,
          url: 'https://example1.com/audio.mp3',
          surah: { name_arabic: 'الفاتحة' },
          reciter: { name_arabic: 'عبدالرحمن السديس' },
        },
      ];

      jest
        .spyOn(service, 'getRandomAudio')
        .mockResolvedValue(expectedResult as any);

      const result = await controller.getRandom(randomDto);

      expect(result).toEqual(expectedResult);
      expect(result).toHaveLength(1);
      expect(service.getRandomAudio).toHaveBeenCalledWith(
        randomDto.limit,
        randomDto.reciter_id,
        randomDto.timeZone,
      );
    });
  });
});
