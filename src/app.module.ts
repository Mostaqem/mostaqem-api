import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SurahModule } from './surah/surah.module';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { VerseModule } from './verse/verse.module';
import { ReciterModule } from './reciter/reciter.module';
import { AudioModule } from './audio/audio.module';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
      connectTimeout: 60000,
      retryDelay: 6000,
    }),
    SurahModule,
    VerseModule,
    ReciterModule,
    AudioModule,
    ImageModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
