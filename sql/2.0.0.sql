/* cookies are JWT's, so they don't belong in a database */
DROP TABLE cookies; /* sorry, cookie monster TT */

/* however, scopes are a thing */
CREATE TABLE scopes (
	name STRING PRIMARY KEY,
	desc STRING NOT NULL
);
INSERT
	INTO scopes(name, desc)
	VALUES
		('api', 'full read/write access to all the API'),
		('read', 'full read access to all the API'),
		('user', 'full read/write access to everything the associated user can do'),
		('read_user', 'full read access to everything the associated user can do');
