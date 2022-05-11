const db = require("../models");
var helpSupport = db.help_support;
const logger = require("../middleware/logger");
const Op = db.Sequelize.Op;
const mailer = require("../middleware/mailer.js");
/**
 * Function to send email for support
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.sendhelpSupportEmail = async (req, res) => {
    const body = req.body;
    if (!body["Email"]) {
        return res.status(400).send({
            message: "Email is Required."
        });
    }
    if (!body["Content"]) {
        return res.status(400).send({
            message: "Content is Required."
        });
    }
    var subject = 'Help & Support From Email: '+ body["Email"]
    const emailSupportData = {
        "user_id": req.header(process.env.UKEY_HEADER || "x-api-key"),
        "email": body.hasOwnProperty("Email") ? body["Email"] : '',
        "content": body.hasOwnProperty("Content") ? body["Content"] : ""
    }
    const message = {
        from: process.env.MAIL_FROM || "Socialbrands1@gmail.com",
        to: process.env.MAIL_TO || "Socialbrands1@gmail.com",
        subject: subject,
        html: 'Email : '+body["Email"]+'<br> Content: '+body["Content"]
    };
    mailer.sendMail(message);

    helpSupport.create(emailSupportData)
        .then(data => {
            res.status(201).send({
                msg: "Help Support Record Added Successfully",
                helpSupportId: data.help_support_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Help Support Record=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Help Support Record."
            });
        });
}


/**
 * Function to get all Help and Support Content
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.helpSupportListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'help_support_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if (req.query.sortVal) {
        var sortValue = req.query.sortVal.trim();
        options.where = sortValue ? {
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    var total = await helpSupport.count({
        where: options['where']
    });
    const tips_list = await helpSupport.findAll(options);
    res.status(200).send({
        data: tips_list,
        totalRecords: total
    });
}


