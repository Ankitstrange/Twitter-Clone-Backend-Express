const { Tweets } = require("../Schema/tweets");
const { Users } = require("../Schema/users");
const { userIdGenerator, errorResponse } = require("../Util/util");
const { nameValidator, screenNameValidator, emailValidator } = require("../Util/validators");

exports.getAllUsers = async(req,res,next)=>{
    try{
        const data = await Users.find({});
        if(!data||data.length<1){
            next(errorResponse("No Users availble", 404));
        } else {
            res.status(200).json(data);
        }
    }catch(exception){
        next(exception);
    }
}

exports.addUser = async(req,res,next)=>{
    try{
        if(!nameValidator(req.body.name)){
            next(errorResponse("Name is Invalid", 404));
        }
        if(!screenNameValidator(req.body.screenName)){
            next(errorResponse("Screen Name is Invalid", 404));
        }
        if(!emailValidator(req.body.email)){
            next(errorResponse("Email is Invalid", 404));
        }
        const userByScreenName = await Users.find({screenName:req.body.screenName});
        if(userByScreenName.length>0){
            next(errorResponse("User allready exists with the given username. Please choose other username!", 404));
        }
        const userByEmail = await Users.find({email:req.body.email});
        if(userByEmail.length>0){
            next(errorResponse("Email allready in use. Please enter different email!", 404));
        }
        const body = {};
        body.userId = await userIdGenerator();
        body.screenName=String(req.body.screenName).trim();
        body.name = String(req.body.name).trim().toUpperCase();
        body.description = req.body.description?String(req.body.description).trim():undefined;
        body.protected = req.body.protected?req.body.protected:undefined;
        body.verified = req.body.verified?req.body.verified:undefined;
        body.followingCount = req.body.followingCount?req.body.followingCount:undefined;
        body.followersCount = req.body.followersCount?req.body.followersCount:undefined;
        body.tweetsCount = req.body.tweetsCount?req.body.tweetsCount:undefined;
        body.likesCount = req.body.likesCount?req.body.likesCount:undefined;
        body.email = String(req.body.email).trim();
        const user = await Users.create(body);
        if(!user){
            next(errorResponse("User creation failed", 500));
        } else {
            res.status(200).json(user);
        }
    }catch(exception){
        next(exception);
    }
}

exports.getUser = async(req,res,next)=>{
    try{
        const user = await Users.find({userId:req.params.id});
        if(user.length===0){
            next(errorResponse("User not found", 404));
        } else {
            res.status(200).json(user);
        }
    } catch (exception) {
        next(exception);
    }
}

exports.deleteUser = async(req, res, next)=>{
    try{
        const deletedUser = await Users.deleteOne({userId:req.params.id});
        if(deletedUser?.deletedCount===0){
            next(errorResponse("User not found", 404));
        } else {
            res.status(200).json({
                message:`User has been deleted with id: ${req.params.id}`
            });
        }
    } catch (exception) {
        next(exception);
    }
}

exports.getLikedTweets = async(req, res, next)=>{
    try{
        const tweets = await Tweets.find({userId:req.params.id});
        const filterTweets = tweets.filter(tweet=>{return tweet.likes.length>0});
        if(filterTweets.length==0){
            next(errorResponse("No tweet found with given user Id", 404));
        } else {
            res.status(200).json(filterTweets);
        }
    } catch (exception){
        next(exception);
    }
}

exports.followUser = async(req, res, next)=>{
    try{
        const user = await Users.find({userId:req.params.followerId});
        const userToFollow = await Users.find({userId:req.params.followingId});
        const userAlreadyFollowed = await Users.find({userId:req.params.followerId, following:{$elemMatch:{userId:req.params.followingId}}});
        if(!user||user.length===0){
            next(errorResponse("User does not exist", 404));
        } else if(!userToFollow||userToFollow.length===0){
            next(errorResponse("User to follow does not exist", 404));
        } else if(userAlreadyFollowed.length>0){
            next(errorResponse("User already followed", 404));
        } else {
            const updatedUser = await Users.updateOne({userId:user[0].userId},{$addToSet:{following:{userId:userToFollow[0].userId}}});
            const updatedToFollowUser = await Users.updateOne({userId:userToFollow[0].userId},{$addToSet:{followers:{userId:user[0].userId}}});
            if(updatedUser?.modifiedCount===0 && updatedToFollowUser?.modifiedCount===0){
                next(errorResponse("Follow User failed", 500));
            } else {
                res.status(200).json({message:"User has been followed successfully"});
            }
        }
    } catch (exception) {
        next(exception);
    }
}

exports.unfollowUser = async(req, res, next)=>{
    try{
        const user = await Users.find({userId:req.params.followerId});
        const userToFollow = await Users.find({userId:req.params.followingId});
        const isUserFollowed = await Users.find({userId:req.params.followerId, following:{$elemMatch:{userId:req.params.followingId}}});
        if(!user||user.length===0){
            next(errorResponse("User does not exist", 404));
        } else if(!userToFollow||userToFollow.length===0){
            next(errorResponse("User to follow does not exist", 404));
        } else if(isUserFollowed.length===0){
            next(errorResponse("User not followed", 404));
        } else {
            const updatedUser = await Users.updateOne({userId:user[0].userId},{$pull:{following:{userId:userToFollow[0].userId}}});
            const updatedToFollowUser = await Users.updateOne({userId:userToFollow[0].userId},{$pull:{followers:{userId:user[0].userId}}});
            if(updatedUser?.modifiedCount===0 && updatedToFollowUser?.modifiedCount===0){
                next(errorResponse("Unfollow User failed", 500));
            } else {
                res.status(200).json({message:"User has been unfollowed successfully"});
            }
        }
    } catch (exception) {
        next(exception);
    }
}

exports.getFollowings = async(req, res, next)=>{
    try{
        const checkValidUser = await Users.find({userId:req.params.id});
        if(checkValidUser.length===0){
            next(errorResponse("Invaild User", 404));
        }
        const followings = await Users.find({"followers.userId":req.params.id});
        if(followings!==null&&followings!==undefined){
            res.status(200).json(followings);
        } else {
            next(errorResponse("Get Followings failed", 500));
        }
    } catch (exception){
        next(exception);
    }
}

exports.getFollowers = async(req, res, next)=>{
    try{
        const checkValidUser = await Users.find({userId:req.params.id});
        if(checkValidUser.length===0){
            next(errorResponse("Invaild User", 404));
        }
        const followers = await Users.find({"following.userId":req.params.id});
        if(followers!==null&&followers!=undefined){
            res.status(200).json(followers);
        } else {
            next(errorResponse("Get Followers failed", 500));
        }
    } catch (exception){
        next(exception);
    }
}