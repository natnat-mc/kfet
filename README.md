# KFet
The software for the KFet Info, next version.

Handles orders, pre-orders, stock and preparation for a cafeteria with a web-based interface for both desktop and mobile.

## Directory structure
- `/` -- *you're here*
	- `data` -- data generated and consumed by the software
	- `doc` -- documentation
	- `sql` -- SQL statements
	- `src` -- source code
		- `less` -- Less source code
		- `js` -- JavaScript client source code
	- `static` -- static files for the webserver
		- `res` -- compiled resources
		- `img` -- images
		- `lib` -- 3rd-party libraries
    - `tools` -- compile tools
	- `views` -- EJS views

## Dependencies
- `Node.js` >=10
	- `express` and `express-ws`
	- `ejs`
	- `better-sqlite3`
	- `log` and `log-node`
	- `semver`
	- `printf`
	- `bcrypt`
	- `cors`, `cookie-parser` and `compression`
	- `less` *as a devDependency, not required for running the program*
- A recent web browser supporting WebSockets

## Licence
This project is licenced under the AGPL 3.0 or later, which means that anyone who can interact with it or a derivative work should be able to access the source code.

