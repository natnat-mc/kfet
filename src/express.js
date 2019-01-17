// load libs
const shared=require('../shared');
const db=require('./db');
const auth=require('./auth');
const log=require('log').get('express');

// create and setup an app
const express=require('express');
const app=express();
require('ejs'); // load EJS now to avoid the cost of require'ing it at the first call to render()
require('express-ws')(app); // add the .ws() route
app.use(express.json()); // parse JSON bodies automatically
app.use(express.urlencoded()); // parse urlencoded bodies automatically
app.use(require('cors')()); // allow CORS
app.use(require('cookie-parser')()); // parse cookies
app.use(require('compression')()); // compress requests
app.set('views', process.cwd()+'/views'); // allow EJS views to be loaded
app.set('view engine', 'ejs'); // set express to use EJS by default
app.use(express.static(process.cwd()+'/static')); // allow static resources to be served

// use authenticator
app.use((req, res, next) => {
	// check if we have a session cookie
	if(req.cookies['session']) {
		let user=auth.checkCookie(req.cookies['session']);
		if(user) {
			// if it's genuine, use it as our session
			req.session=user;
			log.debug('found valid cookie for user %s', user.username);
		} else {
			// if it isn't, delete it
			res.cookie('session', '', {maxAge: -1000*60*60*24});
			log.debug('found invalid cookie: %s', req.cookies['session']);
		}
	}
	res.locals.session=req.session;
	next();
});
app.post('/api/login', async (req, res) => {
	// see what we got there
	if(req.body.login && req.body.password) {
		// attempt to authenticate someone
		let user=await auth.authUser(req.body.login, req.body.password);
		if(user) {
			// save their session
			req.session=user;
			// give them a cookie
			let cookie=await auth.createCookie(user);
			res.cookie('session', cookie, req.body.rememberme?{maxAge: auth.duration}:undefined);
			res.redirect('back');
			log.info('User %s logged in', user.username);
		} else {
			//TODO render some kind of error page
			log.info('Failed login attempt as %s', req.body.login);
			return res.status(401).render('loginError', {
				login: req.body.login
			});
		}
	} else {
		//TODO what the fuck did they even mean to do?
		return res.status(400).render('genericError', {
			short: "WTF",
			message: "Why did you try to log in without any login/password combo?"
		});
	}
});
app.all('/api/logout', (req, res) => {
	// delete the session cookie
	res.cookie('session', '', {maxAge: -1000*60*60*24});
	//TODO delete it from db too
	// redirect them to where they came from
	res.redirect('back');
});

//NOTICE this is debug only
app.get('/', (req, res) => {
	return res.status(200).render('loginBoxTest');
});

// listen on either the port given in env (or loaded from config) or 3000
const server=app.listen(process.env.PORT || 3000, process.env.ADDRESS || '0.0.0.0', () => {
	log.notice("Webserver listening on "+(process.env.ADDRESS || '0.0.0.0')+":"+(process.env.PORT || 3000));
});

// setup exit handler
shared.events.on('die', () => {
	log.notice("Closing webserver");
	server.close(() => log.notice("Closed webserver"));
});
