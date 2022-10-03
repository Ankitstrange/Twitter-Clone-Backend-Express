const { Tweets } = require("../Schema/tweets");
const { Users } = require("../Schema/users");
const { tweetIdGenerator } = require("../Util/util")

exports.createTweet = async(req, res, next)=>{
    try{
        const body={};
        body.text=String(req.body.text).trim();
        body.source=String(req.body.source).trim();
        const user = await Users.find({userId:req.body.userId});
        console.log("USer",user);
        if(user.length!=1){
            return res.status(404).json({
                message:"User does not exists"
            });
        }
        body.userId=user[0].userId;
        const tweetId = await tweetIdGenerator();
        body.tweetId=parseInt(tweetId);
        const tweet = await Tweets.create(body);
        if(!tweet){
            res.status(500).json({
                message:"DB Error"
            });
        } else {
            res.status(200).json(tweet);
        }
    } catch (exception){
        next(exception);
    }
}

exports.getTweet = async(req,res, next)=>{
    try{
        const tweet = await Tweets.find({tweetId:req.params.tweetId});
        if(!tweet){
            res.status(404).json({
                message:"Tweet not found"
            });
        } else {
            res.status(200).json(tweet);
        }
    } catch (exception){
        next(exception);
    }
}

exports.getAllTweets = async(req,res,next)=>{
    try{
        const tweets = await Tweets.find({userId:req.params.userId});
        if(!tweets||tweets.length<=0){
            res.status(404).json({
                message:"No Tweet found"
            });
        } else {
            res.status(200).json(tweets);
        }
    } catch (exception){
        next(exception);
    }
}

exports.deleteTweet = async(req,res,next)=>{
    try{
        const tweet = await Tweets.deleteOne({tweetId:req.params.tweetId});
        if(!tweet||tweet.length<=0){
            res.status(404).json({
                message:"No Tweet found"
            });
        } else {
            res.status(200).json({});
        }
    } catch (exception){
        next(exception);
    }
}

exports.likeTweet = async(req,res,next)=>{
    try{
        const tweet = await Tweets.find({tweetId:req.params.tweetId});
        const user = await Users.find({userId:req.params.userId});
        const alreadyLiked = await Tweets.find({tweetId:req.params.tweetId, "likes.userId":req.params.userId});
        if(tweet.length==0){
            return res.status(404).json({
                message:"Tweet not found"
            });
        }
        if(user.length==0){
            return res.status(404).json({
                message:"User not found"
            });
        }
        if(alreadyLiked.length>0){
            return res.status(404).json({
                message:"Tweet already Liked by the User"
            });
        }
        const updateBody = {userId:user[0].userId};
        const updatedTweet = await Tweets.updateOne({tweetId:req.params.tweetId},{$addToSet:{likes:updateBody}});
        if(updatedTweet?.modifiedCount===0){
            res.status(404).json({
                message:"Like tweet failed"
            });
        } else {
            res.status(200).json({message:"Tweet has been liked successfully"});
        }
    } catch (exception){
        next(exception);
    }
}

exports.dislikeTweet = async(req, res, next)=>{
    try{
        const tweet = await Tweets.find({tweetId:req.params.tweetId});
        const user = await Users.find({userId:req.params.userId});
        const ilkeExist = await Tweets.find({tweetId:req.params.tweetId, "likes.userId":req.params.userId});
        if(tweet.length==0){
            return res.status(404).json({
                message:"Tweet not found"
            });
        }
        if(user.length==0){
            return res.status(404).json({
                message:"User not found"
            });
        }
        if(ilkeExist.length==0){
            return res.status(404).json({
                message:"Like does not exist"
            });
        }
        const updatedTweet = await Tweets.updateOne({tweetId:req.params.tweetId},{$pull:{likes:{userId:user[0].userId}}});
        if(updatedTweet?.modifiedCount===0){
            res.status(404).json({
                message:"Dislike tweet failed"
            });
        } else {
            res.status(200).json({message:"Tweet has been disliked successfully"});
        }
    } catch (exception){
        next(exception);
    }
}