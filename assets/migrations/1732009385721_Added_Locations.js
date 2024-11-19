const { MigrationInterface, QueryRunner } = require("typeorm");

module.exports = class AddedLocations1732009385721 {
    name = 'AddedLocations1732009385721'

    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE "locations" (
                "id" character varying(36) NOT NULL,
                "building" character varying(256) NOT NULL,
                "name" character varying(256) NOT NULL,
                "location_number" character varying(256) NOT NULL,
                "level" integer NOT NULL,
                "area" numeric(16, 2) NOT NULL,
                "creator" character varying(256),
                "creation_time" TIMESTAMP,
                "last_modifier" character varying(256),
                "last_modification_time" TIMESTAMP,
                "deleter" character varying(256),
                "deletion_time" TIMESTAMP,
                "parentId" character varying(36),
                CONSTRAINT "PK_7cc1c9e3853b94816c094825e74" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "locations"
            ADD CONSTRAINT "FK_9f238930bae84c7eafad3785d7b" FOREIGN KEY ("parentId") REFERENCES "locations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE "locations" DROP CONSTRAINT "FK_9f238930bae84c7eafad3785d7b"
        `);
        await queryRunner.query(`
            DROP TABLE "locations"
        `);
    }
}
