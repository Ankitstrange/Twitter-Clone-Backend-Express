const { Tweets } = require("../Schema/tweets");
const { Users } = require("../Schema/users");
const { userIdGenerator } = require("../Util/util");
const { nameValidator, screenNameValidator, emailValidator } = require("../Util/validators");

exports.getAllUsers = async(req,res,next)=>{
    try{
        const data = await Users.find({});
        if(!data||data.length<1){
            res.status(400).json({
                message:"No Users availble"
            });
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
            return res.status(404).json({
                message:"Name is Invalid"
            });
        }
        if(!screenNameValidator(req.body.screenName)){
            return res.status(404).json({
                message:"Screen Name is Invalid"
            });
        }
        if(!emailValidator(req.body.email)){
            return res.status(404).json({
                message:"Email is Invalid"
            });
        }
        const userByScreenName = await Users.find({screenName:req.body.screenName});
        if(userByScreenName.length>0){
            return res.status(404).json({
                message:"User allready exists with the given username. Please choose other username!"
            });
        }
        const userByEmail = await Users.find({email:req.body.email});
        if(userByEmail.length>0){
            return res.status(404).json({
                message:"Email allready in use. Please enter different email!"
            });
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
            res.status(500).json({
                message:"User creation failed"
            });
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
            res.status(404).json({
                message:"User not found"
            });
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
            res.status(404).json({
                message:"User not found"
            });
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
            res.status(404).json({
                message:"No tweet found with given user Id"
            });
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
            return res.status(404).json({
                message:"User does not exist"
            });
        } else if(!userToFollow||userToFollow.length===0){
            return res.status(404).json({
                message:"User to follow does not exist"
            });
        } else if(userAlreadyFollowed.length>0){
            return res.status(404).json({
                message:"User already followed"
            });
        } else {
            const updatedUser = await Users.updateOne({userId:user[0].userId},{$addToSet:{following:{userId:userToFollow[0].userId}}});
            const updatedToFollowUser = await Users.updateOne({userId:userToFollow[0].userId},{$addToSet:{followers:{userId:user[0].userId}}});
            if(updatedUser?.modifiedCount===0 && updatedToFollowUser?.modifiedCount===0){
                res.status(404).json({
                    message:"Follow User failed"
                });
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
            return res.status(404).json({
                message:"User does not exist"
            });
        } else if(!userToFollow||userToFollow.length===0){
            return res.status(404).json({
                message:"User to follow does not exist"
            });
        } else if(isUserFollowed.length===0){
            return res.status(404).json({
                message:"User not followed"
            });
        } else {
            const updatedUser = await Users.updateOne({userId:user[0].userId},{$pull:{following:{userId:userToFollow[0].userId}}});
            const updatedToFollowUser = await Users.updateOne({userId:userToFollow[0].userId},{$pull:{followers:{userId:user[0].userId}}});
            if(updatedUser?.modifiedCount===0 && updatedToFollowUser?.modifiedCount===0){
                res.status(404).json({
                    message:"Unfollow User failed"
                });
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
            return res.status(404).json({
                message:"Invaild User"
            });
        }
        const followings = await Users.find({"followers.userId":req.params.id});
        if(followings!==null&&followings!==undefined){
            res.status(200).json(followings);
        } else {
            res.status(404).json({
                message:"Get Followings failed"
            });
        }
    } catch (exception){
        next(exception);
    }
}

exports.getFollowers = async(req, res, next)=>{
    try{
        const checkValidUser = await Users.find({userId:req.params.id});
        if(checkValidUser.length===0){
            return res.status(404).json({
                message:"Invaild User"
            });
        }
        const followers = await Users.find({"following.userId":req.params.id});
        if(followers!==null&&followers!=undefined){
            res.status(200).json(followers);
        } else {
            res.status(404).json({
                message:"Get Followers failed"
            });
        }
    } catch (exception){
        next(exception);
    }
}