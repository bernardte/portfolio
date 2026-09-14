import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRelationshipInContactMessageEntity1789205678977 implements MigrationInterface {
    name = 'AddRelationshipInContactMessageEntity1789205678977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "contact_message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profileId" uuid NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "Subject" character varying NOT NULL, "message" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1476ca9a6265a586f618ea918fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD CONSTRAINT "FK_9a9251f3d3d40dda2161c1488d9" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "contact_message" DROP CONSTRAINT "FK_9a9251f3d3d40dda2161c1488d9"`);
        await queryRunner.query(`DROP TABLE "contact_message"`);
    }

}
