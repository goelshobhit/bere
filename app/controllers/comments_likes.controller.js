const db = require("../models");
const Posts = db.user_content_post;
const Comment = db.post_comment
const CommentLikes=db.comments_likes;
const audit_log = db.audit_log
const Op = db.Sequelize.Op;
const common = require("../common");
const uploadComment = require("../middleware/uploadComment");
/**
 * Function to add new Comment like
 * @param  {object} req expressJs request object
 * @param  {object} res expressJs response object
 * @return {Promise}
*/
exports.createCommentLikes = async (req, res) => {
    const body = req.body;
    if(!req.body["comment_id"]) {
        res.status(400).send({
            message: "comment_id ,Commenter Likes fields are required."
        });
        return;
    }
	var userid=req.header(process.env.UKEY_HEADER || "x-api-key");
	var postId=req.body["comment_id"];
	const CommD = await Comment.findOne({
		attributes:['pc_comment_likes','pc_comment_unlikes'],
        where: {
            pc_post_id: postId
        }
    });
	if(!CommD){
		res.status(404).send({
                message: "Comment id does not exist."
            });
			return;
	}
	var total_likes=0,total_unlikes=0;
	
	
	const commentDetails = await CommentLikes.findOne({
        where: {
            cl_post_id: postId,
			cl_commenter_uid:userid
        },
		attributes:["cl_id","cl_commenter_likes"]
    });	
	if(commentDetails){
		if(commentDetails.cl_commenter_likes!==parseInt(req.body["like"])){
		if(req.body["like"]==1)
		{
			total_likes=parseInt(CommD.pc_comment_likes) ? parseInt(CommD.pc_comment_likes) : 1;
	        total_unlikes=parseInt(CommD.pc_comment_unlikes) ? parseInt(CommD.pc_comment_unlikes)-1 : 0;
		}else{
			total_likes=parseInt(CommD.pc_comment_likes) ? parseInt(CommD.pc_comment_likes)-1 : 0;
	        total_unlikes=parseInt(CommD.pc_comment_unlikes) ? parseInt(CommD.pc_comment_unlikes)+1 : 1;
		}
		console.log(total_likes+" == "+total_unlikes);
		}else{
			total_likes=parseInt(CommD.pc_comment_likes) ? parseInt(CommD.pc_comment_likes) : 0;
	        total_unlikes=parseInt(CommD.pc_comment_unlikes) ? parseInt(CommD.pc_comment_unlikes) : 0;
		}
	}else{		
		if(req.body["like"]==1){
	     total_likes=parseInt(CommD.pc_comment_likes) ? parseInt(CommD.pc_comment_likes)+1 : 1;
	     total_unlikes=parseInt(CommD.pc_comment_unlikes) ? parseInt(CommD.pc_comment_unlikes) : 0;
	    }else{
		total_likes=parseInt(CommD.pc_comment_likes) && parseInt(CommD.pc_comment_likes)>0 ? parseInt(CommD.pc_comment_likes)-1 : 0;
	    total_unlikes=parseInt(CommD.pc_comment_unlikes) ? parseInt(CommD.pc_comment_unlikes)+1 : 1;
	   }
	   console.log(total_likes+" = "+total_unlikes);
	}
	
	Comment.update({
			"pc_comment_likes": total_likes,
			"pc_comment_unlikes": total_unlikes
			}, {
		where: {
		pc_post_id: postId
		}
	});
	if(commentDetails && commentDetails.cl_id){					
		CommentLikes.update({
			"cl_commenter_likes": req.body["like"]
			}, {
		where: {
		cl_id: commentDetails.cl_id
		}
		});
		res.status(201).send({		
		message: req.body["like"] && req.body["like"]>0  ? "Comment liked" : "Comment unliked"
		});
		return;
	}	
    const data = {
        "cl_post_id": req.body["comment_id"],
		"cl_commenter_uid":req.header(process.env.UKEY_HEADER || "x-api-key"),
		"cl_commenter_likes": req.body["like"] ? req.body["like"] : 0
    }
    CommentLikes.create(data)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','comment_likes',data.cl_post_id,data.dataValues);
            res.status(201).send({		
                message: req.body["like"]  && req.body["like"]>0 ? "Comment liked" : "Comment unliked"
            });
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while like the Comment."
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
    const sortBy = req.query.sortBy || 'cl_id'
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
	if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    var total = await CommentLikes.count({
        where: options['where']
    });
    const post_comment_list = await CommentLikes.findAll(options);
    res.status(200).send({
        data: post_comment_list,
        totalRecords: total
    });
}
/**
 * Function to get Comment Likes details
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.commentDetail = async (req, res) => {
    const cID = req.params.id;
    const commentDetails = await CommentLikes.findOne({
        where: {
            cl_id: cID
        }
    });
    if (!commentDetails) {
        res.status(500).send({
            message: "Comment Likes not found"
        });
        return
    }
    res.status(200).send({
        data: commentDetails
    })
}