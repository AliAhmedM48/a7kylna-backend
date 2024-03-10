
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const User = require('../models/user');


// Authentication Middleware
exports.protect = async (req, res, next) => {

    //#region Token Authentication Steps
    // ^ 1) Check if the token exists, if exists get the token.
    // ^ 2) Verify the token (no change happens, expired tokens).
    // ^ 3) Check if user exists.
    // ^ 4) Check if user changed his password after the token creation.
    //#endregion

    // ^ 1) Check if the token exists, if exists get the token.
    if (!req.headers.authorization && !(req.headers.authorization?.startWith('Bearer')))
        return res.status(401).json({ message: 'You are not login, Please login to get access this route' });
    const token = req.headers.authorization.split(' ')[1];
    console.log("🚀 ~ exports.protect= ~ token:", token)
    // ^ 2) Verify the token (no change happens, expired tokens).
    let currentUser;
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        console.log("🚀 ~ jwt.verify ~ decoded:", decoded)
        if (err) return res.status(403).json({ message: 'Token expired' });

        currentUser = await User.findById(decoded?.id);

        // ^ 3) Check if user exists.
        if (!currentUser) return res.status(401).json({ message: 'The user that belong to this token does no longer exist' });
        req.user = currentUser
        next();
    });

    // });
};

