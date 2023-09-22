import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderAndProduct1695140669357 implements MigrationInterface {
    name = 'CreateOrderAndProduct1695140669357'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_id\` int NOT NULL, \`status\` varchar(255) NULL, \`shipping_status\` varchar(255) NULL, \`total_money\` int NOT NULL, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`order-product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`order_id\` int NOT NULL, \`product_id\` int NOT NULL, \`amount\` int NOT NULL, \`price\` int NOT NULL, \`created_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`cart\` ADD \`status\` int NOT NULL DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cart\` DROP COLUMN \`status\``);
        await queryRunner.query(`DROP TABLE \`order-product\``);
        await queryRunner.query(`DROP TABLE \`order\``);
    }

}
