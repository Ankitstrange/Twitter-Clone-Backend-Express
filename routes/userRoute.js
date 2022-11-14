const express = require("express");
const userController = require('../Controller/userController');
const userRoute = express.Router();

userRoute.get("",userController.getAllUsers);
userRoute.post("/register",userController.addUser);
userRoute.get("/:id",userController.getUser);
userRoute.get("/likes/:id", userController.getLikedTweets);
userRoute.get("/follow/:followingId/:followerId",userController.followUser);
userRoute.get("/unfollow/:followingId/:followerId",userController.unfollowUser);
userRoute.get("/followings/:id",userController.getFollowings);
userRoute.get("/followers/:id",userController.getFollowers);
userRoute.delete("/delete/:id",userController.deleteUser);
userRoute.post("/loginUser", userController.loginUser);
userRoute.all("*",async(req, res)=>{
    console.log("Invalid path");
    res.status(404).json({
        message:"Invalid Path"
    });
});

module.exports=userRoute;