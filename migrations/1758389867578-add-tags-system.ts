import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTagsSystem1758389867578 implements MigrationInterface {
  name = 'AddTagsSystem1758389867578';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`tag\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name_arabic\` varchar(100) NOT NULL, \`name_english\` varchar(100) NOT NULL, \`description\` text NULL, UNIQUE INDEX \`IDX_0cef9a995095dd29c384aedf5f\` (\`name_arabic\`), UNIQUE INDEX \`IDX_d29fda6c83edf269df64528682\` (\`name_english\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`reciter_tags\` (\`reciter_id\` int NOT NULL, \`tag_id\` int NOT NULL, INDEX \`IDX_d1fc45a29237ebfc17dd914445\` (\`reciter_id\`), INDEX \`IDX_e3253732292020a76bbb13e8b3\` (\`tag_id\`), PRIMARY KEY (\`reciter_id\`, \`tag_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reciter_tags\` ADD CONSTRAINT \`FK_d1fc45a29237ebfc17dd9144456\` FOREIGN KEY (\`reciter_id\`) REFERENCES \`reciter\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`reciter_tags\` ADD CONSTRAINT \`FK_e3253732292020a76bbb13e8b37\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tag\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`reciter_tags\` DROP FOREIGN KEY \`FK_e3253732292020a76bbb13e8b37\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`reciter_tags\` DROP FOREIGN KEY \`FK_d1fc45a29237ebfc17dd9144456\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e3253732292020a76bbb13e8b3\` ON \`reciter_tags\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_d1fc45a29237ebfc17dd914445\` ON \`reciter_tags\``,
    );
    await queryRunner.query(`DROP TABLE \`reciter_tags\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_d29fda6c83edf269df64528682\` ON \`tag\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0cef9a995095dd29c384aedf5f\` ON \`tag\``,
    );
    await queryRunner.query(`DROP TABLE \`tag\``);
  }
}
