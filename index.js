// setup logger
require('log-node')();
const log=require('log').get('index');

// load config
const config=require('./config');
log.info("Loaded configuration file");

// load evironment variables
let env=Object.assign({}, config.env, process.env);
Object.assign(process.env, env);

// set working directory to where the script is located
process.chdir(__dirname);

// load shared file
const shared=require('./shared');
shared.config=function(namespace, key) {
	return config[namespace][key];
};

// load database
require('./src/db');

// load everything
require('./src/express');

// setup signal handlers to exit
((a => {
	[].forEach.call(['int', 'term', 'hup'], a);
})(s => {
	s='SIG'+s.toUpperCase();
	process.on(s, () => {
		log.notice("Exiting on "+s);
		process.exit(0);
	});
}));
