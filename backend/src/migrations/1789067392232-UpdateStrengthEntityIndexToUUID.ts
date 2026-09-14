import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStrengthEntityIndexToUUID1789067392232 implements MigrationInterface {
    name = 'UpdateStrengthEntityIndexToUUID1789067392232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strength" DROP CONSTRAINT "PK_79a538e6dff53c7ac6885abedb8"`);
        await queryRunner.query(`ALTER TABLE "strength" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "strength" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "strength" ADD CONSTRAINT "PK_79a538e6dff53c7ac6885abedb8" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "strength" DROP CONSTRAINT "PK_79a538e6dff53c7ac6885abedb8"`);
        await queryRunner.query(`ALTER TABLE "strength" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "strength" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "strength" ADD CONSTRAINT "PK_79a538e6dff53c7ac6885abedb8" PRIMARY KEY ("id")`);
    }

}
