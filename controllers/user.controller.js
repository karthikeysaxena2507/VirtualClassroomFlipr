require("dotenv").config();
const User = require("../models/user.model");
const brcypt = require("bcryptjs");
const { OAuth2Client } = require("google-auth-library");
const { v4: uuidv4 } = require("uuid");
const redis = require("../utils/redis"); 
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const checkAuth = async(req, res, next) => {
    try {
        const user = req.user;
        if(user === null) 
        {
            redis.deleteBySessionId(req.cookies.SESSIONID);
            res.clearCookie("SESSIONID");
            res.json("INVALID");
        }
        else 
        {
            let totalUnread = 0;
            for (let tempRoom of user.rooms) 
            {
                const room = await Room.findOne({roomId: tempRoom.roomId});
                if(room) 
                {
                    tempRoom.unreadCount = (room.messages.length - tempRoom.lastCount);
                    if(tempRoom.unreadCount < 0) tempRoom.unreadCount = 0;
                    totalUnread += tempRoom.unreadCount;
                }
            }
            for (let tempChat of user.chats) 
            {
                const room = await Room.findOne({roomId: tempChat.roomId});
                if(room) 
                {
                    tempChat.unreadCount = (room.messages.length - tempChat.lastCount);
                    if(tempChat.unreadCount < 0) tempChat.unreadCount = 0;
                    totalUnread += tempChat.unreadCount;
                }
            }
            user.totalUnread = totalUnread;
            user.save()
            .then(() => {
                res.json({
                    id: user._id,
                    username: user.username,
                    about: user.about,
                    imageUrl: user.imageUrl,
                    totalUnread
                });
            })
            .catch((err) => {
                res.json(err);
            });
        }
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

const registerUser = async(req, res, next) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) 
        {
            res.json("Email already exists");
        }
        else {
            const foundUser = await User.findOne({username, role});
            if(foundUser) 
            {
                res.json("Username already exists");
            }
            else {
                const newUser = new User({
                    username, 
                    password,
                    email,
                    role
                });
                brcypt.genSalt(10, (err, salt) => 
                {
                    if(!err) 
                    {
                        brcypt.hash(newUser.password, salt, (err, hash) => 
                        {
                            if(err) {
                                res.json(err);
                            }
                            else 
                            {
                                newUser.password = hash;
                                newUser.save()
                                .then((user) => {
                                    res.json({
                                        user: {
                                            id: user.id,
                                            username: user.username,
                                            email: user.email,
                                        }
                                    });
                                })
                                .catch((error) => {
                                    res.json(error);
                                });
                            }
                        })
                    }
                })
            }
        }
    }
    catch(error) {
        res.json(next(error));
    }
}

const loginUser = async(req, res, next) => {
    try {
        const {email, password, rememberMe} = req.body;
        email = helper.sanitize(email);
        password = helper.sanitize(password);
        const user = await User.findOne({email});
        if(user) 
        {
            brcypt.compare(password, user.password)
            .then((isMatch) => {
                if(!isMatch) 
                {
                    res.json("Password is not Correct");
                }
                else 
                {
                    if(user.verified) 
                    {
                        const sessionId = uuidv4().replace(/-/g,'');
                        const {id, username, email, verified} = user;
                        if(rememberMe) 
                        {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                secure: true,
                                sameSite: "strict",
                                maxAge: 24*60*60*1000 // (1 DAY)
                            });
                            redis.setRedisValue(sessionId, id, 24*60*60); // 1 DAY
                        }
                        else 
                        {
                            res.cookie("SESSIONID", sessionId, {
                                httpOnly: true,
                                sameSite: true,
                                secure: true
                            });
                            redis.setRedisValue(sessionId, id, 60*60); // 1 HOUR
                        }
                        res.json({user: {id, username, email, verified, sessionId}});
                    }
                    else 
                    {
                        crypto.randomBytes(32, (err, buffer) => 
                        {
                            if(err) 
                            {
                                console.log(err);
                            }
                            const verifyToken = buffer.toString("hex");
                            user.verifyToken = verifyToken;
                            user.expiresIn = Date.now() + 1800000;
                            user.save()
                            .then(() => {
                                sendEmailVerificationMail(verifyToken, user.email);
                                res.json({
                                    user: {
                                        id: user.id,
                                        username: user.username,
                                        email: user.email,
                                        verified: user.verified,
                                        token: verifyToken
                                    }
                                });
                            })
                            .catch((err) => {
                                res.json(err);
                            });
                        });
                    }
                }
            });
        }
        else 
        {
            res.json("User does not exist");
        }
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

const loginWithGoogle = async(req, res, next) => {
    try {   
        var tokenId = req.body.token;
        const response = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID});
        var {email_verified, given_name, email} = response.payload;
        if(email_verified) 
        {
            const user = await User.findOne({email});
            if(user) 
            {
                const sessionId = uuidv4().replace(/-/g,'');
                res.cookie("SESSIONID", sessionId, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "strict",
                    maxAge: 24*60*60*1000
                });
                const {id, username, email} = user;
                redis.setRedisValue(sessionId, id, 24*60*60); 
                res.json({user: {id, username, email}});
            }
            else 
            {
                const newUser = new User({
                    username: given_name,
                    email,
                    about: `Hello, ${given_name} here`,
                    imageUrl: "",
                    totalUnread: 0,
                    verified: true
                });
                newUser.save()
                .then((data) => {
                    const sessionId = uuidv4().replace(/-/g,'');
                    res.cookie("SESSIONID", sessionId, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 7*24*60*60*1000
                    });
                    const {id, username, email} = data;
                    redis.setRedisValue(sessionId, id, 24*60*60);
                    res.json({user: {id, username, email}});
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        }
        else 
        {
            res.json("INVALID");
        }
    }
    catch(error) 
    {
        res.json(next(error));
    }
}

module.exports = {  
    checkAuth, 
    registerUser, 
    loginUser, 
    loginWithGoogle,
}