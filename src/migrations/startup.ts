import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateDatabase implements MigrationInterface {

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP DATABASE "identity"`);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE DATABASE "identity"`); 
    }
}