/* I've heard that this is actually supposed to have a purpose */

/* let there be meals */
CREATE TABLE meals (
	id INTEGER PRIMARY KEY,
	name STRING UNIQUE NOT NULL,
	ingredientCount INTEGER NOT NULL,
	price NUMBER NOT NULL
);

/* let there be ingredients */
CREATE TABLE ingredients (
	id INTEGER PRIMARY KEY,
	name STRING UNIQUE NOT NULL
);

/* let there be drinks */
CREATE TABLE drinks (
	id INTEGER PRIMARY KEY,
	name STRING UNIQUE NOT NULL,
	price NUMBER NOT NULL
);

/* let there be desserts */
CREATE TABLE desserts (
	id INTEGER PRIMARY KEY,
	name STRING UNIQUE NOT NULL,
	price NUMBER NOT NULL
);

/* let there be menus */
CREATE TABLE menus (
	id INTEGER PRIMARY KEY,
	hasMeal INTEGER CHECK (hasMeal=0 OR hasMeal=1) DEFAULT 1,
	meal INTEGER REFERENCES meals(id) ON DELETE CASCADE,
	hasDrink INTEGER CHECK (hasDrink=0 OR hasDrink=1) DEFAULT 1,
	drink INTEGER REFERENCES drinks(id) ON DELETE CASCADE,
	hasDessert INTEGER CHECK (hasDessert=0 OR hasDessert=1) DEFAULT 1,
	dessert INTEGER REFERENCES desserts(id) ON DELETE CASCADE,
	price NUMBER NOT NULL
);

/* let there be orders and the like */
CREATE TABLE orders (
	id INTEGER PRIMARY KEY,
	addDate INTEGER DEFAULT (strftime('%s', 'now')),
	status INTEGER DEFAULT 0,
	
	meal INTEGER REFERENCES meals(id),
	drink INTEGER REFERENCES drinks(id),
	dessert INTEGER REFERENCES desserts(id),
	menu INTEGER REFERENCES menus(id),
	price INTEGER NOT NULL
);
CREATE TABLE orderIngredient (
	ingredient INTEGER REFERENCES ingredients(id),
	"order" INTEGER REFERENCES orders(id)
);
