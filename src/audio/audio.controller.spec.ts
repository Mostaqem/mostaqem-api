import { Test, TestingModule } from '@nestjs/testing';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';

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
          },
        },
      ],
    }).compile();

    controller = module.get<AudioController>(AudioController);
    service = module.get<AudioService>(AudioService);
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
  });
});
