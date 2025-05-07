import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurahModule } from './surah/surah.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { VerseModule } from './verse/verse.module';
import { ReciterModule } from './reciter/reciter.module';
import { AudioModule } from './audio/audio.module';
import { ImageModule } from './image/image.module';
import { SurahService } from './surah/surah.service';
import { VerseService } from './verse/verse.service';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { createKeyv } from '@keyv/redis';
import { FavoritesModule } from './favorites/favorites.module';
import { BugReportModule } from './bug-report/bug-report.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Define upload path in one place to keep it consistent
export const UPLOAD_PATH = join(process.cwd(), 'uploads');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: UPLOAD_PATH,
      serveRoot: '/uploads', // Serve files under the /uploads route
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (configService: ConfigService) => ({
        stores: [
          createKeyv(
            `redis://${configService.getOrThrow('REDIS_HOST')}:${configService.getOrThrow('REDIS_PORT')}`,
          ),
        ],
        ttl: 3.6e6, // 1 hour in milliseconds
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV == 'development',
      connectTimeout: 60000,
      retryDelay: 6000,
    }),
    SurahModule,
    VerseModule,
    ReciterModule,
    AudioModule,
    ImageModule,
    UserModule,
    AuthModule,
    FavoritesModule,
  ],
})
export class AppModule {
  constructor(
    private readonly surahService: SurahService,
    private readonly verseService: VerseService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }

  async onModuleInit() {
    // First initialize surah data
    await this.surahService.initializeSurah();

    // Then initialize verse data after surahs are loaded
    await this.verseService.initialVerses();
  }
}
