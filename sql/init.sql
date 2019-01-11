/* create database info table */
CREATE TABLE dbInfo (
	key VARCHAR PRIMARY KEY,
	value VARCHAR
);
INSERT
	INTO dbInfo(key, value)
	VALUES ('version', '0.0.0');
