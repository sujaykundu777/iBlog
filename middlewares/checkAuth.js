// redirect, if user is not logged in
const requireLogin = (req, res, next) => {
    if(!req.session.authed && !req.session.user){
        console.log('Login required, redirecting...');
        res.redirect('/login');
    }else{
        next();
    }
}

export { requireLogin };

