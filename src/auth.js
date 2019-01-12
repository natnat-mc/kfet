// load libs
const db=require('./db');
const log=require('log').get('auth');
const bcrypt=require('bcrypt');
const shared=require('../shared');

// some setup
const rounds=8; // enough to be secure, but not slow
const duration=1000*60*60*24*7; // a week

// load the statements
const getUserByName=db.loadStat('getFullUserByName');
const getUserById=db.loadStat('getUserById');
const getCookie=db.loadStat('getCookie');
const cleanCookies=db.loadStat('cleanCookies');
const createCookie=db.loadStat('createCookie');
const createUser=db.loadStat('createUser');

// authenticate a user
module.exports.authUser=function(name, password) {
	let user=getUserByName.get(name);
	if(user && bcrypt.compareSync(password, user.password.toString('utf8'))) {
		return user;
	} else {
		return false;
	}
};

// validate a cookie
module.exports.checkCookie=function(hash) {
	cleanCookies.run()
	let cookie=getCookie.get(Buffer.from(hash, 'utf8'));
	if(cookie) {
		return getUserById.get(cookie.user);
	}
	return false;
};

// create a cookie
module.exports.createCookie=function(user) {
	let hash;
	return bcrypt.genSalt(rounds).then(salt => {
		return bcrypt.hash(Date.now()+user.id, salt);
	}).then(str => {
		hash=str;
		return Buffer.from(str, 'utf8');
	}).then(buf => {
		return createCookie.run({user: user.id, value: buf, expires: Date.now()+duration});
	}).then(() => {
		return hash;
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
		return getUserById.get(status.lastInsertRowid);
	});
};
