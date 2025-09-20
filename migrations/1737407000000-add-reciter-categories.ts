import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddReciterCategories1737407000000 implements MigrationInterface {
  name = 'AddReciterCategories1737407000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'reciter',
      new TableColumn({
        name: 'category',
        type: 'enum',
        enum: ['modern', 'classic'],
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'reciter',
      new TableColumn({
        name: 'region',
        type: 'enum',
        enum: ['egypt', 'saudi', 'gulf', 'maghreb', 'levant', 'other'],
        isNullable: true,
        default: null,
      }),
    );

    await queryRunner.addColumn(
      'reciter',
      new TableColumn({
        name: 'is_featured',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('reciter', 'is_featured');
    await queryRunner.dropColumn('reciter', 'region');
    await queryRunner.dropColumn('reciter', 'category');
  }
}
