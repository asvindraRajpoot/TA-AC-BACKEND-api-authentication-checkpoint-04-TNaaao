var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');


var answerSchema=new Schema({
 text:{type:String,required:true},
 author:{type:Schema.Types.ObjectId,ref:'User',required:true},
 questionId:{type:Schema.Types.ObjectId,ref:'Question',required:true},


   

},{timestamps:true})





module.exports=mongoose.model('Answer',answerSchema);