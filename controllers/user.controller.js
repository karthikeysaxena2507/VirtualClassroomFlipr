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
            res.json({
                id: user._id,
                username: user.username,
                role: user.role
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
        else 
        {
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
        const { email, password, role } = req.body;
        console.log(email, password, role);
        const user = await User.findOne({email, role});
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
                    const sessionId = uuidv4().replace(/-/g,'');
                    const { id, username, email } = user;
                    res.cookie("SESSIONID", sessionId, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 60*60*1000 // (1 HOUR)
                    });
                    redis.setRedisValue(sessionId, id, 60*60); // 1 HOUR
                    res.json({user: {id, username, email, sessionId}});
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
        var role = req.body.role;
        const response = await client.verifyIdToken({idToken: tokenId, audience: process.env.GOOGLE_CLIENT_ID});
        var {email_verified, given_name, email} = response.payload;
        if(email_verified) 
        {
            const user = await User.findOne({email});
            if(user) 
            {
                if(role === user.role) 
                {
                    const sessionId = uuidv4().replace(/-/g,'');
                    res.cookie("SESSIONID", sessionId, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 60*60*1000
                    });
                    const {id, username, email} = user;
                    redis.setRedisValue(sessionId, id, 60*60); 
                    res.json({user: {id, username, email}});
                }
                else 
                {
                    res.json("INVALID");
                }
            }
            else 
            {
                const newUser = new User({
                    username: given_name,
                    email,
                    role
                });
                newUser.save()
                .then((data) => {
                    const sessionId = uuidv4().replace(/-/g,'');
                    res.cookie("SESSIONID", sessionId, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 60*60*1000
                    });
                    const {id, username, email} = data;
                    redis.setRedisValue(sessionId, id, 60*60);
                    res.json({user: {id, username, email, role}});
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

const logout = async(req, res, next) => {
    try 
    {
        const user = req.user;
        redis.deleteBySessionId(req.cookies.SESSIONID);
        res.clearCookie("SESSIONID");
        res.json("LOGGED OUT");
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
    logout
}