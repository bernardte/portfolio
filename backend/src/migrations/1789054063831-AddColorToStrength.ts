import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColorToStrength1789054063831 implements MigrationInterface {
    name = 'AddColorToStrength1789054063831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_projects_userId_sortOrder"`);
        await queryRunner.query(`ALTER TABLE "strength" ADD "color" character varying`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_strength_profile_sortOrder" ON "strength"  ("profileId", "sortOrder") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_strength_profile_sortOrder"`);
        await queryRunner.query(`ALTER TABLE "strength" DROP COLUMN "color"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_projects_userId_sortOrder" UNIQUE ("userId", "sortOrder")`);
    }

}
