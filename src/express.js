// load libs
const shared=require('../shared');
const db=require('./db');
const log=require('log').get('express');

// create and setup an app
const express=require('express');
const app=express();
require('ejs'); // load EJS now to avoid the cost of require'ing it at the first call to render()
require('express-ws')(app); // add the .ws() route
app.use(express.json()); // parse JSON bodies automatically
app.use(express.urlencoded()); // parse urlencoded bodies automatically
app.set('views', process.cwd()+'/views'); // allow EJS views to be loaded
app.use(express.static(process.cwd()+'/static')); // allow static resources to be served

// listen on either the port given in env (or loaded from config) or 3000
const server=app.listen(process.env.PORT || 3000, process.env.ADDRESS || '0.0.0.0', () => {
	log.notice("Webserver listening on "+(process.env.ADDRESS || '0.0.0.0')+":"+(process.env.PORT || 3000));
});

// setup exit handler
shared.events.on('die', () => {
	log.notice("Closing webserver");
	server.close(() => log.notice("Closed webserver"));
});
