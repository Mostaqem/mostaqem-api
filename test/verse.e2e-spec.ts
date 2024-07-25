import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Verse E2E TESTS', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should get surah verses', () => {
    return request(app.getHttpServer())
      .get('/verse/surah?surah_id=1')
      .expect(200)
      .expect((res) => {
        expect(res.body.verses).toHaveLength(7);
        expect(res.body.verses[0]).toMatchObject({
          id: 1,
          vers: 'بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ',
          verse_number: 1,
          vers_lang: 'ar',
          surah_id: 1,
        });
      });
  });
});
