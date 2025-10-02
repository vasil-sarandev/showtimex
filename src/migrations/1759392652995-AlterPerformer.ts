import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterPerformer1759392652995 implements MigrationInterface {
  name = 'AlterPerformer1759392652995';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ADD COLUMN "label" and backfill
    await queryRunner.query(`ALTER TABLE "performer" ADD "label" character varying`);
    await queryRunner.query(`UPDATE "performer" SET "label" = 'Independent' WHERE "label" IS NULL`);
    // ---
    // DROPPED Constraint in "Name column"
    await queryRunner.query(
      `ALTER TABLE "performer" DROP CONSTRAINT "UQ_53ab0a09ca150e7ba97765df745"`,
    );
    // temp column to copy the column data
    await queryRunner.query(`ALTER TABLE "performer" ADD "name_temp" character varying`);
    // copy the values
    await queryRunner.query(`UPDATE "performer" SET "name_temp" = "name"`);
    // can safely drop column now
    await queryRunner.query(`ALTER TABLE "performer" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "performer" ADD "name" character varying`);
    // copy the temp values into the new column
    await queryRunner.query(`UPDATE "performer" SET "name" = "name_temp"`);
    // drop the temporary column
    await queryRunner.query(`ALTER TABLE "performer" DROP COLUMN "name_temp"`);
    // set the new column to not be nullable
    await queryRunner.query(`ALTER TABLE "performer" ALTER COLUMN "name" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "performer" ADD CONSTRAINT "UQ_53ab0a09ca150e7ba97765df745" UNIQUE ("name")`,
    );
    // ---
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "performer" DROP CONSTRAINT "UQ_53ab0a09ca150e7ba97765df745"`,
    );
    await queryRunner.query(`ALTER TABLE "performer" DROP COLUMN "name"`);
    await queryRunner.query(`ALTER TABLE "performer" ADD "name" character varying(100) NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "performer" ADD CONSTRAINT "UQ_53ab0a09ca150e7ba97765df745" UNIQUE ("name")`,
    );
    await queryRunner.query(`ALTER TABLE "performer" DROP COLUMN "label"`);
  }
}
