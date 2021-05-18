import chalk from 'chalk';
import Log from './logger.js';
const env = 'development' || process.env.NODE_ENV;

//handle email or username duplicates
const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue);
    const code = 409;
    const error = `An account with that ${field} already exists.`;
    res.status(code).send({messages: error, fields: field});
 }

//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
    let errors = Object.values(err.errors).map(el => el.message);
    let fields = Object.values(err.errors).map(el => el.path);
    let code = 400;
    if(errors.length > 1) {
       const formattedErrors = errors.join(' ');
       res.status(code).send({messages: formattedErrors, fields:     fields});
     } else {
        res.status(code).send({messages: errors, fields: fields})
     }
 }
const errorHandler = (err, req, res, next) => {
    try {
        console.log('congrats you hit the error middleware');

        res.locals.message = err.message;
        res.locals.error = env === 'development' ? err: {};

        //  include winston logging to file
          Log.error(chalk.red(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`));

        // render the error page
      //  console.error(chalk.red(err.stack));
         console.log(chalk.red("ERROR: ") + chalk.yellow(err.status) + " : " + chalk.red(err));
         res.status(err.status || 500).send({'error': err.message});

        // if (err.name === 'ValidationError') return err = handleValidationError(err, res);
        // if (err.code && err.code == 11000) return err = handleDuplicateKeyError(err, res);
    } catch (err) {
        res.status(500).send('An unknown error occurred.');
    }
}
export default errorHandler;