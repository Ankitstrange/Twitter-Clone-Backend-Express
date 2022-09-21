const { Tweets } = require("../Schema/tweets")

exports.tweetIdGenerator = async()=>{
    const lastCount = await Tweets.find().sort({tweetId:-1}).limit(1);
    console.log(lastCount);
    if(lastCount===null||lastCount===undefined||lastCount.length<=0){
        return 1;
    } else {
        return lastCount[0].tweetId+1;
    }
}