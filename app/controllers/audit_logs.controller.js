const db = require("../models");
const Posts = db.user_content_post;
const postReport=db.post_report;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const common = require("../common");

/**
 * Function to get all reactions of a post
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.listing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'al_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    const body = req.body;
    var options = {
        attributes:[
            ["al_id","log id"],["al_user_id","log user"],["al_action_type","log action"],
            ["al_action_id","log action id"],["al_table","log tbl"],
            ["al_new_values","new values"],["al_prev_values","Old values"],
            ["al_created_at","CreatedAt"],["al_updated_at","updatedAt"]
        ],
        limit: pageSize,
        offset: skipCount,        
        order: [
            [sortBy, sortOrder]
        ],
        where: {
        }
    };
    var total = await audit_log.count({
        where: options['where']
    });
    const postReactions_list = await audit_log.findAll(options);
    res.status(200).send({
        data: postReactions_list,
        totalRecords: total
    });
}