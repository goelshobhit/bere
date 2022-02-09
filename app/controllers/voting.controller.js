const db = require("../models");
const Brand = db.brands;
const userLevelTaskAction = db.user_level_task_action;
const userShippingAddress = db.user_shipping_address;
const shippingConfirmation = db.shipping_confirmation;
const voting = db.voting;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;

/**
 * Function to add vote
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addVoting = async (req, res) => {
    const body = req.body;
    if (!req.body["Voting Brand Id"]) {
        res.status(400).send({
            msg:
                "Voting Brand Id is required"
        });
        return;
    }
    var UserId = req.header(process.env.UKEY_HEADER || "x-api-key");
    const votingData = {
        "voting_brand_id": body.hasOwnProperty("Voting Brand Id") ? req.body["Voting Brand Id"] : 0,
        "voter_usr_id": body.hasOwnProperty("Voter User Id") ? req.body["Voter User Id"] : UserId,
        "voting_hashtag": body.hasOwnProperty("Voting Hashtag") ? req.body["Voting Hashtag"] : "",
        "voting_indicator": body.hasOwnProperty("Voting Indicator") ? req.body["Voting Indicator"] : 0,
        "voter_nominator_img": body.hasOwnProperty("Voter Nominator Img") ? req.body["Voter Nominator Img"] : [],
        "voter_nominator_usr_id": body.hasOwnProperty("Voter Nominator Usr Id") ? req.body["Voter Nominator Usr Id"] : [],
        "voted": body.hasOwnProperty("Voted") ? req.body["Voted"] : 0,
        "voted_usr_top": body.hasOwnProperty("Voted Usr Top") ? req.body["Voted Usr Top"] : 0,
        "voter_stars": body.hasOwnProperty("Voter Stars") ? req.body["Voter Stars"] : "",
        "usr_top1": body.hasOwnProperty("Usr Top1") ? req.body["Usr Top1"] : "",
        "usr_top2": body.hasOwnProperty("Usr Top2") ? req.body["Usr Top2"] : "",
        "usr_top3": body.hasOwnProperty("Usr Top3") ? req.body["Usr Top3"] : "",
        "vote_main_instruction": body.hasOwnProperty("Vote Main Instruction") ? req.body["Vote Main Instruction"] : "",
        "vote_sub_instruction": body.hasOwnProperty("Vote Sub Instruction") ? req.body["Vote Sub Instruction"] : "",
        "Vote_rewards1_id": body.hasOwnProperty("Vote Rewards1 Id") ? req.body["Vote Rewards1 Id"] : null,
        "Vote_rewards1_amount": body.hasOwnProperty("Vote Rewards1 Amount") ? req.body["Vote Rewards1 Amount"] : null,
        "Vote_rewards2_id": body.hasOwnProperty("Vote Rewards2 Id") ? req.body["Vote Rewards2 Id"] : null,
        "Vote_rewards2_amount": body.hasOwnProperty("Vote Rewards2 Amount") ? req.body["Vote Rewards2 Amount"] : null
    }
    voting.create(votingData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'voting', data.voting_id, data.dataValues);
            res.status(201).send({
                msg: "Voting Added Successfully",
                votingID: data.voting_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the voting=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the voting."
            });
        });
}


/**
 * Function to get all voting listing
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.votingListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'voting_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    var options = {
        include: [
            {
                model: Brand,
                required: false,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                where: { is_autotakedown: 0 }
            }
        ],
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
    if (req.query.brandId) {
        options['where']['voting_brand_id'] = req.query.brandId;
    }
    var total = await voting.count({
        where: options['where']
    });
    const voting_list = await voting.findAll(options);
    res.status(200).send({
        data: voting_list,
        totalRecords: total
    });
}


