//Redefining all our routes 
var express = require('express');
var router = express.Router();
var multer = require('multer');
var moment = require('moment');
var passport = require('passport');
var flash = require('connect-flash');
var User = require('../app/models/user');
var Post = require('../app/models/post');


var LocalStrategy = require('passport-local').Strategy;
var upload  = multer({
                     dest: './public/images'
                     });


     //used to serialize the user for the session
     passport.serializeUser(function(user, done){
       console.log('serializing user: ', user);
       done(null, user.id);/categories/new
     });
      
     //used to deserialize the user
     passport.deserializeUser(function(id,done){
       User.getUserById(id , function(err , user ){
       console.log('deserializing user:',user);
         done(err , user);
      });

     });

      //Local Strategy for Passport
     
  passport.use(new LocalStrategy(function(username, password, done){
         User.getUserByUsername(username, function(err, user){
          if(err) throw err;
          if(!user){
            return done(null, false );
          }

          User.comparePassword(password, user.password , function(err, isMatch){
            if(err) return done(err);
            if(isMatch){
              return done(null,user);
            } else{
              return done(null, false );
            }
          });
         });
  }));

   router.get('/signup', function(req, res, next) {
   
  res.render('signup.ejs');

  });


  // Sign Up

   router.post('/signup', upload.single('profileimage'),

     function(req, res, next){

     var name = req.body.name;               
     var email = req.body.email;
     var username = req.body.username;
     var password = req.body.password;

     if(req.file){
       
       console.log('Uploading Profile Image');
       var profileimage = req.file.filename;

     }

     else{
        
        console.log('Uploading Failed ! ');  
        var profileimage = 'noimage.jpg';
     }



     var newUser = new User({
        name : name ,
        email : email ,
        username : username,
        password : password,
        profileimage : profileimage
     });

      User.createUser(newUser , function(err , user){
          if(err) throw err;
          console.log(user);

      });


    
      res.location('/');
      res.redirect('/login');
});

      router.get('/' , function(req , res){
         
          res.render('index.ejs');

      });


     // Get Login Page 

      router.get('/login' , function(req , res){

          res.render('login.ejs' , { message: 'Please Login To Continue' } );

      });
      
     router.post('/login',
     
       passport.authenticate('local', { successRedirect: '/posts',
                                         failureRedirect: '/login',
                                         failureFlash: true 
                                       })
      
            );




          //route middleware to make sure user is logged in
	  function ensureAuthenticated(req,res, next) {
	  // if user is authenticated in the session, call the next() to call the next request handler 
	  // Passport adds this method to request object. A middleware is allowed to add properties to
	  // request and response objects
	         if (req.isAuthenticated())
        	return next();

     	// if the user is not authenticated then redirect him to the login page
	    res.redirect('/login');
       }
     

 

//Add new post 
    
   router.get('/posts/new', ensureAuthenticated , function(req,res){

      

            var user = req.user;
              res.render('newpost.ejs', {
                                        'title': 'Add New Post',
                                        user:user
       

    });
           
   });

// Add New Post
  router.post('/posts/new', ensureAuthenticated, upload.single('post_img') , function(req,res,next){

  var title = req.body.title;
  var content = req.body.content;


 
       if(req.file){
       
       console.log('Uploading Post Image');
       var post_img = req.file.filename;

     }


     else{
        
        console.log('Uploading Failed ! ');  
         var post_img = 'noimage.jpg';
       }
  var newpost = new Post({
                           'title':  title,
                        'content' : content,
                        'post_img' : post_img,
                        'postedOn':  new Date()
                         });
                        

     newpost.save(function(err){
              
              if (err) {
                          return next(err);
                        }
                        
    console.log( 'Post Successfully Created' + newpost);
    res.redirect('/posts');
  
   
 });

 
});

      //Route for Showing Posts 
 
      router.get('/posts', ensureAuthenticated , function(req, res, next ){
         
           Post.find(function(err , Post) {
           if (err) { 
                     return next(err);
                    }
           var user = req.user;
        
             //res.json(Post);

                 res.render('posts.ejs', {

                 title: 'Showing Posts ',
                 posts : Post,
                 user : user

                 });
               });
              });


    //Route for showing Single post

      
router.get('/posts/show/:id',ensureAuthenticated, function(req, res,next){
 
  Post.findById(req.params.id,function(err , Post){
     if(err){
      return next(err);

     }
     var user = req.user;
 res.render('post', {
    title: 'Showing post',
    post : Post,
    user: user
  });

 });
  
});

//Route to show edit a single post page 

 router.get('/posts/show/:id/edit',ensureAuthenticated,function(req,res){
   var user = req.user;
    Post.findById(req.params.id,function(err , Post){
     if(err){
      return next(err);

     }
   res.render('editpost', {title : 'Edit Post', 
                               user : user,
                               post: Post
 });
    
});
 });

router.put('/posts/show/:id/edit', ensureAuthenticated, function(req, res ){
 
   var editedPost = {
       title: req.body.title,
      content: req.body.content
 };

 Post.findById(req.params.id, editedPost , function(err , Post){
     
     if(err) {
      return next(err);
      return res.redirect('/posts/show/' + req.params.id);
       }
        
     if(Post){
          
          Post.save(function(err){
                 if(err) {
                  return next(err);
                 }
              
              res.redirect('/posts/show/' + req.params.id);
          });
         
     }
     else{

           res.send('Post Does Not Exist !');
          }
 });

});



  //Route to delete a post 
router.delete('/post/:id', function(req,res){
  Post.findByIdAndRemove(req.params.id,function(err){
         if(err) {
              req.flash('error', err.message);
return res.redirect('/posts');
}
});
              
});
               


    //Route For Showing all users 
      router.get('/users', function(req, res ){
            
           User.find(function(err, User){
              if(err){
                       return next(err);
              } 
               
               res.render('users.ejs',{
                           title: 'Showing Users',
                           users : User
                 });

           });
 

      });


  //Handle Logout 
  router.get('/logout', function(req,res){
         req.logout();
         req.flash('success', 'Successfully Logged Out ');
      res.redirect('/login');
    });


module.exports = router; 