import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameSubjectUppercaseToLowercase1789210729059 implements MigrationInterface {
    name = 'RenameSubjectUppercaseToLowercase1789210729059'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" RENAME COLUMN "Subject" TO "subject"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" RENAME COLUMN "subject" TO "Subject"`);
    }

}
