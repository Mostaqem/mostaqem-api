import { MigrationInterface, QueryRunner } from "typeorm";

export class  $npmConfigName1746536993480 implements MigrationInterface {
    name = ' $npmConfigName1746536993480'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`favorites\` (\`id\` varchar(26) NOT NULL, \`tilawa_id\` int NOT NULL, \`surah_id\` int NOT NULL, \`user_id\` char(26) NOT NULL, UNIQUE INDEX \`IDX_9e357771a79b6c3e2183db4159\` (\`tilawa_id\`, \`surah_id\`, \`user_id\`), UNIQUE INDEX \`REL_ff2ecaf35fe22708bbc18bb904\` (\`tilawa_id\`, \`surah_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deleatedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`default_reciter_id\` int NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`default_tilawa_id\` int NOT NULL DEFAULT '178'`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deletedAt\` datetime(6) NULL`);
        await queryRunner.query(`ALTER TABLE \`favorites\` ADD CONSTRAINT \`FK_35a6b05ee3b624d0de01ee50593\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`favorites\` ADD CONSTRAINT \`FK_ff2ecaf35fe22708bbc18bb9049\` FOREIGN KEY (\`tilawa_id\`, \`surah_id\`) REFERENCES \`tilawa_surah\`(\`tilawa_id\`,\`surah_id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`favorites\` DROP FOREIGN KEY \`FK_ff2ecaf35fe22708bbc18bb9049\``);
        await queryRunner.query(`ALTER TABLE \`favorites\` DROP FOREIGN KEY \`FK_35a6b05ee3b624d0de01ee50593\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`deletedAt\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`default_tilawa_id\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`default_reciter_id\``);
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`deleatedAt\` datetime(6) NULL`);
        await queryRunner.query(`DROP INDEX \`REL_ff2ecaf35fe22708bbc18bb904\` ON \`favorites\``);
        await queryRunner.query(`DROP INDEX \`IDX_9e357771a79b6c3e2183db4159\` ON \`favorites\``);
        await queryRunner.query(`DROP TABLE \`favorites\``);
    }

}
