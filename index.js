// load config
const config=require('./config');

// load evironment variables
let env=Object.assign({}, config.env, process.env);
Object.assign(process.env, env);

// set working directory to where the script is located
process.chdir(__dirname);

// load everything
require('./src/express');

