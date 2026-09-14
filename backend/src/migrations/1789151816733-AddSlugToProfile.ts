import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSlugToProfile1789151816733 implements MigrationInterface {
    name = 'AddSlugToProfile1789151816733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strength" DROP CONSTRAINT "UQ_strength_profile_sortOrder"`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD "slug" character varying`);
        await queryRunner.query(`CREATE INDEX "UQ_strength_profile_sortOrder" ON "strength"  ("profileId", "sortOrder") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_strength_profile_sortOrder"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "strength" ADD CONSTRAINT "UQ_strength_profile_sortOrder" UNIQUE ("sortOrder", "profileId")`);
    }

}
