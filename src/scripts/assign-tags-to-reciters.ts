import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';

import { AppModule } from 'src/app.module';
import { Reciter } from 'src/reciter/entities/reciter.entity';
import { Tag } from 'src/reciter/entities/tag.entity';

/**
 * Script: assign-tags-to-reciters.ts
 * Enhancements:
 * - Preserves existing tags and only adds missing ones (idempotent)
 * - Resolves tags by Arabic or English name (case-insensitive)
 * - Skips missing tags but logs them
 * - Supports --dry-run and --limit=<n> CLI flags
 */

type AssignmentMap = Record<number, string[]>;

const reciterTagAssignments: AssignmentMap = {
  1: ['تجويد ممتاز', 'قارئ مشهور', 'أداء عاطفي'],
  2: ['تجويد ممتاز', 'قارئ مشهور', 'ترتيل هادئ'],
  5: ['بطيئ و واضح', 'تجويد ممتاز', 'شيخ تعليمي', 'قارئ مشهور'],
  9: ['صوت عذب', 'تجويد ممتاز', 'قارئ مشهور', 'أداء عاطفي'],
  68: ['تجويد ممتاز', 'قارئ مشهور', 'صوت قوي'],
  69: ['تجويد ممتاز', 'قارئ مشهور', 'أداء عاطفي'],
  3: ['امام حرم', 'خاشع', 'قارئ مشهور'],
  6: ['امام حرم', 'خاشع', 'ترتيل هادئ', 'قارئ مشهور'],
  13: ['امام حرم', 'خاشع', 'ترتيل هادئ', 'قارئ مشهور'],
  4: ['صوت عذب', 'قارئ مشهور', 'مقامات متنوعة', 'قارئ دولي'],
  12: ['صوت عذب', 'قارئ مشهور', 'ترتيل هادئ'],
  14: ['صوت قوي', 'قارئ مشهور', 'أداء عاطفي'],
  15: ['صوت عذب', 'قارئ مشهور', 'ترتيل هادئ'],
  21: ['صوت عذب', 'قارئ مشهور', 'خاشع'],
  26: ['صوت عذب', 'قارئ مشهور', 'خاشع'],
  27: ['صوت قوي', 'قارئ مشهور', 'أداء عاطفي'],
  29: ['صوت عذب', 'قارئ مشهور', 'خاشع'],
  7: ['صوت عذب', 'قارئ مشهور', 'ترتيل هادئ'],
  18: ['تجويد ممتاز', 'قارئ مشهور', 'خاشع'],
  23: ['صوت عذب', 'قارئ مشهور', 'مقامات متنوعة'],
  46: ['صوت عذب', 'قارئ مشهور', 'أداء عاطفي'],
};

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: { dryRun: boolean; limit?: number } = { dryRun: false };
  for (const arg of args) {
    if (arg === '--dry-run') opts.dryRun = true;
    else if (arg.startsWith('--limit=')) {
      const v = Number(arg.split('=')[1]);
      if (!Number.isNaN(v) && v > 0) opts.limit = v;
    }
  }
  return opts;
}

async function assignTagsToReciters() {
  const { dryRun, limit } = parseArgs();

  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  const reciterRepository = dataSource.getRepository(Reciter);
  const tagRepository = dataSource.getRepository(Tag);

  // Fetch all tags once and build case-insensitive lookups
  const tags = await tagRepository.find();
  const tagByArabic = new Map(
    tags.map((t) => [t.name_arabic.toLowerCase(), t]),
  );
  const tagByEnglish = new Map(
    tags.map((t) => [t.name_english.toLowerCase(), t]),
  );

  // Fetch reciters with tags relation; allow optional limit
  const reciters = await reciterRepository.find({
    relations: ['tags'],
    take: limit,
  });

  let processed = 0;
  const summary = {
    updated: 0,
    skipped: 0,
    missingTags: new Map<string, number>(),
  } as {
    updated: number;
    skipped: number;
    missingTags: Map<string, number>;
  };

  for (const reciter of reciters) {
    if (limit && processed >= limit) break;
    processed += 1;

    const wantedTagNames = reciterTagAssignments[reciter.id] || [];
    if (wantedTagNames.length === 0) {
      summary.skipped += 1;
      console.log(
        `No assignments configured for ${reciter.name_english} (id=${reciter.id}), skipping.`,
      );
      continue;
    }

    // existing tag ids for quick check
    const existingTagIds = new Set((reciter.tags || []).map((t) => t.id));

    const tagsToAdd: Tag[] = [];
    for (const tagName of wantedTagNames) {
      const key = tagName.toLowerCase();
      const tag = tagByArabic.get(key) || tagByEnglish.get(key);
      if (!tag) {
        summary.missingTags.set(
          tagName,
          (summary.missingTags.get(tagName) || 0) + 1,
        );
        console.warn(
          `Tag not found for name '${tagName}' (reciter id=${reciter.id}).`,
        );
        continue;
      }
      if (!existingTagIds.has(tag.id)) {
        tagsToAdd.push(tag);
      }
    }

    if (tagsToAdd.length === 0) {
      console.log(
        `No new tags to add for ${reciter.name_english} (id=${reciter.id}).`,
      );
      summary.skipped += 1;
      continue;
    }

    console.log(
      `Adding ${tagsToAdd.length} tag(s) to ${reciter.name_english} (id=${reciter.id}):`,
      tagsToAdd.map((t) => t.name_arabic || t.name_english),
    );

    if (!dryRun) {
      // append new tags to existing ones and save
      reciter.tags = [...(reciter.tags || []), ...tagsToAdd];
      await reciterRepository.save(reciter);
      summary.updated += 1;
    }
  }

  console.log('\nAssignment run complete. Summary:');
  console.log(`Processed: ${processed}`);
  console.log(`Updated: ${summary.updated}`);
  console.log(`Skipped (no changes or not configured): ${summary.skipped}`);
  if (summary.missingTags.size > 0) {
    console.log('Missing tags encountered:');
    for (const [name, count] of summary.missingTags.entries()) {
      console.log(`  ${name}: ${count}`);
    }
  }

  if (dryRun)
    console.log('\nDry-run enabled: no database changes were written.');

  await app.close();
}

assignTagsToReciters().catch((err) => {
  console.error('Error running assign-tags-to-reciters script:', err);
  process.exit(1);
});
