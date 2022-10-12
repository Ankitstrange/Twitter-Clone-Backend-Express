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
        if(tweet?.deletedCount===0){
            res.status(404).json({
                message:"No Tweet found"
            });
        } else {
            res.status(200).json({
                message:`Tweet deleted succesfully with id: ${req.params.tweetId}`
            });
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

exports.retweet = async(req, res, next)=>{
    try{
        const tweet = await Tweets.find({tweetId:req.params.tweetId});
        const user = await Users.find({userId:req.params.userId});
        const newTweet = {};
        if(tweet.length===0){
            return res.status(404).json({
                message:`No Tweet found with tweet id: ${req.params.tweetId}`
            });
        }
        if(user.length===0){
            return res.status(404).json({
                message:`No User found with user id: ${req.params.userId}`
            });
        }
        if(tweet[0]?.retweetStatus){
            const originalTweet = await Tweets.find({tweetId:tweet[0].retweetStatus});
            if(originalTweet.length===0){
                return res.status(404).json({
                    message:`No Original Tweet found with retweet id:${tweet[0].retweetStatus}`
                });
            }
            newTweet.userId = user[0].userId;
            newTweet.text = originalTweet[0].text;
            newTweet.source = originalTweet[0].source;
            newTweet.retweetStatus = originalTweet[0].tweetId;
            newTweet.likes = originalTweet[0].likes?originalTweet[0].likes:[];
        } else {
            newTweet.userId = user[0].userId;
            newTweet.text = tweet[0].text;
            newTweet.source = tweet[0].source;
            newTweet.retweetStatus = tweet[0].tweetId;
            newTweet.likes = tweet[0].likes?tweet[0].likes:[];
        }
        const tweetId = await tweetIdGenerator();
        newTweet.tweetId=parseInt(tweetId);
        const reTweet = await Tweets.create(newTweet);
        if(!reTweet){
            res.status(500).json({
                message:"DB Error"
            });
        } else {
            res.status(200).json(reTweet);
        }
    } catch (exception){
        next(exception);
    }
}

exports.getLikeUsers = async(req, res, next)=>{
    try{
        const tweets = await Tweets.find({tweetId:req.params.tweetId});
        if(tweets.length===0){
            return res.status(404).json({
                message:`No Tweet found with tweet Id: ${req.params.tweetId}`
            });
        }
        if(!tweets[0].likes || tweets[0].likes.length===0){
            return res.status(404).json({
                message:`No likes found for tweet Id: ${req.params.tweetId}`
            })
        }
        const userIds = [];
        tweets[0].likes.forEach((like)=>{userIds.push(like.userId?like.userId:null)});
        const likedUser = await Users.find({userId:{$in:userIds}});
        if(likedUser.length===0){
            res.status(404).json({
                message:`No liked users found for tweet Id: ${req.params.tweetId}`
            });
        } else {
            res.status(200).json(likedUser);
        }
    } catch (exception){
        next(exception);
    }
}

exports.getRetweetUsers = async(req, res, next)=>{
    try{
        const tweets = await Tweets.find({tweetId:req.params.tweetId});
        if(tweets.length===0){
            return res.status(404).json({
                message:`No tweet found with tweet Id: ${req.params.tweetId}`
            });
        }
        const retweetUser = await Tweets.find({retweetStatus:req.params.tweetId},{_id:0,userId:1});
        const retweetUserIds = retweetUser.map((tweet)=>{return tweet.userId});
        const users = await Users.find({userId:{$in:retweetUserIds}});
        if(users.length===0){
            res.status(404).json({
                message:`No retweet users found with tweet Id: ${req.params.tweetId}`
            });
        } else {
            res.status(200).json(users);
        }
    } catch (exception){
        next(exception);
    }
}