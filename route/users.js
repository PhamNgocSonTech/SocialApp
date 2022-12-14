const router = require("express").Router();
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");
const { verifyToken } = require("../utils/verifyToken");
const User = require("../models/User");
const Post = require("../models/Post");


//SEARCH USER WITH USERNAME
router.get("/search/:username", async (req, res) => {
    try {
        const userGet = await User.find({ username: req.params.username });
        res.status(200).json(userGet);
    } catch (err) {
        return res.status(500).json({ msg: "Something wrong" });
    }
});

//GET USER BY ID
router.get("/get/:id", async (req, res) => {
    try {
        const userGet = await User.findById(req.params.id);
        res.status(200).json(userGet);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//GET LIST USERS
router.get("/getListUsers/", async (req, res) => {
    try {
        const userGet = await User.find();
        res.status(200).json(userGet);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//UPDATE PROFILE AND CHANGE AVATAR
router.put("/updateProfile/:id", verifyToken, upload.single("img"), async (req, res) => {
    // try {
    if (req.params.id === req.user._id) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            let user = await User.findById(req.user._id);
            // Upload image to cloudinary
            let result;
            if (req.file) {
                result = await cloudinary.uploader.upload(req.file.path, {
                    upload_preset: "avatar",
                });
                // Delete image from cloudinary
                await cloudinary.uploader.destroy(user.cloudinary_id);
            }
            const data = {
                $set: req.body,
                avatar: result?.secure_url || user.avatar,
                cloudinary_id: result?.public_id || user.cloudinary_id,
            };
            user = await User.findByIdAndUpdate(req.user._id, data, { new: true });
            //await updateuser.save();
            res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    } else {
        return res.status(400).json("Your are not allow to update this user details ");
    }
    // } catch (error) {
    //   return res.status(500).json("Internal server error");
    // }
});


//DELETE USER
router.delete("/delete/:id", verifyToken, async (req, res) => {
    try {
        if (req.user._id === req.params.id) {
            const userDelete = await User.findById(req.params.id);
            await cloudinary.uploader.destroy(userDelete.cloudinary_id);
            await userDelete.remove();
            res.status(200).json("Delete User Success");
        } else {
            return res.status(403).json("Can't Delete");
        }
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});

//DELETE ALL USER
router.delete("/deleteAll", async (req, res) => {
    try {
        const userDelete = await User.deleteMany();
        res.status(200).json("Delete User Success");
    } catch (err) {
        return res.status(500).json(err);
    }
});

//FOLLOWER USER
router.put("/:id/follow", verifyToken, async (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const user = await User.find({_id: req.params.id, followers: req.user._id})
            if(user.length > 0 ) return res.status(500).json('You followed this user')
            //get id user want to follow
            //push that id user to my followers
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, {
                $push: {followers: req.user._id}
            })

            await User.findOneAndUpdate({_id: req.user._id}, {
                $push: {followings: req.params.id}
            })
            res.status(200).json({
                msg:"User has been followed", 
            })
            
        } catch (err) {
            res.status(500).json({msg: err.message});
        }
    } else {
        res.status(403).json("You can't follow yourself");
    }
});

//UNFOLLOWER USER
router.put("/:id/unfollow", verifyToken, async (req, res) => {
    if (req.user._id !== req.params.id) {
        try {
            const newUser = await User.findOneAndUpdate({_id: req.params.id}, {
                $pull: {followers: req.user._id}
            })

            await User.findOneAndUpdate({_id: req.user._id}, {
                $pull: {followings: req.params.id}
            })
            res.status(200).json({
                msg:"User has been unfollowed", 
            })
            
        } catch (err) {
            res.status(500).json({msg: err.message});
        }
    } else {
        res.status(403).json("You can't unfollow yourself");
    }
});

//FETCHING POST USER FROM FOLLOWING
router.get("/fetchPostFlw/:id", verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const followersPost = await Promise.all(
            user.followings.map((item) => {
                return Post.find({ userId: item });
            })
        );
        const userPost = await Post.find({ userId: user._id });
        res.status(200).json(userPost.concat(...followersPost));
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
});


// GET DETAIL USER FOLLOWINGS BY ID
router.get("/getUserFollowings/:id", async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        const friendFollowing = await Promise.all(
          user.followings.map((friendId) => {
            return User.findById(friendId);
          })
        );
        let friendList = [];
        friendFollowing.map((friend) => {
            if(friend){
                const { _id, username, avatar, fullname, followings, followers } = friend;
                friendList.push({ _id, username, avatar, fullname, followings, followers});
            }
        });
        res.status(200).json(friendList)
      } catch (err) {
        res.status(500).json({msg: err.message});
      }
})

// GET DETAIL USER FOLLOWERS BY ID
router.get("/getUserFollowers/:id", async(req, res)=>{
    try {
        const user = await User.findById(req.params.id);
        const friendsFollower = await Promise.all(
          user.followers.map((friendId) => {
            return User.findById(friendId);
          })
        );
        let friendList = [];
        friendsFollower.map((friend) => {
            if(friend){
                const { _id, username, fullname, avatar, followings, followers } = friend;
                friendList.push({ _id, username, avatar, fullname, followings, followers});
            }
        });
        res.status(200).json(friendList)
      } catch (err) {
        res.status(500).json({msg: err.message});
      }
})




// CANCELED
// router.post("/upload-avatar/:username", upload.single("image"), async (req, res) => {
//   try {
//     // Upload image to cloudinary
//     const result = await cloudinary.uploader.upload(req.file.path);

//     // Create new user
//     let user = new User({
//       username: req.params.username,
//       avatar: result.secure_url,
//       cloudinary_id: result.public_id,
//     });
//     // Save user
//     await user.save();
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

//UPDATE USER OLD VER
// router.put("/update/:id", upload.single("img"), async (req, res) => {
//   if (req.body.userId === req.params.id || req.body.isAdmin) {
//     if (req.body.password) {
//       try {
//         const salt = await bcrypt.genSalt(10);
//         req.body.password = await bcrypt.hash(req.body.password, salt);
//       } catch (err) {
//         return res.status(500).json(err);
//       }
//     }
//     try {
//         const userUpdate = await User.findByIdAndUpdate(req.params.id, {
//         $set: req.body,
//       });
//       console.log(userUpdate)
//       res.status(200).json("Update User Success");
//     } catch (err) {
//       return res.status(500).json(err);
//     }
//   } else {
//     return res.status(403).json("You can update only your account");
//   }
// });

//UPDATE USER WITH IMG CLOUDINARY
// router.put("/update-cloudinary/:id", upload.single("img"), async (req, res) => {
//   try {
//     let user = await User.findById(req.params.id);
//     // Upload image to cloudinary
//     let result;
//     if (req.file) {
//       result = await cloudinary.uploader.upload(req.file.path, {
//         upload_preset: "avatar",
//       });
//       // Delete image from cloudinary
//       await cloudinary.uploader.destroy(user.cloudinary_id);
//     }
//     const data = {
//       $set: req.body,
//       avatar: result?.secure_url || user.avatar,
//       cloudinary_id: result?.public_id || user.cloudinary_id,
//     };
//     user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
//     res.json(user);
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = router;
