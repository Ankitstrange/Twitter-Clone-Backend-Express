const express = require("express");
const tweetRoute = express.Router();

tweetRoute.post("/create",tweeterController.createTweet);
tweetRoute.get("/:tweetId",tweeterController.getTweet);
tweetRoute.get("/all/:userId",tweeterController.getAllTweets);
tweetRoute.delete("/delete/:tweetId",tweeterController.deleteTweet);
tweetRoute.get("/like/:tweetId/:userId",tweeterController.likeTweet);
tweetRoute.get("/dislike/:tweetId/:userId",tweeterController.dislikeTweet);
tweetRoute.get("/retweet/:tweetId/:userId",tweeterController.retweet);
tweetRoute.delete("/undoretweet/:tweetId/:userId",tweeterController.undoRetweet);
tweetRoute.post("/reply/:tweetId",tweeterController.replyTweet);
tweetRoute.get("/likes/:tweetId",tweeterController.getLikeUsers);
tweetRoute.get("/retweets/:tweetId",tweeterController.getRetweetUsers);