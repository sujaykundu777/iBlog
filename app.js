//Require all the modules
var express = require('express'),
    app = express(),
    path = require('path'),
    morgan = require('morgan'),
    port = process.env.PORT || 3000,
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	multer = require('multer'),  //for file uploads
	configDB = require('./config/db'),
	mongo = require('mongodb'),
	mongoose = require('mongoose'),
	routes = require('./app/routes'),
	bcrypt = require('bcryptjs'),
	upload  = multer({dest: './uploads'}), 
	Session = require('express-session');
    
  
    //Connect to Database
    mongoose.connect(configDB.url);
    app.use(morgan('dev')); // log every request to the console
	app.use(express.static(path.join(__dirname, 'public'))); //For Static Files
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true }))    // parse application/x-www-form-urlencoded
    app.use(bodyParser.json())    // parse application/json
    app.use(methodOverride('_method'));
    app.use(flash()); // Connect flash for flash messages stored in session
    app.use(function(req, res , next) {
    	res.locals.messages = require('express-messages')(req, res);
    	next();

    });
    app.use(Session({secret: 'secret',
            resave: true,
            saveUninitialized: true})); //Todo - Why do we need this key
	app.use(passport.initialize()); //Initialize passport
	app.use(passport.session()); //Initialize Sessions for Passport
    app.set('view engine' , 'ejs'); //Set the template engine 
	app.set('views', path.join(__dirname, 'views' ));
 
     //Define the routes

    
    app.use('/', routes);
   
  

    
var env = process.env.NODE_ENV || 'development';
	
	// development error handler
	// will print stacktrace
	if ('development' == env) {

		
	// catch 404 and forward to error handler
	app.use(function( req, res, next) {
	var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});

}
	
// production error handler
// no stacktraces leaked to user

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
	

	//launch

	app.listen(port);
	console.log('App Started on Port ' + port );
