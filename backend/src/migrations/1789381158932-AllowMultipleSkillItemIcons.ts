import { MigrationInterface, QueryRunner } from "typeorm";

export class AllowMultipleSkillItemIcons1789381158932 implements MigrationInterface {
    name = 'AllowMultipleSkillItemIcons1789381158932'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_adfe2f9579825dd374c25b8e30"`);
        await queryRunner.query(`CREATE INDEX "IDX_adfe2f9579825dd374c25b8e30" ON "files"  ("ownerId", "ownerType", "category") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_adfe2f9579825dd374c25b8e30"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_adfe2f9579825dd374c25b8e30" ON "files" USING btree ("category", "ownerId", "ownerType") `);
    }

}
