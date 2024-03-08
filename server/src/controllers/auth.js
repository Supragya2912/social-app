const jwt = require('jsonwebtoken')
const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshTokens');


const registerUser = async (req, res) => {
    try {
        const { email, password, userName, confirmPassword } = req.body;
        (email, password, userName, confirmPassword);

        
        if (!userName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }


        const existingUser = await User.findOne({ $or: [{ email: email }, { userName: userName }] });
       

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const hashConfirmPassword = await bcrypt.hash(confirmPassword, salt);

        const newUser = new User({
            email: email,
            password: hashedPassword,
            userName: userName,
            confirmPassword: hashConfirmPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, userName: newUser.userName },
            process.env.SECRET_KEY,
            { expiresIn: '1h' } 
        );

        res.status(200).json({
            success: true,
            message: 'User created successfully',
            token: token
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong !!'

        });
    }
};
const generateRefreshToken = () => crypto.randomBytes(10).toString('hex');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing_user = await User.findOne({ email });

        if (!existing_user) {
            return res.status(400).json({
                status: "error",
                message: 'User does not exist'
            });
        }
       

        const passwordCompare = await bcrypt.compare(password, existing_user.password);

        if (!passwordCompare) {
            return res.status(400).json({
                status: "error",
                message: 'Invalid credentials'
            });
        }

        const accessToken = jwt.sign({ id: existing_user._id },process.env.SECRET_KEY,{ expiresIn: 60_000 });

        const refreshToken = generateRefreshToken();
        const refToken = new RefreshToken({refreshToken, userId: existing_user._id});
        
        await refToken.save();
        await existing_user.save();
      
        existing_user.refreshToken = refreshToken;

        const user = {
            _id: existing_user._id,
            userName: existing_user.userName,
            email: existing_user.email,
            accessToken: accessToken,
            refreshToken: existing_user.refreshToken
        }
   
        await existing_user.save();

        res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, maxAge: 60_000, overwrite: true });
        res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: false, maxAge: 864_000_000, overwrite: true  });

        res.status(200).json({
            status: 'success',
            message: 'User logged in successfully',
            data: user,
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: "Something went wrong !!"
        });
    }
};

const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
      
        const user = await User.findOne({ email: email });
       

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000); 
        user.resetPasswordOtp = otp;

       
        user.resetPasswordExpiresAt = new Date(Date.now() + 5 * 60 * 1000); 
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.SENDER_MAIL, 
                pass: process.env.SENDER_PASS
            }
        });

        const mailOptions = {
            from: 'YOUR EMAIL ADDRESS',
            to: user.email,
            subject: 'Reset Password OTP',
            text: `Your OTP to reset the password is: ${otp}\n\n`
                + `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).json({
                    status: 'error',
                    message: 'Failed to send OTP email'
                });
            }
         
            res.status(200).json({
                status: 'success',
                message: 'OTP email sent'
            });
        });
    } catch (err) {
      
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

const resetPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'User not found'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

  
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Password reset successfully'
        });
    } catch (err) {
        console.error('Error resetting password:', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

const protect = async (req, res, next) => {
    try {
      
        const accessToken = req.cookies.accessToken;

        if (!accessToken ) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - Token missing'
            });
        }
 
        const decodedAccessToken = jwt.verify(accessToken, process.env.SECRET_KEY);
        const userId = decodedAccessToken.id;
        const userProf = await User.findOne({ _id: userId });
        userProf.password = undefined;
        userProf.confirmPassword = undefined;
   

        if (!userProf) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - User not found'
            });
        }
    
        // Todo: add important fields of user object, except password
        req.user = userProf;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            // Handle token expiration
            res.clearCookie('accessToken');
            req.session.destroy();
            res.sendStatus(401);
        } else {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Something went wrong !!'
            });
        }
    }
};

const me = async (req, res) => {
    res.json(req.user);
};

const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = req.cookies;
        await RefreshToken.deleteOne({ refreshToken: refreshToken });
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({
            status: 'success',
            message: 'User logged out successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    console.log({refreshToken});
    if (!refreshToken) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized - Token missing'
        });
    }
    try {
        const existingToken = await RefreshToken.findOne({ refreshToken: refreshToken });
        console.log({existingToken});

        if (!existingToken) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized - Invalid token'
            });
        }
        const accessToken = jwt.sign({ id: existingToken.userId },process.env.SECRET_KEY,{ expiresIn: 60_000 });
        await RefreshToken.deleteOne({ refreshToken: refreshToken });

        const newRefreshToken = generateRefreshToken();
        const refToken = new RefreshToken({refreshToken: newRefreshToken, userId: existingToken.userId});
        await refToken.save();
    
        res.cookie('accessToken', accessToken, { httpOnly: true, secure: false, maxAge: 60_000, overwrite: true });
        res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: false, maxAge: 864_000_000, overwrite: true });
        res.json({
            status: 'success',
            message: 'Token refreshed successfully'
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    protect,
    forgotPassword,
    resetPassword,
    me,
    logoutUser,
    refreshToken
};
