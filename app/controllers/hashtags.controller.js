const db = require("../models");
const Hashtag = db.hashtags;
const Op = db.Sequelize.Op;

/**
 * Function to add new Hashtag
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createNewHashtag = async (req, res) => {
    const body = req.body;
    if (!req.body["Hashtag name"]) {
        res.status(400).send({
            message: "Hashtag name is required."
        });
        return;
    }
    const data = {
        "th_hashtag_values": req.body["Hashtag name"]
    }
    Hashtag.create(data)
        .then(data => {
            res.status(201).send({
                msg: "Hashtag Added Successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Hashtag."
            });
        });
}

/**
 * Function to get all Hashtag
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.listing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'th_hashtag_values'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;

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
            th_hashtag_values: {
                [Op.iLike]: `%${sortValue}%`
            }
        } : null;
    }
    var total = await Hashtag.count({
        where: options['where']
    });
    const hashtag_list = await Hashtag.findAll(options);
    res.status(200).send({
        data: hashtag_list,
        totalRecords: total
    });
}