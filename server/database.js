const pg = require('pg');

const connectionString = 'postgres://vmsepeiy:YBKyX2Eax7Yhpt0DkD3xP2xSd3bw-jDf@baasu.db.elephantsql.com:5432/vmsepeiy';

const client = new pg.Client({
  connectionString: connectionString,
})
client.connect();

client.query(`CREATE TABLE IF NOT EXISTS "doctors" (
	"id" serial NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT doctors_pk PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE IF NOT EXISTS "reviews" (
	"doctor_id" int NOT NULL,
	"id" serial NOT NULL,
	"description" TEXT NOT NULL,
  CONSTRAINT reviews_pk PRIMARY KEY ("id"),
  CONSTRAINT reviews_fk0 FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id")
) WITH (
  OIDS=FALSE
);
`, 
(err, res) => {
  if (err) console.error(err);
})

module.exports = client;
