import { requireLogin } from '../../middlewares/checkAuth.js';
import color from '../../utils/chalk.js';
import { fb_auth_url } from '../security/facebookauth.js';
import { google_auth_url } from '../security/googleauth.js';
import authRoutes from './auth.routes.js';
import socialAuthRoutes from './socialauth.routes.js';

// Views
function Router(app) {
    // Routes
    app.get('/', (req, res) => {
        res.render('home.ejs');
    });

    // Login View
    app.get('/login', (req, res) => {
        res.render('auth/login.ejs');
    });

    // Signup View
    app.get('/register', (req, res) => {
        res.render('auth/register.ejs');
    });

    // use google for authentication
    app.get('/goo', async (req, res) => {
        if (!req.session.authed) {
            // generate a OAuth client url and redirect there
            res.redirect(google_auth_url);
        } else {
            console.log(color.yellowBright('Authenticated already!'));
            req.user = req.session.user;
            res.redirect('/dashboard');
        }
    });

    // Facebook Auth
    app.get('/fb', async (req, res) => {
        if (!req.session.authed) {
            // generate a OAuth client url and redirect there
            res.redirect(fb_auth_url);
        } else {
            console.log(color.yellowBright('Authenticated already!'));
            req.user = req.session.user;
            res.redirect('/dashboard');
        }
    });

    // Auth APIS
    app.use('/api', authRoutes);

    // Social Auth APIs
    app.use('/auth', socialAuthRoutes);

    // User Dashboard view
    app.get('/dashboard', requireLogin, async (req, res) => {
        //fetch details from session
        let user = req.session.user;
        res.render('user/dashboard.ejs', {
            user: user
        });
    });

    //Logout
    app.get('/logout', function (req, res) {
        req.session.destroy((err) => {
            res.redirect('/login') // will always fire after session is destroyed
        })
    });
}

export default Router;