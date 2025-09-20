import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import {
  Reciter,
  ReciterCategory,
  ReciterRegion,
} from '../reciter/entities/reciter.entity';

import dataSource from '../../typeorm.config';

config({ path: '.env' });

interface CategorizedReciter {
  id: number;
  name_arabic: string;
  name_english: string;
  category: string;
  region: string;
  is_featured: boolean;
}

interface CategorizedData {
  reciters: CategorizedReciter[];
  statistics: any;
  metadata: any;
}

async function importCategorizedReciters() {
  try {
    console.log('📖 Reading categorized data...');
    const dataPath = path.join(__dirname, 'data', 'reciters-categorized.json');

    if (!fs.existsSync(dataPath)) {
      console.error('❌ File not found:', dataPath);
      console.log('Please ensure data/reciters-categorized.json exists');
      process.exit(1);
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data: CategorizedData = JSON.parse(rawData);

    console.log(`✅ Loaded ${data.reciters.length} categorized reciters`);
    console.log('\n📊 Statistics:');
    console.log(`  Modern: ${data.statistics.byCategory.modern}`);
    console.log(`  Classic: ${data.statistics.byCategory.classic}`);
    console.log('\n  By Region:');
    Object.entries(data.statistics.byRegion).forEach(([region, count]) => {
      console.log(`    ${region}: ${count}`);
    });
    console.log(`\n  Featured: ${data.statistics.featured}`);

    console.log('\n🔌 Connecting to database...');
    await dataSource.initialize();

    const reciterRepository = dataSource.getRepository(Reciter);

    console.log('\n🔄 Updating reciters in database...');

    let updatedCount = 0;
    let errorCount = 0;
    const errors: { id: number; name: string; error: string }[] = [];

    for (const reciterData of data.reciters) {
      try {
        const reciter = await reciterRepository.findOne({
          where: { id: reciterData.id },
        });

        if (!reciter) {
          console.warn(
            `⚠️  Reciter with ID ${reciterData.id} not found in database`,
          );
          errors.push({
            id: reciterData.id,
            name: reciterData.name_arabic,
            error: 'Not found in database',
          });
          errorCount++;
          continue;
        }

        const validCategory = Object.values(ReciterCategory).includes(
          reciterData.category as ReciterCategory,
        );
        const validRegion = Object.values(ReciterRegion).includes(
          reciterData.region as ReciterRegion,
        );

        if (!validCategory) {
          console.warn(
            `⚠️  Invalid category '${reciterData.category}' for reciter ${reciterData.name_arabic}`,
          );
          errors.push({
            id: reciterData.id,
            name: reciterData.name_arabic,
            error: `Invalid category: ${reciterData.category}`,
          });
          errorCount++;
          continue;
        }

        if (!validRegion) {
          console.warn(
            `⚠️  Invalid region '${reciterData.region}' for reciter ${reciterData.name_arabic}`,
          );
          errors.push({
            id: reciterData.id,
            name: reciterData.name_arabic,
            error: `Invalid region: ${reciterData.region}`,
          });
          errorCount++;
          continue;
        }

        reciter.category = reciterData.category as ReciterCategory;
        reciter.region = reciterData.region as ReciterRegion;
        reciter.is_featured = reciterData.is_featured;

        await reciterRepository.save(reciter);
        updatedCount++;

        if (updatedCount % 10 === 0) {
          process.stdout.write(
            `\r  Updated: ${updatedCount}/${data.reciters.length}`,
          );
        }
      } catch (error) {
        console.error(
          `\n❌ Error updating reciter ${reciterData.name_arabic}:`,
          error,
        );
        errors.push({
          id: reciterData.id,
          name: reciterData.name_arabic,
          error: String(error),
        });
        errorCount++;
      }
    }

    console.log(`\n\n✅ Successfully updated ${updatedCount} reciters`);

    if (errorCount > 0) {
      console.log(`\n⚠️  ${errorCount} errors occurred:`);
      errors.forEach((err) => {
        console.log(`  - ID ${err.id} (${err.name}): ${err.error}`);
      });
    }

    console.log('\n🔍 Verifying update...');
    const verifyQuery = `
      SELECT
        COUNT(*) as total,
        COUNT(category) as categorized,
        COUNT(region) as with_region,
        SUM(is_featured) as featured
      FROM reciter
    `;

    const [verification] = await dataSource.query(verifyQuery);
    console.log('  Database state:');
    console.log(`    Total reciters: ${verification.total}`);
    console.log(`    Categorized: ${verification.categorized}`);
    console.log(`    With region: ${verification.with_region}`);
    console.log(`    Featured: ${verification.featured}`);

    await dataSource.destroy();
    console.log('\n✨ Import complete!');

    if (errorCount === 0) {
      console.log('All reciters were successfully categorized! 🎉');
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

importCategorizedReciters();
