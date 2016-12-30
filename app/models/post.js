// Post Model 


var mongoose = require('mongoose');

var postSchema = new mongoose.Schema({

   title: { type:String,required:true},
   content :{ type:String,required:true},
   post_img : { type: String},
   postedOn: {type: Date },
  
/*    author : {
    	    id: { type: mongoose.Schema.Types.ObjectId , ref: 'User'},
    	    username : { type: String ,required: true}
    },
    */
    
  });




module.exports = mongoose.model('Post', postSchema);
