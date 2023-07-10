const jwt = require("jsonwebtoken");
const JWT_SECRET = "webTokenSecret-Vedant"

const fetchUser = (req, res, next) => {
    // get user from jwt token and add it to the reuest object.
    const authtoken = req.header('auth-token');
    if (!authtoken) {
        return res.status(401).json({ error: "Please authenticate using a valid token!" })
    }
    try {
        let data = jwt.verify(authtoken, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token!" })
    }
}

module.exports = fetchUser;