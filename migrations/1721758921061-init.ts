import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1721758921061 implements MigrationInterface {
    name = 'Init1721758921061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`reciter\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name_english\` varchar(100) NOT NULL, \`name_arabic\` varchar(100) NOT NULL, \`image\` varchar(250) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`reciter_surah\` (\`reciter_id\` int NOT NULL, \`surah_id\` int NOT NULL, \`url\` varchar(255) NOT NULL, PRIMARY KEY (\`reciter_id\`, \`surah_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`surah\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name_arabic\` varchar(100) NOT NULL, \`name_complex\` varchar(100) NOT NULL, \`verses_count\` int NOT NULL, \`revelation_place\` varchar(30) NOT NULL, \`image\` varchar(250) NULL, INDEX \`IDX_SURAH\` (\`id\`, \`name_arabic\`, \`name_complex\`, \`verses_count\`, \`revelation_place\`, \`image\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`verse\` (\`id\` int NOT NULL AUTO_INCREMENT, \`vers\` text NOT NULL, \`verse_number\` int NOT NULL, \`vers_lang\` varchar(3) NOT NULL, \`surah_id\` int NOT NULL, INDEX \`idx_surah_id\` (\`surah_id\`), INDEX \`SURAH_VERSE_UNIQUE\` (\`surah_id\`, \`verse_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reciter_surah\` ADD CONSTRAINT \`FK_c083c2e64bff5563b0940b6ae9a\` FOREIGN KEY (\`reciter_id\`) REFERENCES \`reciter\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`reciter_surah\` ADD CONSTRAINT \`FK_faeb6bf0be06de7f316921c0068\` FOREIGN KEY (\`surah_id\`) REFERENCES \`surah\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`verse\` ADD CONSTRAINT \`FK_7da0f9ffbbe4ea8116f2f36610a\` FOREIGN KEY (\`surah_id\`) REFERENCES \`surah\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`verse\` DROP FOREIGN KEY \`FK_7da0f9ffbbe4ea8116f2f36610a\``);
        await queryRunner.query(`ALTER TABLE \`reciter_surah\` DROP FOREIGN KEY \`FK_faeb6bf0be06de7f316921c0068\``);
        await queryRunner.query(`ALTER TABLE \`reciter_surah\` DROP FOREIGN KEY \`FK_c083c2e64bff5563b0940b6ae9a\``);
        await queryRunner.query(`DROP INDEX \`SURAH_VERSE_UNIQUE\` ON \`verse\``);
        await queryRunner.query(`DROP INDEX \`idx_surah_id\` ON \`verse\``);
        await queryRunner.query(`DROP TABLE \`verse\``);
        await queryRunner.query(`DROP INDEX \`IDX_SURAH\` ON \`surah\``);
        await queryRunner.query(`DROP TABLE \`surah\``);
        await queryRunner.query(`DROP TABLE \`reciter_surah\``);
        await queryRunner.query(`DROP TABLE \`reciter\``);
    }

}
