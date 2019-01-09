// create and setup an app
const express=require('express');
const app=express();
require('ejs'); // load EJS now to avoid the cost of require'ing it at the first call to render()
require('express-ws')(app); // add the .ws() route
app.use(express.json()); // parse JSON bodies automatically
app.use(express.urlencoded()); // parse urlencoded bodies automatically
app.set('views', process.cwd()+'/views'); // allow EJS views to be loaded
app.use(express.static(process.cwd()+'/static')); // allow static resources to be served

// listen on either the port given in env (or loaded from config) or 3000
app.listen(process.env.PORT || 3000);

