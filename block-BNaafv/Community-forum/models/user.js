var mongoose=require('mongoose');
var Schema=mongoose.Schema;
var bcrypt=require('bcrypt');
var jwt=require('jsonwebtoken');
var userSchema=new Schema({
    username:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true,unique:true},
    name:String,
    image:String,
    bio:String


   

},{timestamps:true})



//pre(save)hook
userSchema.pre('save',async function(next){
    
    if(this.password && this.isModified('password')){
      this.password=await bcrypt.hash(this.password,10);
        
    }else{
        next();
    }

})

//method
userSchema.methods.verifyPassword= async function(password){
  try{
    var result=await bcrypt.compare(password,this.password);
       return result; 
  }catch(error){
      return error;
  }
  bcrypt.compare();
}


userSchema.methods.signToken=async function(){
  
  var payload={userId:this.id,email:this.email}
  try {
    var token=await jwt.sign(payload,"thisisasecret")
    return token;
    
  } catch (error) {
    return error;
    
  }

}

userSchema.methods.userJSON=function(token){
  return {
    username:this.username,
    email:this.email,
    token:token,
  }
}


userSchema.methods.profileJSON=function(){
    return {
      username:this.username,
      name:this.name,
      image:this.image,
      bio:this.bio,
    }
  }

module.exports=mongoose.model('User',userSchema);