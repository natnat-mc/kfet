// setup logger
require('log-node')();
const log=require('log').get('index');

// load config
const config=require('./config');

// load evironment variables
let env=Object.assign({}, config.env, process.env);
Object.assign(process.env, env);

// set working directory to where the script is located
process.chdir(__dirname);

// load shared file
const shared=require('./shared');
shared.config=function(namespace, key) {
	return (config[namespace] || {})[key];
};

// create global event emitter
const EE=require('events');
const events=new EE();
shared.events=events;

// load logger
require('./src/logger')(shared.config('log', 'filename'), shared.config('log', 'mode'));

// load database
require('./src/db');

// load everything
require('./src/express');

// setup signal handlers to exit
['int', 'term', 'hup'].forEach(s => {
	s='SIG'+s.toUpperCase();
	process.on(s, () => {
		log.notice("Exiting due to "+s);
		events.emit('die', s);
	});
});
