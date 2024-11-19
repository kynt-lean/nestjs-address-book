const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddedEntityChanges1732004685241 {
    name = 'AddedEntityChanges1732004685241'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "EntityChanges" (
                "id" character varying(36) NOT NULL,
                "entity_name" character varying(128) NOT NULL,
                "entity_id" character varying(128) NOT NULL,
                "change_type" smallint NOT NULL,
                "change_time" TIMESTAMP NOT NULL,
                "correlation_id" character varying(36) NOT NULL,
                "actor_id" character varying(128) NOT NULL,
                "actor_type" smallint NOT NULL,
                CONSTRAINT "PK_e03f88227c5779cb60ac0d36743" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ENTITY_ID" ON "EntityChanges" ("entity_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_CORRELATION_ID" ON "EntityChanges" ("correlation_id")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_ACTOR_ID" ON "EntityChanges" ("actor_id")
        `);
        await queryRunner.query(`
            CREATE TABLE "EntityPropertyChanges" (
                "id" character varying(36) NOT NULL,
                "entity_change_id" character varying(36) NOT NULL,
                "property_name" character varying(128) NOT NULL,
                "old_value" character varying(512),
                "new_value" character varying(512),
                CONSTRAINT "PK_8dccc4ebb8c4aaa38abdab0fc63" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_PROPERTY_NAME" ON "EntityPropertyChanges" ("property_name")
        `);
        await queryRunner.query(`
            ALTER TABLE "EntityPropertyChanges"
            ADD CONSTRAINT "FK_4dd7f27d47045b4d0676af849e5" FOREIGN KEY ("entity_change_id") REFERENCES "EntityChanges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "EntityPropertyChanges" DROP CONSTRAINT "FK_4dd7f27d47045b4d0676af849e5"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_PROPERTY_NAME"
        `);
        await queryRunner.query(`
            DROP TABLE "EntityPropertyChanges"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ACTOR_ID"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_CORRELATION_ID"
        `);
        await queryRunner.query(`
            DROP INDEX "public"."IDX_ENTITY_ID"
        `);
        await queryRunner.query(`
            DROP TABLE "EntityChanges"
        `);
    }
}
