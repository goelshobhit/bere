const db = require("../models");
const Posts = db.user_content_post;
const postReport=db.post_report;
const Op = db.Sequelize.Op;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const common = require("../common");
/**
 * Function to add new Comment like
 * @param  {object} req expressJs request object
 * @param  {object} res expressJs response object
 * @return {Promise}
*/
exports.createpostReport = async (req, res) => {
    const body = req.body;
    if(!req.body["Post_id"]) {
        res.status(400).send({
            message: "Post id ,report fields are required."
        });
        return;
    }
	var userid=req.header(process.env.UKEY_HEADER || "x-api-key");
    var postId=req.body["Post_id"];
    var report_question=req.body["Report_question"];
    var report_answer=req.body["Report_answer"];
	var report_type=req.body["Report_Type"].toLowerCase();
    var new_pr_report={
        question:report_question,
        answer:report_answer
    }
    const reportDetails = await postReport.findOne({
        where: {
            u_id: userid,
            ucpl_id:postId,
			pr_report_type:report_type,
            pr_report: {
                question:{
                    [Op.eq]: `${report_question}`
                }
              }
        }
    });
    if(reportDetails){
        postReport.update({
			"pr_report": new_pr_report
			}, {
                returning:true,
		where: {
            pr_id: reportDetails.pr_id
		}
        }).then(function([ rowsUpdate, [result] ]) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','post_report',reportDetails.ucpl_id,result.dataValues,reportDetails);
            res.status(200).send({
                message: "Report updated"
            });
            return;
        }).catch(err => {
            res.status(500).send({
                message: "Error updating Report with id=" + reportDetails.pr_id
            });
            return;
        });
    }	
    const data = {
        "u_id": req.header(process.env.UKEY_HEADER || "x-api-key"),
		"ucpl_id":req.body["Post_id"],
        "pr_report": new_pr_report,
		"pr_report_type":report_type
    }
    postReport.create(data)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','post_report',data.ucpl_id,data.dataValues);
            res.status(200).send({		
                message:"Report added"
            });
            return;
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while add Report."
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
    const sortBy = req.query.sortBy || 'pr_id'
    const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    const body = req.body;
    var postId=req.params.postId;
    var report_type=req.query.report_type;
    var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
	console.log(req.query);
	console.log(req.params);
    var options = {
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {
            ucpl_id:postId,
			pr_report_type:report_type
        }
    };
	if(req.query.sortVal) {
        var sortValue = req.query.sortVal;
        options.where = sortValue ? {
            [sortBy]: `${sortValue}`
        } : null;
    }
    var reportOptions = { 
        attributes:["content_report_type_id"],
        where: {
			content_report_type : 'Post Report',
			content_report_uid : UserId
		}
    };
    
    const contentUserIds = await db.content_report_user.findAll(reportOptions);
    let contentUserIdsValues = [];
    if (contentUserIds.length) {
        contentUserIdsValues = contentUserIds.map(function (item) {
            return item.content_report_type_id
          });
    }
    if (contentUserIdsValues.length) {
        options['where']['pr_id'] = {
                [Op.not]: contentUserIdsValues
            }
    }
    options['where']['is_autotakedown'] = 0;
    var total = await postReport.count({
        where: options['where']
    });
    const postReactions_list = await postReport.findAll(options);
    res.status(200).send({
        data: postReactions_list,
        totalRecords: total
    });
}