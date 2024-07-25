import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { isURL } from 'class-validator';

describe('Audio E2E TESTS', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get reciter surah audio', () => {
    const surah_id = 1;
    const reciter_id = 1;

    return request(app.getHttpServer())
      .get(`/audio?surah_id=${surah_id}&reciter_id=${reciter_id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.surah_id).toBe(surah_id);
        expect(res.body.reciter_id).toBe(reciter_id);
        expect(isURL(res.body.url)).toBe(true);
      });
  });
});
