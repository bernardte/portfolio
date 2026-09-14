import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeStrengthSortOrderDeferrable1788977503188
  implements MigrationInterface
{
  async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Remove the existing UNIQUE INDEX
    await queryRunner.query(`
      DROP INDEX "UQ_strength_profile_sortOrder"
    `);

    // 2. Create a DEFERRABLE UNIQUE CONSTRAINT
    await queryRunner.query(`
      ALTER TABLE "strength"
      ADD CONSTRAINT "UQ_strength_profile_sortOrder"
      UNIQUE ("profileId", "sortOrder")
      DEFERRABLE INITIALLY DEFERRED
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Remove the UNIQUE CONSTRAINT
    await queryRunner.query(`
      ALTER TABLE "strength"
      DROP CONSTRAINT "UQ_strength_profile_sortOrder"
    `);

    // 2. Restore the original UNIQUE INDEX
    await queryRunner.query(`
      CREATE UNIQUE INDEX "UQ_strength_profile_sortOrder"
      ON "strength" ("profileId", "sortOrder")
    `);
  }
}
