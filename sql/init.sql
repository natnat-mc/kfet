/* create database info table */
CREATE TABLE dbInfo (
	key STRING PRIMARY KEY,
	value STRING
);
INSERT
	INTO dbInfo(key, value)
	VALUES ('version', '0.0.0');
