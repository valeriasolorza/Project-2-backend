const bcrypt = require('bcrypt');
const { PRODUCTION } = require('../config/db');
const User = require('../models/User');
const Session = require('../models/Session');
const Favorite = require('../models/Favorite');
const Recipe = require('../models/Recipe');

const saltRounds = 10;

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

function generateToken(n) {
    var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var token = '';
    for(var i = 0; i < n; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
    }
    return token;
}

function generateTokens() {
    const access_token = generateToken(48);
    const access_expiration = new Date(Date.now() + 3600000);
    const refresh_token = generateToken(64);
    const refresh_expiration = new Date(Date.now() + (2 * 24 * 60 * 60 * 1000));
    return { access_token, access_expiration, refresh_token, refresh_expiration };
}

async function validateToken(token) {
    if (!token) {
        return false;
    }
    if(!token.startsWith('Bearer ')) {
        return false;
    }
    var stripToken = token.replace('Bearer ', '');
    const session = await Session.findOne({
        where: {
            token: stripToken
        }
    });
    if (!session) {
        return false;
    }
    if (session.expiration < new Date()) {
        return false;
    }
    return session;
}

exports.validateToken = validateToken;

exports.signUp = async (req, res) => {
    if(!PRODUCTION) {
        res.set('Access-Control-Allow-Origin', '*');
    }
    const { email, username, password } = req.body;
    try {
        if(!email || !username || !password) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }
        if(!validateEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address.' });
        }
        if(username.length < 3) {
            return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
        }
        if(username.length > 10) {
            return res.status(400).json({ message: 'Username must be at most 10 characters long.' });
        }
        if(password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
        }
        const userExists = await User.findOne({ where: { username: username } });
        if (userExists) {
            return res.status(400).json({ message: 'Username is taken.' });
        }
        const emailExists = await User.findOne({ where: { email: email } });
        if (emailExists) {
            return res.status(400).json({ message: 'Email is taken.' });
        }
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const user = await User.create({ email, username, password: hashedPassword });
        const { access_token, access_expiration, refresh_token, refresh_expiration } = generateTokens();
        await Session.create({ userId: user.id, token: access_token, expiration: access_expiration, refreshToken: refresh_token, refreshExpiration: refresh_expiration});
        res.status(200).json({ success: true, message: 'Successfully signed up', access_token: access_token, access_expiration: access_expiration, refresh_token: refresh_token, refresh_expiration: refresh_expiration, userId: user.userId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.signIn = async (req, res) => {
    if(!PRODUCTION) {
        res.set('Access-Control-Allow-Origin', '*');
    }
    const { username, password } = req.body;
    try {
        if(!username || !password) {
            return res.status(400).json({ message: 'Please fill in all fields.' });
        }
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ message: 'Incorrect password.' });
        }
        const { access_token, access_expiration, refresh_token, refresh_expiration } = generateTokens();
        await Session.create({ userId: user.userId, token: access_token, expiration: access_expiration, refreshToken: refresh_token, refreshExpiration: refresh_expiration});
        res.status(200).json({ success: true, message: 'Successfully signed in', access_token: access_token, access_expiration: access_expiration, refresh_token: refresh_token, refresh_expiration: refresh_expiration, userId: user.userId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.signOut = async (req, res) => {
    if(!PRODUCTION) {
        res.set('Access-Control-Allow-Origin', '*');
    }
    const token = req.headers.authorization;
    try {
        const session = await validateToken(token);
        if(!session) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        await Session.destroy({
            where: {
                token: token
            }
        });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(400).json({ success: false });
    }
}

exports.refreshToken = async (req, res) => {
    if(!PRODUCTION) {
        res.set('Access-Control-Allow-Origin', '*');
    }
    const { refresh_token } = req.body;
    try {
        const date = new Date();
        if(!refresh_token) {
            return res.status(400);
        }
        const session = await Session.findOne({
            where: {
                refreshToken: refresh_token
            },
            include: [
                {
                  model: User,
                  as: 'user',
                  attributes: ['userId'],
                }
            ]
        });
        if (!session) {
            return res.status(400).json({ message: 'Invalid refresh token.' });
        }
        if (session.refreshExpiration < new Date()) {
            return res.status(400).json({ message: 'Refresh token expired.' });
        }
        const access_token = generateToken(48);
        const access_expiration = new Date(Date.now() + 3600000);
        session.token = access_token;
        session.expiration = access_expiration;
        await session.save();
        res.status(200).json({ success: true, access_token: access_token, access_expiration: access_expiration, userId: session.userId });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

exports.favorite = async (req, res) => {
    if(!PRODUCTION) {
        res.set('Access-Control-Allow-Origin', '*');
    }
    const token = req.headers.authorization;
    const session = await validateToken(token);
    if(!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = session.userId;
    const { recipeId } = req.body;
    try {
        const existingFavorite = await Favorite.findOne({
            where: { userId, recipeId }
        });
        if (existingFavorite) {
            await Favorite.destroy({
                where: {
                    userId: userId,
                    recipeId: recipeId
                }
            });
            res.json({ success: true, message: "Recipe removed from favorites" });
        } else {
            await Favorite.create({
                userId: userId,
                recipeId: recipeId
            });
            res.json({ success: true, message: "Recipe added to favorites" });
        }
    } catch (error) {
        console.error('Error handling favorite:', error.message);
        res.status(500).json({ message: 'Failed to handle favorite' });
    }
}

exports.getFavorites = async (req, res) => {
    if(!PRODUCTION) {
        res.set('Access-Control-Allow-Origin', '*');
    }
    const token = req.headers.authorization;
    const session = await validateToken(token);
    if(!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = session.userId;
    try {
        const recipeFavorites = await Recipe.findAll({
            include: [
                {
                    model: Favorite,
                    as: 'favorites',
                    where: {
                        userId: userId
                    },
                    attributes: []
                }
            ]
        });
        res.json(recipeFavorites);
    } catch (error) {
        console.error('Error getting favorites:', error.message);
        res.status(500).json({ message: 'Failed to get favorites' });
    }
}