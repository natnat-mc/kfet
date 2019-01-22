// load libs
const db=require('./db');
const log=require('log').get('auth');
const bcrypt=require('bcrypt');
const shared=require('../shared');
const {config}=shared;
const jwt=require('jsonwebtoken');

// some setup
const duration='7d'; // a week
const secret=config('crypto', 'secret');
const rounds=config('crypto', 'rounds');
module.exports.duration=duration;

// load the statements
const getUserByName=db.loadStat('getFullUserByName');
const getUserById=db.loadStat('getUserById');
const createUser=db.loadStat('createUser');
const getScopes=db.loadStat('getScopes');

// load the scopes
const scopes=getScopes.all();
module.exports.scopes=scopes;

// authenticate a user
module.exports.authUser=function(name, password) {
	let user=getUserByName.get(name);
	if(user && bcrypt.compareSync(password, user.password.toString('utf8'))) {
		log.debug('Successfully authenticated user %s', user.username)
		return user;
	} else {
		log.debug("Failed to authenticate user %s", name);
		return false;
	}
};

// validate a JWT
module.exports.validateToken=function(token) {
	return jwt.verify(token, secret);
};

// issue a JWT
module.exports.createToken=function(scopes, user) {
	return jwt.sign({
		scopes,
		user: user.id,
	}, secret, {
		expiresIn: duration
	});
};

// create a user
module.exports.createUser=function(username, password) {
	let user={username: username};
	return bcrypt.genSalt(rounds).then(salt => {
		return bcrypt.hash(password, salt);
	}).then(hash => {
		user.password=Buffer.from(hash, 'utf8');
		return createUser.run(user);
	}).then(status => {
		log.info("Successfully created user %s with id #%d", username, status.lastInsertRowid);
		return getUserById.get(status.lastInsertRowid);
	});
};
