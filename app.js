
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , FacebookStrategy = require('passport-facebook').Strategy
  , path = require('path');

var secret = require('./PRIVATE');
console.log(secret);
var app = express();

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  var userSchema = mongoose.Schema({
        name: String
  });
  var User = mongoose.model('User', userSchema);
});


passport.use(new FacebookStrategy({
      clientID: secret.facebook.id,
      clientSecret: secret.facebook.secret, 
      callbackURL: "http://padapt.com/auth/facebook/callback"
    },
      function(accessToken, refreshToken, profile, done) {
            User.findOrCreate(function(err, user) {
                    if (err) { return done(err); }
                          done(null, user);
                              });
              }
));

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', 
      passport.authenticate('facebook', { successRedirect: '/',
                                              failureRedirect: '/login' }));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
