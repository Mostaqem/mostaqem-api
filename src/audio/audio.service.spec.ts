import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioService } from './audio.service';
import { ReciterSurah } from 'src/surah/entities/reciter-surah.entity';
import { CreateAudioDto } from './dto/create-audio.dto';
import { FilterAudioDto } from './dto/filter-audio.dto';
import { NotFoundException } from '@nestjs/common';

describe('AudioService', () => {
  let service: AudioService;
  let reciterSurahRepo: Repository<ReciterSurah>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AudioService,
        {
          provide: getRepositoryToken(ReciterSurah),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<AudioService>(AudioService);
    reciterSurahRepo = module.get<Repository<ReciterSurah>>(getRepositoryToken(ReciterSurah));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      jest.spyOn(reciterSurahRepo, 'create').mockReturnValue(expectedResult as ReciterSurah);
      jest.spyOn(reciterSurahRepo, 'save').mockResolvedValue(expectedResult as ReciterSurah);

      const result = await service.create(createAudioDto);

      expect(result).toEqual(expectedResult);
      expect(reciterSurahRepo.create).toHaveBeenCalledWith(createAudioDto);
      expect(reciterSurahRepo.save).toHaveBeenCalledWith(expectedResult);
    });
  });

  describe('getAudio', () => {
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

      jest.spyOn(reciterSurahRepo, 'findOne').mockResolvedValue(expectedResult as ReciterSurah);

      const result = await service.getAudio(filterAudioDto);

      expect(result).toEqual(expectedResult);
      expect(reciterSurahRepo.findOne).toHaveBeenCalledWith({
        where: { surah_id: filterAudioDto.surah_id, reciter_id: filterAudioDto.reciter_id },
      });
    });

    it('should throw NotFoundException when audio is not found', async () => {
      const filterAudioDto: FilterAudioDto = {
        surah_id: 1,
        reciter_id: 1,
      };

      jest.spyOn(reciterSurahRepo, 'findOne').mockResolvedValue(null);

      await expect(service.getAudio(filterAudioDto)).rejects.toThrow(NotFoundException);
    });
  });
});