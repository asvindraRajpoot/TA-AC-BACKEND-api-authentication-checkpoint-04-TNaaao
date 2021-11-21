var express = require('express');
var router = express.Router();
var User = require('../models/user');
var auth = require('../middelwares/auth');
var Question=require('../models/question');
var Answer=require('../models/answer');
var mongoose=require('mongoose')


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
        const deletedQuestion=await Question.findOneAndDelete({slug:slug});
        if(deletedQuestion){
            const answers=await Answer.deleteMany({questionId:deletedQuestion._id})
            if(answers.length!==0){
                res.json({question:deletedQuestion})
            }else{
                res.json({msg:"answers are not available"})
            }
              
              
               
         }else{
             res.json({msg:"No Question is available"});
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


//add answer POST request on /questions/:questionId/answers
router.post('/:questionId/answers',auth.verifyToken,async function(req,res,next){
    const questionId=req.params.questionId;
    req.body.questionId=questionId;
    req.body.author=req.user.userId;
    try {
        const answer=await Answer.create(req.body);
        if(answer){
            res.json({answer:answer})
        }else{
            res.json({msg:"Answer is not created"});
        }

        
    } catch (error) {
        next(error);
    }
})


//list all answers GET request on /questions/:questionId/answers
router.get('/:questionId/answers',auth.verifyToken,async function(req,res,next){
    const questionId=req.params.questionId;
    let answers=[];
    try {
         Question.findById(questionId).populate('answers').exec((err,question)=>{
             console.log(err,question);
             if(question){
                if(question.answers.length!==0){
                    res.json({answers:question.answers})
                }else{

                    res.json({msg:"no answers available"});
                }
             }else{
                 res.json({msg:"question is not there"})
             }
           
         })


        
    } catch (error) {
        next(error)
        
    }
})


//update the answer handle request on pathname -> /answers/:answerId
router.put('/answers/:answerId',auth.verifyToken,async function(req,res,next){
    const answerId=req.params.answerId;
    console.log(req.body);
    try {
        const answer=await Answer.findById(answerId);
        answer.text=req.body.text;
        answer.save();
        if(answer){
            res.json({answer:answer});
        }else{
            res.json({msg:"answer is not updated"});
        }

        
    } catch (error) {
        next(error)
        
    }
})

//delete and answer DELETE /answers/:answerId
router.delete('/answers/:answerId',auth.verifyToken,async function(req,res,next){
    const answerId=req.params.answerId;
    var id=mongoose.Types.ObjectId(answerId);
    //console.log(id);
    try {
        const deletedAnswer= await Answer.findByIdAndDelete(answerId)
        //console.log('deleted answer',deletedAnswer);
         if(deletedAnswer){
            const question=await Question.findOneAndUpdate(
                {_id:deletedAnswer.questionId},
                {$pull:{answers:deletedAnswer._id}},
                {new:true},
                )
                if(question){
                    console.log('deleted answer:',deletedAnswer,'updated question:',question);
                    res.json({answer:deletedAnswer})
                }else{
                    res.json({msg:"Please try again"})
                }
               
         }else{
             res.json({msg:"No answer is available"});
         }
       
       
        
    } catch (error) {
        next(error);
        
    }
})


//GET request on /tags get request
router.get('/tags',async function(req,res,next){
  
    try {
        const tags=await Question.distinct("tags");
        if(tags.length!==0){
            res.json({tags:tags});
        }else{
            res.json({msg:"No tags available"});
        }
       
        res.json({tags:tags})

        
    } catch (error) {
        next(error)
        
    }
})











module.exports = router;