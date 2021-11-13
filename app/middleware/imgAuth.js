const jwt = require("jsonwebtoken");
const jwtKey = process.env.JWT_ACCESS_KEY || "sofNialvAUxPiJQZa7PJtIA";
const jwtExpirySeconds = process.env.JWT_KEY_EXPIRY_TIME || "2h";
module.exports = (req, res, next) => {
	const token = req.params.media_token;
    const action_id = req.params.action_id;
    var payload;
    try {
        payload = jwt.verify(token, jwtKey);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(400).send({
                message: "Image Authorization Required"
            });
        }
        console.log("return a bad request error for image");
        return res.status(400).send({
            message: "Image Authorization Required"
        });
    }
    if (payload.action_id != action_id) {
        console.log("Token mismatch for unauthorized image ");
        return res.status(401).send({
            message: "Authorization Required"
        });
    }
    next();
};