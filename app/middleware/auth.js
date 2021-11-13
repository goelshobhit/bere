const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_ACCESS_KEY || "sofNialvAUxPiJQZa7PJtIA";
const jwtExpirySeconds = process.env.JWT_KEY_EXPIRY_TIME || "2h";

module.exports = (req, res, next) => {
    const token = req.header(process.env.TOKEN_HEADER || "x-auth-token");
    const user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
    var payload;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).send({
                message: "Authorization Required"
            });
        }
        return res.status(401).send({
            message: "Authorization Required"
        });
    }
    if (payload.user_id != user_id) {
        return res.status(401).send({
            message: "Authorization Required"
        });
    }

    next();
};