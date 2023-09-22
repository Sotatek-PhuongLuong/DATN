import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProduct1694876353209 implements MigrationInterface {
    name = 'UpdateProduct1694876353209'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`type\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`type\``);
    }

}
