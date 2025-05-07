import { MigrationInterface, QueryRunner } from 'typeorm';

export class $add_bug_report1746622843261 implements MigrationInterface {
  name = ' $add_bug_report1746622843261';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`bug_reports\` (\`id\` char(26) NOT NULL, \`user_id\` char(26) NOT NULL, \`android_version\` int NOT NULL, \`brand\` varchar(100) NOT NULL, \`body\` text NOT NULL, \`image_url\` varchar(255) NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`bug_reports\` ADD CONSTRAINT \`FK_d2be4fe51a0c6ebaa2c4a74c093\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`bug_reports\` DROP FOREIGN KEY \`FK_d2be4fe51a0c6ebaa2c4a74c093\``,
    );
    await queryRunner.query(`DROP TABLE \`bug_reports\``);
  }
}
