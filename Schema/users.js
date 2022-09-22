const { default: mongoose } = require("mongoose");

const UsersSchema = new mongoose.Schema(
    {
        userId:{
            type:Number,
            required:[true,'Field is required'],
            unique:true,
            min:[1,"UserId can't be less than 1"],
        },
        name:{
            type:String,
            required:[true,'Field is required'],
            min:[3,"Name should contain min 3 characters"],
            max:[50,"Name should contain max 50 characters"],
        },
        screenName:{
            type:String,
            required:[true,'Field is required'],
            min:[4,"Screen name should contain min 4 characters"],
            max:[50,"Screen name should contain max 50 characters"],
        },
        description:{
            type:String,
        },
        protected:{
            type:Boolean,
        },
        verified:{
            type:Boolean,
        },
        followingCount:{
            type:Number,
        },
        followersCount:{
            type:Number,
        },
        tweetsCount:{
            type:Number,
        },
        likesCount:{
            type:Number,
        },
        email:{
            type:String,
            required:[true,'Field is required'],
            min:[5,"Email should contain min 5 characters"],
            max:[50,"Email should contain max 50 characters"],
        },
    },
    {
        timestamps:{
            createdAt:true,
            updatedAt:true
        }
    }
);

exports.Users=mongoose.model("users",UsersSchema);