const express = require('express');
const router = express.Router();

const {
    signUp,
    signIn,
    refreshToken,
    favorite,
    getFavorites,
    signOut,
} = require('../controllers/accountController');

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/refresh-token', refreshToken);
router.get('/favorites', getFavorites);
router.post('/favorite', favorite);

module.exports = router;