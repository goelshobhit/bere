const db = require("../models");
const Posts = db.user_content_post;
const postReactions=db.post_user_reactions;
const Op = db.Sequelize.Op;
const common = require("../common");
const audit_log = db.audit_log
/**
 * Function to add new Comment like
 * @param  {object} req expressJs request object
 * @param  {object} res expressJs response object
 * @return {Promise}
*/
exports.createpostReaction = async (req, res) => {
    const body = req.body;
    if(!req.body["Post id"] || !req.body["reaction"]) {
        res.status(400).send({
            message: "Post id ,reaction fields are required."
        });
        return;
    }
	var userid=req.header(process.env.UKEY_HEADER || "x-api-key");
	var postId=req.body["Post id"];
	const postDetails = await Posts.findOne({
		attributes:['ucpl_reaction_counter'],
        where: {
            ucpl_id: postId
        }
    });
    if(!postDetails){
        res.status(400).send({
            message: "post not found."
        });
        return;
    }
	var total_reaction=postDetails.ucpl_reaction_counter ? postDetails.ucpl_reaction_counter : 0;
    const reactDetails = await postReactions.findOne({
		attributes:['pu_re_text'],
        where: {
            u_id: userid,
            ucpl_id:postId
        }
    });
    if(reactDetails){
        postReactions.update({
			"pu_re_text": req.body["reaction"]
			}, {
		where: {
            u_id: userid,
            ucpl_id:postId
		}
        });
        res.status(200).send({		
            message:"Reaction updated"
        });
        return;
    }
    Posts.update({
        "ucpl_reaction_counter": total_reaction+1
        }, {
    where: {
        ucpl_id:postId
    }
    });		
    const data = {
        "u_id": req.header(process.env.UKEY_HEADER || "x-api-key"),
		"ucpl_id":req.body["Post id"],
        "pu_re_text": req.body["reaction"]
    }
    postReactions.create(data)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','post_user_reactions',data.ucpl_id,data.dataValues);
            res.status(200).send({		
                message:"Reaction added"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while add reaction."
            });
        });
}
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
    const sortBy = req.query.sortBy || 'pu_re_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
	
    var postId=parseInt(req.params.postId);
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            ucpl_id:postId
        }
    };
	if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    var total = await postReactions.count({
        where: {
            ucpl_id:postId
        }
    });
    const postReactions_list = await postReactions.findAll(options);
    res.status(200).send({
        data: postReactions_list,
        totalRecords: total
    });
}