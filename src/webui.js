// load libs
const log=require('log').get('webui');
const auth=require('./auth');
const db=require('./db');
const shared=require('../shared');
const {config}=shared;

// helper functions
function render(name, params) {
	return (req, res) => {
		res.render(name || res.locals.view, params);
	};
};

// setup entrypoint
module.exports=exports=function(app) {
	// force res to have a session (albeit an empty one)
	app.use((req, res, next) => {
		if(!res.locals.session) res.locals.session=undefined;
		next();
	})
	
	//NOTICE this is debug, baka!
	app.get('/', render('loginBoxTest'));
	
	// standard routes
	app.get('/dbEditor', (req, res, next) => {
		if(!res.locals.session || !res.locals.session.user || !res.locals.session.user.perm.admin) {
			res.status(401).render('permissionError', {
				missingPerm: ['admin']
			});
		}
		next();
	}, render('dbEditor'));
};
