/* user accounts are a thing, I was told */
CREATE TABLE accounts (
	id INTEGER PRIMARY KEY,
	username STRING UNIQUE NOT NULL,
	password BLOB NOT NULL,
	salt BLOB NOT NULL,
	addDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* and session cookies too */
CREATE TABLE cookies ( /* https://i.imgur.com/Y9i11Rx.jpg */
	user INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
	value BLOB NOT NULL,
	expires TIMESTAMP NOT NULL
);

/* so does account categories */
CREATE TABLE permissions (
	id INTEGER PRIMARY KEY,
	name STRING UNIQUE NOT NULL,
	desc STRING NOT NULL
);
CREATE TABLE userPerm (
	user INTEGER REFERENCES accounts(id) ON DELETE CASCADE,
	perm INTEGER REFERENCES permissions(id) ON DELETE CASCADE
);
INSERT
	INTO permissions(name, desc)
	VALUES
		('admin', 'An administrator with full access'),
		('bde', 'A BDE member with full read access'),
		('customer', 'A customer with order status read access');
