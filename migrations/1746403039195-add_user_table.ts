import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1746403039195 implements MigrationInterface {
    name = ' $npmConfigName1746403039195'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_76ec5849d3ae5b1ef6132e1180\` ON \`surah\``);
        await queryRunner.query(`DROP INDEX \`IDX_cc5ce0f1ed88f71d58cc758673\` ON \`surah\``);
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` char(26) NOT NULL, \`name\` varchar(50) NOT NULL, \`email\` varchar(100) NOT NULL, \`deleatedAt\` datetime(6) NULL, UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`reciter\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) NOT NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_SURAH\` ON \`surah\``);
        await queryRunner.query(`ALTER TABLE \`surah\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`verse\` CHANGE \`vers\` \`vers\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reciter\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`surah\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`verse\` CHANGE \`vers\` \`vers\` text NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_SURAH\` ON \`surah\` (\`id\`, \`name_arabic\`, \`name_complex\`, \`verses_count\`, \`revelation_place\`, \`image\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_SURAH\` ON \`surah\``);
        await queryRunner.query(`ALTER TABLE \`verse\` CHANGE \`vers\` \`vers\` text CHARACTER SET "utf8mb3" COLLATE "utf8_arabic_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`surah\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) CHARACTER SET "utf8mb3" COLLATE "utf8_arabic_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`reciter\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) CHARACTER SET "utf8mb3" COLLATE "utf8_arabic_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`verse\` CHANGE \`vers\` \`vers\` text CHARACTER SET "utf8mb3" COLLATE "utf8_arabic_ci" NULL`);
        await queryRunner.query(`ALTER TABLE \`surah\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) CHARACTER SET "utf8mb3" COLLATE "utf8_arabic_ci" NULL`);
        await queryRunner.query(`CREATE INDEX \`IDX_SURAH\` ON \`surah\` (\`id\`, \`name_arabic\`, \`name_complex\`, \`verses_count\`, \`revelation_place\`, \`image\`)`);
        await queryRunner.query(`ALTER TABLE \`reciter\` CHANGE \`name_arabic\` \`name_arabic\` varchar(100) CHARACTER SET "utf8mb3" COLLATE "utf8_arabic_ci" NULL`);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_cc5ce0f1ed88f71d58cc758673\` ON \`surah\` (\`name_complex\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_76ec5849d3ae5b1ef6132e1180\` ON \`surah\` (\`name_arabic\`)`);
    }

}
