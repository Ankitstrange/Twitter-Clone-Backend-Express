const { default: mongoose } = require("mongoose");

const TweetsSchema = new mongoose.Schema(
    {
        text:{
            type:String,
            required:[true,'Field is required'],
        },
        source:{
            type:String,
            required:[true,'Field is required'],
        },
        repliedTweetId:{
            type:Number,
            required:[true,'Field is required'],
        },
        repliedUserId:{
            type:Number,
            required:[true,'Field is required'],
        },
        replyCount:{
            type:Number,
            required:[true,'Field is required'],
        },
        retweetCount:{
            type:Number,
            required:[true,'Field is required'],
        },
        favoriteCount:{
            type:Number,
            required:[true,'Field is required'],
        },
        retweetStatus:{
            type:Number,
            required:[true,'Field is required'],
            min:[1,'Invalid Tweet Id'],
        },
        userId:{
            type:Number,
            required:[true,'Field is required'],
            min:[1,'Invalid User Id'],
        },
    },
    {
        timestamps:{
            createdAt:true,
            updatedAt:true
        }
    }
);

exports.Tweets=mongoose.model("tweets",TweetsSchema);