// load libs
const log=require('log').get('api');
const auth=require('./auth');
const db=require('./db');
const shared=require('../shared');
const {config}=shared;
const ms=require('ms');

// load statements
const getUserById=db.loadStat('getUserById');

// setup entrypoint
module.exports=exports=function(app) {
	log.info("setting up API");
	
	// use cookie or header as token if present
	app.use((req, res, next) => {
		if(req.cookies.session) {
			// use the cookie as token
			log.debug("using cookie as token: %s", req.cookies.session);
			if(!req.query) req.query={};
			if(!req.query.token) req.query.token=req.cookies.session;
			
			// flag the request as coming from the WebUI and not a server
			req.webui=true;
		}
		if(req.get('Token')) {
			// use the header as token
			log.debug("using header as token: %s", req.get('Token'));
			if(!req.query) req.query={};
			if(!req.query.token) req.query.token=req.get('Token');
		}
		next();
	});
	
	// read token and get session
	app.use((req, res, next) => {
		if(req.query.token) {
			let token=auth.validateToken(req.query.token);
			if(token) {
				let user=getUserById.get(token.user);
				log.debug("found valid cookie for user %s", user.username);
				res.locals.session={
					user,
					scopes: token.scopes
				};
			} else {
				// send an error message
				if(req.webui) {
					// for WebUI users, delete the cookie and redirect to the main page
					res.cookie('session', {maxAge: -1000*60*60*24});
					return res.redirect('/');
				} else {
					return res.status(401).json({
						error: 'invalid token',
						desc: "An invalid token was provided. It could have expired or been revoked."
					});
				}
			}
		}
		next();
	});
	
	// handle user login
	app.post('/api/login', async (req, res) => {
		//FIXME use actual tokens
		// see what we got there
		if(req.body.login && req.body.password) {
			// attempt to authenticate someone
			let user=await auth.authUser(req.body.login, req.body.password);
			if(user) {
				// save their session
				req.session=user;
				// give them a cookie
				let cookie=await auth.createToken(['user'], user);
				res.cookie('session', cookie, req.body.rememberme?{maxAge: ms(auth.duration)-ms('1h')}:undefined);
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
	
	// handle user logout
	app.all('/api/logout', (req, res) => {
		//FIXME use actual tokens
		// delete the session cookie
		res.cookie('session', '', {maxAge: -1000*60*60*24});
		//TODO delete it from db too
		// redirect them to where they came from
		res.redirect('back');
	});
	
	//TODO create a token from a secret
	app.get('/api/token', (req, res) => {
		throw new Error("Unimplemented");
	});
	//TODO revoke a token
	app.get('/api/token/revoke', (req, res) => {
		throw new Error("Unimplemented");
	})
};
