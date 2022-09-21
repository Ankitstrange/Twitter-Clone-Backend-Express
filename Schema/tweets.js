const { default: mongoose } = require("mongoose");

const TweetsSchema = new mongoose.Schema(
    {
        tweetId:{
            type:Number,
            required:[true,'Field is required'],
            unique:true,
            min:[1,"TweetId can't be less than 1"],
        },
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
        },
        repliedUserId:{
            type:Number,
        },
        replyCount:{
            type:Number,
        },
        retweetCount:{
            type:Number,
        },
        favoriteCount:{
            type:Number,
        },
        retweetStatus:{
            type:Number,
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