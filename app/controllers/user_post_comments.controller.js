const db = require("../models");
const Posts = db.user_content_post;
const Comment = db.post_comment
const CommentLikes=db.comments_likes;
const audit_log = db.audit_log
const Op = db.Sequelize.Op;
const common = require("../common");
const uploadComment = require("../middleware/uploadComment");
const { Console } = require("winston/lib/winston/transports");
/**
 * Function to add new Comment
 * @param  {object} req expressJs request object
 * @param  {object} res expressJs response object
 * @return {Promise}
*/
exports.createPostComment = async (req, res) => {
	try {
    const body = req.body;
	var media = [];
	await uploadComment(req, res);
	if (req.files.length > 0) {
		 for (i in req.files) {
		   var item = req.files[i].filename;
		    media.push(item);
		 }
	}
    if(!req.body["Post id"] || !req.body["Comment"]) {
        res.status(400).send({
            message: "Post id ,comment text fields are required."
        });
        return;
    }
	var comment_id=req.body["comment_id"] ? req.body["comment_id"] : null
	var commnetpId=req.body["comment_mid"] ? req.body["comment_mid"] : comment_id; 
	if(req.body["comment_id"]){
		const commentDetails = await Comment.findOne({
			attributes:["pc_comment_id"],
        where: {
            pc_post_id: req.body["comment_id"]
        }
        });
		console.log(commentDetails.pc_comment_id);
		if(commentDetails && commentDetails.pc_comment_id){
			commnetpId=commentDetails.pc_comment_id;
		}
	}  
    
    const data = {
        "ucpl_id": req.body["Post id"],
		"pc_commenter_uid":req.header(process.env.UKEY_HEADER || "x-api-key"),
		"pc_comments": req.body["Comment"] ? req.body["Comment"] : "",
		"pc_comment_prof_img_url":media,
		"pc_comment_likes":0,
        "pc_comment_unlikes":0,
        "pc_comment_id": req.body["comment_id"] ? req.body["comment_id"] : null,
        "pc_comment_mid": commnetpId,
    }
	console.log(data);
    Comment.create(data)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','post_comment',data.ucpl_id,data.dataValues);
            res.status(201).send({	
                comment_id:data.pc_post_id,		
                message: "Comment Added Successfully"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Comment."
            });
        });
	}catch (error) {
        if (error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).send({
                message: "Too many files to upload."
            });
        }
        return res.status(500).send({
            message: `Error when trying upload many files: ${error}`
        });
    }
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
    const sortBy = req.query.sortBy || 'pc_post_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;

    var options = {
        attributes: [["pc_comments", "comment_message"],
        ["pc_comment_likes", "comment_likes"],
        ["pc_comment_unlikes", "comment_unlikes"],"pc_commenter_uid",
        ["pc_created_at","createdAt"],["pc_updated_at","updatedAt"]
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
	if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `%${sortValue}%`
        } : null;
    }
    var total = await Comment.count({
        where: options['where']
    });
    const post_comment_list = await Comment.findAll(options);
    res.status(200).send({
        data: post_comment_list,
        totalRecords: total
    });
}
/**
 * Function to get all Hashtag
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.postCommentslisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'pc_post_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
	const postId = req.query.postId;
   var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
    var options = {
	include: [{
            model: db.user_profile,
            attributes: [["u_display_name", "comment_username"],["u_prof_img_path", "comment_user_imagpath"]],
        }
    ],
        limit: pageSize,
		attributes: [["pc_post_id",'comment_id'],["ucpl_id",'post_id'],["pc_comment_mid",'comment_mid'],["pc_comments", "comment_message"],
        ["pc_comment_likes", "comment_likes"],
        ["pc_comment_unlikes", "comment_unlikes"],"pc_commenter_uid",
        ["pc_created_at","createdAt"],["pc_updated_at","updatedAt"],
        [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment as commentor WHERE commentor.pc_comment_mid = post_comment.pc_post_id)'), 'total_reply'],
        [db.sequelize.literal('(SELECT cl_commenter_likes FROM comment_likes  WHERE cl_commenter_uid = '+UserId+' and cl_post_id=post_comment.pc_post_id  )'), 'like_on_comment']
        ],
        offset: skipCount,
		//order :[[ db.sequelize.literal("pc_post_id <> '342'")]],
        order: [
            ['pc_comment_likes', 'DESC'],
            ['pc_created_at', 'DESC']
            ],
        where: {
            ucpl_id:postId,
            pc_comment_id:{
                [Op.eq]:null
            }
		}
    };
	if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `%${sortValue}%`
        } : null;
    }
    var allComments = await Comment.count({
        where: {
			ucpl_id:postId
		}
    });
	var total = await Comment.count({
        where: options['where']
    });
    const post_comment_list = await Comment.findAll(options);
    res.status(200).send({
        data: post_comment_list,
        totalRecords: total,
		totalComments: allComments
    });
}
/**
 * Function to get all Hashtag
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.Commentslisting = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'pc_post_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
	const postId = req.query.comment_id;
	 var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");

    var options = {
		include: [{
            model: db.user_profile,
            attributes: [["u_display_name", "comment_username"],["u_prof_img_path", "comment_user_imagpath"]],
        }],
        limit: pageSize,
		attributes: [["pc_post_id",'comment_id'],["ucpl_id",'post_id'],["pc_comment_mid",'comment_mid'],["pc_comments", "comment_message"],
        ["pc_comment_likes", "comment_likes"],
        ["pc_comment_unlikes", "comment_unlikes"],"pc_commenter_uid",
        ["pc_created_at","createdAt"],["pc_updated_at","updatedAt"],
        [db.sequelize.literal('(SELECT COUNT(*) FROM post_comment as commentor WHERE (commentor.pc_comment_id = post_comment.pc_post_id OR commentor.pc_comment_id = post_comment.pc_comment_mid))'), 'total_reply'],
		[db.sequelize.literal('(SELECT cl_commenter_likes FROM comment_likes  WHERE cl_commenter_uid = '+UserId+' and cl_post_id=post_comment.pc_post_id  )'), 'like_on_comment']
        ],
        offset: skipCount,
        order: [ 
            ['pc_created_at', 'ASC'],
			['pc_comment_likes', 'DESC']
            ],
        where: {
            pc_comment_mid:postId
		}
    };
	if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `%${sortValue}%`
        } : null;
    }
    var total = await Comment.count({
        where: options['where']
    });
    const post_comment_list = await Comment.findAll(options);
    res.status(200).send({
        data: post_comment_list,
        totalRecords: total
    });
}
/**
 * Function to get Post details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.commentDetail = async (req, res) => {
    const cID = req.params.id;
    const commentDetails = await Comment.findOne({
        where: {
            pc_post_id: cID
        }
    });
    if (!commentDetails) {
        res.status(500).send({
            message: "post not found"
        });
        return
    }
    res.status(200).send({
        data: commentDetails,
		media_token: common.imageToken(cID)
    })
}
/**
 * Function to delete  comment
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteComment = async (req, res) => {
const commentDetails = await Comment.findOne({
        where: {
            pc_post_id: req.params.comment_id,
			pc_commenter_uid:req.header(process.env.UKEY_HEADER || "x-api-key")
        }
    });
if(!commentDetails){
	res.status(500).send({
        message: "Could not delete Comment with id=" + req.params.comment_id
      });
      return;
}
console.log(req.params.comment_id);
Comment.destroy({
    where: { pc_post_id: req.params.comment_id,
	pc_commenter_uid:req.header(process.env.UKEY_HEADER || "x-api-key")
	}
  })
    .then(num => {
     audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'delete','post_comment',req.params.comment_id,commentDetails.dataValues);
Comment.destroy({
    where: {
	pc_comment_id: req.params.comment_id,
	pc_commenter_uid:req.header(process.env.UKEY_HEADER || "x-api-key")
	}
  });
Comment.destroy({
    where: {
	pc_comment_mid: req.params.comment_id,
	pc_commenter_uid:req.header(process.env.UKEY_HEADER || "x-api-key")
	}
});
    res.status(200).send({
          message: "Comment deleted successfully!"
    });
        return;
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Comment with id=" + req.params.comment_id
      });
      return;
    });
}
