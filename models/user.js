// The Post model
var mongoose = require('mongoose')
     ,Schema = mongoose.Schema
     ,ObjectId = Schema.ObjectId;
         
var userSchema = new mongoose.Schema({
     name: String
     //date: {type: Date, default: Date.now},
     //author: {type: String, default: 'Anon'},
});

userSchema.methods.findOrCreate = function findOrCreate(accessToken, refreshToken, profile, callback){
  console.log(profile);
  callback(false, profile);
};
    
                        
module.exports = mongoose.model('User', userSchema);
