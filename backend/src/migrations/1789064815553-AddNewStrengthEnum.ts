import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewStrengthEnum1789064815553 implements MigrationInterface {
    name = 'AddNewStrengthEnum1789064815553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_adfe2f9579825dd374c25b8e30"`);
        await queryRunner.query(`ALTER TYPE "public"."files_ownertype_enum" ADD VALUE 'strength'`);
        await queryRunner.query(`ALTER TYPE "public"."files_category_enum" ADD VALUE 'strength_icon'`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_adfe2f9579825dd374c25b8e30" ON "files"  ("ownerId", "ownerType", "category") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_adfe2f9579825dd374c25b8e30"`);
        await queryRunner.query(`CREATE TYPE "public"."files_category_enum_old" AS ENUM('avatar', 'resume', 'project_image', 'skill_category_icon', 'skill_item_icon')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "category" TYPE "public"."files_category_enum_old" USING "category"::"text"::"public"."files_category_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."files_category_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."files_category_enum_old" RENAME TO "files_category_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."files_ownertype_enum_old" AS ENUM('profile', 'project', 'skill_category', 'skill_item')`);
        await queryRunner.query(`ALTER TABLE "files" ALTER COLUMN "ownerType" TYPE "public"."files_ownertype_enum_old" USING "ownerType"::"text"::"public"."files_ownertype_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."files_ownertype_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."files_ownertype_enum_old" RENAME TO "files_ownertype_enum"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_adfe2f9579825dd374c25b8e30" ON "files" USING btree ("category", "ownerId", "ownerType") `);
    }

}
