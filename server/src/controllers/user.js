const User = require('../models/User');

exports. getUser = async function (req, res, next) {

    const { id } = req.body;

    const user = await User.findById(id);

    if(!user){
        return res.status(400).json({
            status: "error",
            message: 'User does not exist'
        });
    }

    res.status(200).json({
        success: true,
        user: user
    });
}

exports.updateUser = async function (req, res, next) {
    const { id,  address, bio, facebook, twitter, linkedin, instagram } = req.body;

    const user = await User.findById(id);

    if (!user) {
        return res.status(400).json({
            status: "error",
            message: 'User does not exist'
        });
    }

    if (address) user.address = address;
    if (bio) user.bio = bio;
    if (facebook) user.social.facebook = facebook;
    if (twitter) user.social.twitter = twitter;
    if (linkedin) user.social.linkedin = linkedin;
    if (instagram) user.social.instagram = instagram;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'User updated successfully'
    });
}
