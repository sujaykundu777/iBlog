
import bodyParser from 'body-parser';
import express from 'express';
import Session from 'express-session';
import morgan from 'morgan';
import path from 'path';
import './config/mongodb.config.js';
import errorHandler from './middlewares/errorHandler.js';
import router from './src/routes/index.js';
import color from './utils/chalk.js';

const app = express();
const PORT = 3000 || process.env.PORT; // Todo: add process.env.PORT

// use logger middleware
app.use(morgan('dev'));

// use body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(errorHandler);

// session handling
app.use(Session({
    secret: process.env.SECRET, //secret key for the session
    resave: true, // force the session to be saved back to the session store
    saveUninitialized: true // force a session that is unintialized to be saved to the store
}));

// render static files
app.use(express.static(path.join('public')));

// views folder
app.set('view engine', 'ejs');
app.set('views', path.join('src', 'views'));

// use routes
router(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    res.status(404).render("error");
});


// Run Port
app.listen(PORT, () => {
 console.log(color.blueBright(`App listening at http://localhost:${PORT}`))
});

