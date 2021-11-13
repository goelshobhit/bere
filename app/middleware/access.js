const db = require("../models");
const Admin = db.admin_users
const Role = db.admin_roles
const Op = db.Sequelize.Op;
var common = require("../common.js");
module.exports = async (req, res, next) => {
    const user_id = req.header(process.env.UKEY_HEADER || "x-api-key");
    var originalUrl = "/api" + req.path;
    var new_url = originalUrl.split("/");
    const lgth = new_url.length;
    var method = req.method.toUpperCase();
    if (lgth > 3 && method=="GET") {
        originalUrl = new_url[0] + "/" + new_url[1] + "/" + new_url[2] + "/1";
    } else {
        originalUrl = new_url[0] + "/" + new_url[1] + "/" + new_url[2];
    }
    var menu = common.userroleActions();
    var validVal = common.getKeys(menu, method + originalUrl);
	console.log(originalUrl+method);
    if (!validVal || validVal.length <= 0) {
        res.status(404).send({
            message: "resource not found"
        });
        return;
    }
    Admin.findOne({
        include: [{
            model: db.admin_roles,
            attributes: ["ar_name"],
            where: {
                ar_action: {
                    [Op.contains]: validVal
                }
            }
        }],
        attributes: ["ar_role_id"],
        where: {
            au_user_id: user_id
        }
    }).then(data => {
        if (!data || data.ar_role_id == null) {
            res.status(403).send({
                message: "access forbidden"
            });
            return;
        }
        next();
    }).catch(err => {
        res.status(403).send({
            message: "access forbidden"
        });
    });
};