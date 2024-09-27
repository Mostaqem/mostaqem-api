import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioService } from './audio.service';
import { TilawaSurah } from 'src/surah/entities/tilawa-surah.entity';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { NotFoundException } from '@nestjs/common';
import { ReciterService } from 'src/reciter/reciter.service';
import { FilterAudioLrcDto } from './dto/filter-lrc.dto';

describe('AudioService', () => {
  let service: AudioService;
  let tilawaSurahRepo: Repository<TilawaSurah>;
  let reciterService: ReciterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioService,
        {
          provide: getRepositoryToken(TilawaSurah),
          useClass: Repository,
        },
        {
          provide: ReciterService,
          useValue: {
            getReciterTilawa: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AudioService>(AudioService);
    tilawaSurahRepo = module.get<Repository<TilawaSurah>>(
      getRepositoryToken(TilawaSurah),
    );
    reciterService = module.get<ReciterService>(ReciterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new audio', async () => {
      const createAudioDto: CreateAudioDto = {
        surah_id: 1,
        tilawa_id: 1,
        url: 'https://example.com/audio.mp3',
      };
      const expectedResult: Partial<TilawaSurah> = {
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
      };

      jest
        .spyOn(tilawaSurahRepo, 'create')
        .mockReturnValue(expectedResult as TilawaSurah);
      jest
        .spyOn(tilawaSurahRepo, 'save')
        .mockResolvedValue(expectedResult as TilawaSurah);

      const result = await service.create(createAudioDto);

      expect(result).toEqual(expectedResult);
      expect(tilawaSurahRepo.create).toHaveBeenCalledWith(createAudioDto);
      expect(tilawaSurahRepo.save).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('getAudio', () => {
    it('should get audio by filter', async () => {
      const filterAudioDto: FilterAudioDto = {
        surah_id: 1,
        reciter_id: 1,
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

      jest.spyOn(reciterService, 'getReciterTilawa').mockResolvedValue([
        {
          id: 1,
          name: 'حفص عن عاصم - مرتل',
          name_english: 'Hafs an Asim - Murattal',
          reciter_id: 1,
          reciter: {} as any,
          tilawaSurah: [] as any[],
        },
      ]);
      jest
        .spyOn(tilawaSurahRepo, 'findOne')
        .mockResolvedValue(expectedResult as TilawaSurah);

      const result = await service.getAudio(filterAudioDto);

      expect(result).toEqual(expectedResult);
      expect(tilawaSurahRepo.findOne).toHaveBeenCalledWith({
        select: ['url', 'surah_id', 'tilawa_id'],
        where: { surah_id: filterAudioDto.surah_id, tilawa_id: 1 },
      });
    });

    it('should throw NotFoundException when audio is not found', async () => {
      const filterAudioDto: FilterAudioDto = {
        surah_id: 1,
        reciter_id: 1,
      };

      jest.spyOn(reciterService, 'getReciterTilawa').mockResolvedValue([
        {
          id: 1,
          name: 'حفص عن عاصم - مرتل',
          name_english: 'Hafs an Asim - Murattal',
          reciter_id: 1,
          reciter: {} as any,
          tilawaSurah: [] as any[],
        },
      ]);

      jest.spyOn(tilawaSurahRepo, 'findOne').mockResolvedValue(null);

      await expect(service.getAudio(filterAudioDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
  describe('getAudioLrc', () => {
    it('should return lrc content for given surah_id and tilawa_id', async () => {
      const filterAudioLrcDto: FilterAudioLrcDto = {
        surah_id: 1,
        tilawa_id: 1,
      };
      const expectedResult = {
        lrc_content: 'some lrc content',
      };

      jest
        .spyOn(tilawaSurahRepo, 'findOne')
        .mockResolvedValue(expectedResult as TilawaSurah);

      const result = await service.getAudioLrc(filterAudioLrcDto);

      expect(result).toEqual(expectedResult);
      expect(tilawaSurahRepo.findOne).toHaveBeenCalledWith({
        select: ['lrc_content'],
        where: {
          surah_id: filterAudioLrcDto.surah_id,
          tilawa_id: filterAudioLrcDto.tilawa_id,
        },
      });
    });

    it('should return null if no lrc content is found', async () => {
      const filterAudioLrcDto: FilterAudioLrcDto = {
        surah_id: 1,
        tilawa_id: 1,
      };

      jest.spyOn(tilawaSurahRepo, 'findOne').mockResolvedValue(null);

      const result = await service.getAudioLrc(filterAudioLrcDto);

      expect(result).toBeNull();
      expect(tilawaSurahRepo.findOne).toHaveBeenCalledWith({
        select: ['lrc_content'],
        where: {
          surah_id: filterAudioLrcDto.surah_id,
          tilawa_id: filterAudioLrcDto.tilawa_id,
        },
      });
    });
  });
});
