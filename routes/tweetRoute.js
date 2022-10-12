const express = require("express");
const tweetRoute = express.Router();
const tweeterController = require("../Controller/tweetController")

tweetRoute.post("/create",tweeterController.createTweet);
tweetRoute.get("/:tweetId",tweeterController.getTweet);
tweetRoute.get("/all/:userId",tweeterController.getAllTweets);
tweetRoute.delete("/delete/:tweetId",tweeterController.deleteTweet);
tweetRoute.get("/like/:tweetId/:userId",tweeterController.likeTweet);
tweetRoute.get("/dislike/:tweetId/:userId",tweeterController.dislikeTweet);
tweetRoute.get("/retweet/:tweetId/:userId",tweeterController.retweet);
tweetRoute.delete("/undoretweet/:tweetId",tweeterController.deleteTweet);
tweetRoute.get("/likes/:tweetId",tweeterController.getLikeUsers);
tweetRoute.get("/retweets/:tweetId",tweeterController.getRetweetUsers);
// tweetRoute.post("/reply/:tweetId",tweeterController.replyTweet);
tweetRoute.all("*",async(req, res)=>{
    console.log("Invalid path");
    res.status(404).json({
        message:"Invalid Path"
    });
});

module.exports=tweetRoute;