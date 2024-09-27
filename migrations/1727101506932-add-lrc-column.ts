import { readFileSync } from 'fs';
import { join } from 'path';
import { MigrationInterface, QueryRunner } from 'typeorm';

const readSqlFile = (filepath: string): string[] => {
  return readFileSync(join(__dirname, filepath))
    .toString()
    .replace(/\r?\n|\r/g, '')
    .split(';')
    .filter((query) => query?.length);
};
export class AddLrcColumn1727101506932 implements MigrationInterface {
  name = 'AddLrcColumn1727101506932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tilawa_surah\` ADD \`lrc_content\` mediumtext NULL`,
    );

    const sqlQueries = readSqlFile('/lrc-seed/lrc-data.sql');
    for (const query of sqlQueries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tilawa_surah\` DROP COLUMN \`lrc_content\``,
    );
  }
}
