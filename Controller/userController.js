const { Users } = require("../Schema/users");
const { userIdGenerator } = require("../Util/util");

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
        body.name = String(req.body.name).trim();
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