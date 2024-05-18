let Answers = require("../models/answers.js");
let Questions = require("../models/questions.js");

exports.add_new_ans = async (newAnsData, userData, res) => {
    try{      
        let formData = {
            text: newAnsData.text, 
            ans_by: userData._id,
            comments: [],
            upvote: 0,
            downvote: 0,
        }
        //console.log("three");

        let newAns = new Answers(formData);
        //console.log('this is the new answer'); 
        //console.log(newAns); 
        await newAns.save(); 


        let question = await Questions.findById(newAnsData.ansQID);
        //console.log(question);

        await Questions.updateOne(
        {_id: newAnsData.ansQID},
        { $push: { answers: newAns } },
        );
        
        //console.log(question);

        res.send('new answer added into MongoDB' + newAns); 

    }catch(err){
        console.error(err);
    }
}