import { Test, TestingModule } from '@nestjs/testing';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { ReciterSurah } from 'src/surah/entities/reciter-surah.entity';

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
        reciter_id: 1,
        url: 'https://example.com/audio.mp3',
      };
      const expectedResult: Partial<ReciterSurah> = {
        ...createAudioDto,
        reciter: { id: 1, name: 'Mock Reciter' } as any,
        surah: { id: 1, name: 'Mock Surah' } as any,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as ReciterSurah);

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
      const expectedResult: Partial<ReciterSurah> = {
        surah_id: 1,
        reciter_id: 1,
        url: 'https://example.com/audio.mp3',
        reciter: { id: 1, name: 'Mock Reciter' } as any,
        surah: { id: 1, name: 'Mock Surah' } as any,
      };

      jest.spyOn(service, 'getAudio').mockResolvedValue(expectedResult as ReciterSurah);

      const result = await controller.get(filterAudioDto);

      expect(result).toEqual(expectedResult);
      expect(service.getAudio).toHaveBeenCalledWith(filterAudioDto);
    });
  });
});