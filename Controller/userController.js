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
        if(userByScreenName||userByScreenName.length>0){
            return res.status(404).json({
                message:"User allready exists with the given username. Please choose other username!"
            });
        }
        const userByEmail = await Users.find({email:req.body.email});
        if(userByEmail||userByEmail.length>0){
            return res.status(404).json({
                message:"Email allready in use. Please enter different email!"
            });
        }
        const body = {};
        body.userId = userIdGenerator();
        body.screenName=String(req.body.screenName).trim();
        body.name = String(req.body.name).trim();
        body.description = req.body.description?String(req.body.description).trim():undefined;
        body.protected = req.body.protected?req.body.protected:undefined;
    }catch(exception){
        next(exception);
    }
}