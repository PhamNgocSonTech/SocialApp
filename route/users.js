const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("../utils/cloudinary");
const upload = require("../utils/multer");

router.get("/", (req, res) => {
  res.send("Welcome to User Route!");
});

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

// SEARCH USER
router.get("/search/:username", async (req, res) => {
  try {
    const userGet = await User.find({username: req.params.username});
    res.status(200).json(userGet);
  } catch (err) {
    return res.status(500).json({msg: 'Something wrong'});
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



//UPDATE USER
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

// UPDATE USER WITH IMG CLOUDINARY
router.put("/update-cloudinary/:id", upload.single("img"), async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    // Upload image to cloudinary
    let result;
    if (req.file) {
      result = await cloudinary.uploader.upload(req.file.path, {upload_preset: 'avatar'});
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(user.cloudinary_id);
    }
    const data = {
      $set: req.body,
      avatar: result?.secure_url || user.avatar,
      cloudinary_id: result?.public_id || user.cloudinary_id,
    };
    user = await User.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(user);
  } catch (err) {
    console.log(err);
  }
});

//DELETE USER
router.delete("/delete/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const userDelete = await User.findById(req.params.id);
      await cloudinary.uploader.destroy(userDelete.cloudinary_id);
      await userDelete.remove();
      res.status(200).json("Delete User Success");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("Can't Delete");
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
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
            await user.updateOne({ $push: { followers: req.body.userId } });
            await currentUser.updateOne({ $push: { followings: req.params.id } });
      res.status(200).json("User has been followed");

      } else {
        res.status(403).json("You already follow this user");
      }
    } catch (err) {
        res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can't follow yourself");
  }
});

//UNFOLLOWER USER
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
              await user.updateOne({ $pull: { followers: req.body.userId } });
              await currentUser.updateOne({ $pull: { followings: req.params.id } });
          res.status(200).json("User has been unfollowed");
        } else {
          res.status(403).json("You don't follow this user");
        }
      } catch (err) {
          res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can't unfollow yourself");
    }
  });

module.exports = router;
