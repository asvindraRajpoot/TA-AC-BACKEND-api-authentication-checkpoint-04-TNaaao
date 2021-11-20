var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middelwares/auth');
var Question=require('../models/question');
var Answer=require('../models/answer');


//post request on /questions //create a question
router.post('/',auth.verifyToken,async function(req,res,next){
  // console.log(req.body)
  req.body.slug=req.body.title;
  console.log(req.body.slug);
   req.body.author=req.user.userId
   try {
    const question=await Question.create(req.body)
    console.log(question);
    if(question){
        res.json({question:question})
    }
   } catch (error) {
       next(error)
       
   }
 

})

//list all questions //GET request on /questions
router.get('/',async function(req,res,next){
    try {
        const questions=await Question.find();
        console.log(questions);
        if(questions.length!==0){
            res.json({questions})
        }
        
    } catch (error) {
        next(error)
        
    }
})

//update the question //PUT request  /questions/:questionId
router.put('/:questionId',auth.verifyToken,async function(req,res,next){
    const questionId=req.params.questionId;
    try {
        const question=await Question.findByIdAndUpdate(questionId,req.body,{upsert:true});
        console.log(question);
        if(question){
            res.json({question:question})
        }

        
    } catch (error) {
        next(error)
    }
})


//delete a question /questions/:slug
router.delete('/:slug',auth.verifyToken,async function(req,res,next){
    const slug=req.params.slug;
    try {
        const question=await Question.findOne({slug:slug});
        if(question){
           if(question.answers.length!==0){
            question.answers.forEach(answer=>{
                const deletedAnswer= Answer.findByIdAndDelete(answer,{upsert:true});
                
            })

           }else{
               const deletedQuestion=await Question.findByIdAndDelete(question._id,{upsert:true})
               res.json({question:deletedQuestion})
           }
        }else{
            res.json({msg:"Question does not exist"});
        }
        
    } catch (error) {
        next(error)
        
    }
})


//add answer POST request on /questions/:questionId/answers
router.post('/:questionId/answers',auth.verifyToken,async function(req,res,next){
    const questionId=req.params.questionId;
    req.body.questionId=questionId;
    req.body.author=req.user.userId;
    try {
        const answer=await Answer.create(req.body);
        if(answer){
            console.log(answer)
            req.body.answers=answer._id;
            let question=await Question.findById(answer.questionId)
            question.answers.push(answer._id);
            question.save();
            console.log('it is found and updated question',question);
            res.json({answer:answer});
        }else{
            res.json({msg:"Answer is not created"});
        }
        
    } catch (error) {
        next(error)
        
    }

})


















module.exports = router;