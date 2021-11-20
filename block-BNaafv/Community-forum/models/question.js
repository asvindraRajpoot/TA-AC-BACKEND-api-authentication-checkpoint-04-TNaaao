var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');


var questionSchema=new Schema({
  title:{type:String,required:true},
  author:{type:Schema.Types.ObjectId,required:true,ref:'User'},
  slug:{type:String,required:true},
  description:String,
  tags:[{type:String}],
  answers:[{type:Schema.Types.ObjectId,ref:'Answer'}]


   

},{timestamps:true})


function convertToSlug(str) {
    return str
      .trim()
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "")
      .concat(Math.floor(Math.random() * 1000));
  }
  
  questionSchema.pre("save", function (next) {
    if (this.title && this.isModified("title")) {
      this.slug = convertToSlug(this.title);
    }
    next();
  });



module.exports=mongoose.model('Question',questionSchema);