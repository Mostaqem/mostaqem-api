import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const readSqlFile = (filepath: string): string[] => {
  return readFileSync(join(__dirname, filepath))
    .toString()
    .replace(/\r?\n|\r/g, '')
    .split(';')
    .filter((query) => query?.length);
};
export class Init1721998321064 implements MigrationInterface {
  name = 'Init1721998321064';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`reciter\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name_english\` varchar(100) NOT NULL, \`name_arabic\` varchar(100) NOT NULL, \`image\` varchar(250) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tilawa\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(150) NOT NULL, \`name_english\` varchar(250) NULL, \`reciter_id\` int NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tilawa_surah\` (\`tilawa_id\` int NOT NULL, \`surah_id\` int NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`tilawa_id\`, \`surah_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`surah\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name_arabic\` varchar(100) NOT NULL, \`name_complex\` varchar(100) NOT NULL, \`verses_count\` int NOT NULL, \`revelation_place\` varchar(30) NOT NULL, \`image\` varchar(250) NULL, INDEX \`IDX_SURAH\` (\`id\`, \`name_arabic\`, \`name_complex\`, \`verses_count\`, \`revelation_place\`, \`image\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`verse\` (\`id\` int NOT NULL AUTO_INCREMENT, \`vers\` text NOT NULL, \`verse_number\` int NOT NULL, \`vers_lang\` varchar(3) NOT NULL, \`surah_id\` int NOT NULL, INDEX \`idx_surah_id\` (\`surah_id\`), INDEX \`SURAH_VERSE_UNIQUE\` (\`surah_id\`, \`verse_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tilawa\` ADD CONSTRAINT \`FK_9a5a7daf13f7b0860ccab8175aa\` FOREIGN KEY (\`reciter_id\`) REFERENCES \`reciter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tilawa_surah\` ADD CONSTRAINT \`FK_78ed805e1c59deceb7c792a77e7\` FOREIGN KEY (\`tilawa_id\`) REFERENCES \`tilawa\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`tilawa_surah\` ADD CONSTRAINT \`FK_d3e49763613b99b413d68fb4f68\` FOREIGN KEY (\`surah_id\`) REFERENCES \`surah\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`verse\` ADD CONSTRAINT \`FK_7da0f9ffbbe4ea8116f2f36610a\` FOREIGN KEY (\`surah_id\`) REFERENCES \`surah\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );

    const sqlQueries = readSqlFile('/seed.sql');
    for (const query of sqlQueries) {
      await queryRunner.query(query);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`verse\` DROP FOREIGN KEY \`FK_7da0f9ffbbe4ea8116f2f36610a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tilawa_surah\` DROP FOREIGN KEY \`FK_d3e49763613b99b413d68fb4f68\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tilawa_surah\` DROP FOREIGN KEY \`FK_78ed805e1c59deceb7c792a77e7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tilawa\` DROP FOREIGN KEY \`FK_9a5a7daf13f7b0860ccab8175aa\``,
    );
    await queryRunner.query(`DROP INDEX \`SURAH_VERSE_UNIQUE\` ON \`verse\``);
    await queryRunner.query(`DROP INDEX \`idx_surah_id\` ON \`verse\``);
    await queryRunner.query(`DROP TABLE \`verse\``);
    await queryRunner.query(`DROP INDEX \`IDX_SURAH\` ON \`surah\``);
    await queryRunner.query(`DROP TABLE \`surah\``);
    await queryRunner.query(`DROP TABLE \`tilawa_surah\``);
    await queryRunner.query(`DROP TABLE \`tilawa\``);
    await queryRunner.query(`DROP TABLE \`reciter\``);
  }
}
