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

// add close handlers
shared.events.on('die', () => {
	db.close();
	log.notice("Closed database");
});

// execute db migrations automatically
(() => {
	const migrations=JSON.parse(fs.readFileSync('sql/migrations.json'));
	const getVersion=db.prepare('SELECT value FROM dbInfo WHERE key=\'version\';');
	getVersion.pluck();
	let version=getVersion.get();
	let count=0;
	if(semver.eq(version, migrations.version)) {
		log.info("Database is already up to date");
	} else {
		log.info("We're at version %s and need to upgrade to %s", version, migrations.version);
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
		count++;
	}
	log.debug("Applied %d migration(s)", count);
})();

log.notice("Database is ready");

shared.db=db;
module.exports=db;

// allow the db to read statements automatically from disk
(() => {
	const statements=Object.create(null);
	module.exports.loadStat=function(name) {
		if(statements[name]) {
			return statements[name];
		}
		const code=fs.readFileSync('sql/'+name+'.sql', 'utf8');
		statements[name]=db.prepare(code);
		return statements[name];
	};
})();
