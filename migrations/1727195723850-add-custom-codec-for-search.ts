import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * This migration is to add custom codec for search
 * in the database for Arabic language see this link for more info
 *  https://shorturl.at/4rnrf
 */
export class AddCustomCodecForSearch1727195723850
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE reciter MODIFY name_arabic VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_arabic_ci;`,
    );

    queryRunner.query(
      `ALTER TABLE verse MODIFY vers TEXT CHARACTER SET utf8 COLLATE utf8_arabic_ci;`,
    );

    queryRunner.query(
      `ALTER TABLE surah MODIFY name_arabic VARCHAR(100) CHARACTER SET utf8 COLLATE utf8_arabic_ci;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
