// load shared data
const shared=require('../shared');
const config=shared.config;

// load libraries
const Sqlite=require('better-sqlite3');
const fs=require('fs');
const semver=require('semver');
const log=require('log').get('db');

// load database
let db;
try {
	// load database from disk
	db=new Sqlite(config('db', 'filename'), {
		fileMustExist: true
	});
	log.info("Loaded database from file");
} catch(e) {
	// create database from init.sql
	db=new Sqlite(config('db', 'filename'));
	db.exec(fs.readFileSync('sql/init.sql', 'utf8'));
	log.info("Created database from sql file");
}

// execute db migrations automatically
(() => {
	const migrations=JSON.parse(fs.readFileSync('sql/migrations.json'));
	const getVersion=db.prepare('SELECT value FROM dbInfo WHERE key=\'version\'');
	getVersion.pluck(true);
	let version=getVersion.get();
	if(semver.eq(version, migrations.versions)) {
		log.info("Database is already up to date");
	}
	while(semver.lt(version, migrations.version)) {
		let migration=migrations[version];
		if(!migration) {
			log.alert("Couldn't migrate database: stuck on %s", version);
			throw new Error("Couldn't migrate database: stuck on "+version);
		}
		log.info("Applying migration from version %s", version)
		migration.forEach(part => {
			log.debug("Applying db patch: %s", part);
			if(fs.existsSync('sql/'+part)) {
				db.exec(fs.readFileSync('sql/'+part, 'utf8'));
			} else {
				db.exec(part);
			}
		});
		version=getVersion.get();
	}
});

log.info("Database is ready");

shared.db=db;
module.exports=db;
