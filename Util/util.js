const { Tweets } = require("../Schema/tweets");
const { Users } = require("../Schema/users");

exports.tweetIdGenerator = async()=>{
    const lastCount = await Tweets.find().sort({tweetId:-1}).limit(1);
    console.log(lastCount);
    if(lastCount===null||lastCount===undefined||lastCount.length<=0){
        return 1;
    } else {
        return lastCount[0].tweetId+1;
    }
}

exports.userIdGenerator = async()=>{
    const lastCount = await Users.find().sort({userId:-1}).limit(1);
    console.log(lastCount);
    if(lastCount===null||lastCount===undefined||lastCount.length<=0){
        return 1;
    } else {
        return lastCount[0].userId+1;
    }
}

exports.errorResponse = (errorMessage, status)=>{
    let error = new Error(errorMessage);
    error.status = status;
    return error;
}