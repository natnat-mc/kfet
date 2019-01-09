// load config
const config=require('./config');
let env=Object.assign({}, config.env || {}, process.env);
Object.assign(process.env, env);

// load everything
require('./src/express');

