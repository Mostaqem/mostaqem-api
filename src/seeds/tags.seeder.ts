import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from 'src/app.module';
import { Tag } from 'src/reciter/entities/tag.entity';

export async function seedTags(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  const tagRepository = dataSource.getRepository(Tag);

  const tags = [
    {
      name_arabic: 'تجويد ممتاز',
      name_english: 'Excellent Tajweed',
      description: 'Reciter with exceptional tajweed rules application',
    },
    {
      name_arabic: 'قارئ مشهور',
      name_english: 'Famous Reciter',
      description: 'Well-known and recognized reciter',
    },
    {
      name_arabic: 'أداء عاطفي',
      name_english: 'Emotional Performance',
      description: 'Reciter with emotionally moving recitation style',
    },
    {
      name_arabic: 'ترتيل هادئ',
      name_english: 'Calm Recitation',
      description: 'Peaceful and slow recitation style',
    },
    {
      name_arabic: 'بطيئ و واضح',
      name_english: 'Slow and Clear',
      description: 'Very clear and slow recitation, good for learning',
    },
    {
      name_arabic: 'شيخ تعليمي',
      name_english: 'Educational Sheikh',
      description: 'Reciter whose style is excellent for learning Quran',
    },
    {
      name_arabic: 'صوت عذب',
      name_english: 'Sweet Voice',
      description: 'Reciter with particularly beautiful and sweet voice',
    },
    {
      name_arabic: 'صوت قوي',
      name_english: 'Strong Voice',
      description: 'Reciter with powerful and strong voice',
    },
    {
      name_arabic: 'امام حرم',
      name_english: 'Imam of Haram',
      description: 'Imam of the Holy Mosques (Mecca or Medina)',
    },
    {
      name_arabic: 'خاشع',
      name_english: 'Humble/Devotional',
      description: 'Recitation style that evokes humility and devotion',
    },
    {
      name_arabic: 'مقامات متنوعة',
      name_english: 'Various Maqams',
      description: 'Uses different musical modes (maqams) in recitation',
    },
    {
      name_arabic: 'قارئ دولي',
      name_english: 'International Reciter',
      description: 'Reciter with international recognition and following',
    },
  ];

  for (const tagData of tags) {
    const existingTag = await tagRepository.findOne({
      where: [
        { name_arabic: tagData.name_arabic },
        { name_english: tagData.name_english },
      ],
    });

    if (!existingTag) {
      const tag = tagRepository.create(tagData);
      await tagRepository.save(tag);
      console.log(
        `✓ Created tag: ${tagData.name_arabic} (${tagData.name_english})`,
      );
    } else {
      console.log(
        `- Tag already exists: ${tagData.name_arabic} (${tagData.name_english})`,
      );
    }
  }
}

seedTags().catch(console.error);
