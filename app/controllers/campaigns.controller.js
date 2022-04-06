const db = require("../models");
const Campaign = db.campaigns
const Op = db.Sequelize.Op;
const Brand = db.brands;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const common = require("../common");
const {
    validationResult
} = require("express-validator");
/**
 * Function to add new brand
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.createCampaign = async(req, res) => {
    const body = req.body
	console.log(body);
	const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({
            errors: errors.array()
        });
        return;
    }
    if(!body.hasOwnProperty("Brand ID")){
        res.status(500).send({
            message: "Please Choose One Brand Before Submitting Campaign."
        });
        return;
    }
	var statusCamp=2;
	if(body.hasOwnProperty("Start Date")){
	var date1 = new Date(body["Start Date"]); 
	var date2 = new Date(); 
	if(date1<date2){
		statusCamp=0;
	}	
	}
    const campdata = {
        "cr_co_id": body.hasOwnProperty("Brand ID") ? body["Brand ID"] : 0,
        "cp_campaign_name": body.hasOwnProperty("Campaign Name") ? body["Campaign Name"] : "",
        "cp_campaign_desc": body.hasOwnProperty("Campaign Desc") ? body["Campaign Desc"] : "",
        "cp_campaign_tier": body.hasOwnProperty("Campaign Tier") ? body["Campaign Tier"] : "",
        "cp_campaign_time_completion": body.hasOwnProperty("Completion Time") ? body["Completion Time"] : 0,
        "cp_campaign_completion_rewards": body.hasOwnProperty("Reward") ? body["Reward"] : 0,
        "cp_campaign_aud": body.hasOwnProperty("Audience") ? body["Audience"] : "",
        "cp_campaign_visiblity": body.hasOwnProperty("Visibility Type") ? body["Visibility Type"] : "",
        "cp_campaign_total_budget": body.hasOwnProperty("Campaign Budget") ? body["Campaign Budget"] : 0,
        "cp_campaign_winner_token": body.hasOwnProperty("Winner Token") ? body["Winner Token"] : 0,
        "cp_campaign_start_date": body.hasOwnProperty("Start Date") ? body["Start Date"] : new Date(),
        "cp_campaign_end_date": body.hasOwnProperty("End Date") ? body["End Date"] : new Date(),
		"cp_campaign_token_earned": body.hasOwnProperty("Campaign token to be earned") ? body["Campaign token to be earned"] : 0,
		"cp_campaign_after_coins_spent": body.hasOwnProperty("Continue Campaign after coins spent") ? body["Continue Campaign after coins spent"] : true,
		"cp_campaign_status": body.hasOwnProperty("Campaign status") ? body["Campaign status"] : statusCamp,
		"cp_campaign_target_reach": body.hasOwnProperty("Campaign target reach") ? body["Campaign target reach"] : "",
		"cp_campaign_type": body.hasOwnProperty("Task type") ? body["Task type"] : "",
		"cp_campaign_banner": body.hasOwnProperty("Campaign banner") ? body["Campaign banner"] : "",
    }
	const BrandDetails = await Brand.findOne({
        where: {
            cr_co_id: body["Brand ID"]
        },
		attributes: ["cr_co_alias","cr_co_name"]
    });
	
	var brandAlias=BrandDetails.cr_co_alias;
	if(!BrandDetails.cr_co_alias){
		var brandAlias=BrandDetails.cr_co_name.substring(0,3);
	}
	if(brandAlias){
    Campaign.create(campdata).then(data => {
		var todayTimeStampA=new Date();
		var todayTimeStamp = Date.parse(todayTimeStampA);
		var Alias=brandAlias+"_"+data.cp_campaign_id+"_"+todayTimeStamp;
		Campaign.update({cp_campaign_pid:Alias}, {
			where: {
			cp_campaign_id: data.cp_campaign_id
			}
		}).then(result => {
audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'add','campaign',data.cp_campaign_id,data.dataValues);
        res.status(201).send({			
            msg: "Campaign Created Successfully",
			campID: data.cp_campaign_id
        });
	  });
    }).catch(err => {
        logger.log("error", "Some error occurred while creating the Campaign=" + err);
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Campaign."
        });
    })
	}
};
/**
 * Function to get all campaign
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.campaignListing = async(req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
	const pageNumber = parseInt(req.query.pageNumber || 1);
	const skipCount = (pageNumber - 1) * pageSize;
	const sortBy = req.query.sortBy || 'cp_campaign_id'
	const sortOrder = req.query.sortOrder || 'DESC'
    const sortVal = req.query.sortVal;
    var UserId= req.header(process.env.UKEY_HEADER || "x-api-key");
    const contentUserTaskIds = await common.getContentReportUser(['Brand', 'Campaign'], UserId);
    
    let CampaignIdsValues = [];
    let brandIdsValues = [];
    if (contentUserTaskIds.length) {
        contentUserTaskIds.forEach(element => {
            if (element.content_report_type == 'Brand') {
                brandIdsValues.push(element.content_report_type_id);
            }
            if (element.content_report_type == 'Campaign') {
                CampaignIdsValues.push(element.content_report_type_id);
            }
          });
    }
    var options = {
        include: [
            {
                model: db.brands,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                include: [{
                    model: db.brands_budget,
                    attributes:
                        ["cr_bu_amount", "cr_bu_note","cr_bu_created_at"]
                }],
                where:{is_autotakedown:0}
            }
        ],
        limit: pageSize,
        offset: skipCount,
        order: [
            [sortBy, sortOrder]
        ],
        where: {}
    };
    if(req.query.sortVal){
        var sortValue=req.query.sortVal.trim();
		options.where = sortValue ? {
            [Op.or]: [{
                cp_campaign_name: {
                        [Op.iLike]: `%${sortValue}%`
                    }
                }
            ]
        } : null;			
    }
    if (CampaignIdsValues.length) {
        options['where']['cp_campaign_id'] = {
                [Op.not]: CampaignIdsValues
            }
    }
    if (brandIdsValues.length) {
        options['where']['cr_co_id'] = {
                [Op.not]: brandIdsValues
            }
    }
    options['where']['is_autotakedown'] = 0;
    var total = await Campaign.count({
        where: options['where']
    });
    const campaigns_list = await Campaign.findAll(options);
    res.status(200).send({
        data: campaigns_list,
		totalRecords:total
    });
};
/**
 * Function to get single campaign
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.campaignDetails = async(req, res) => {
    const campaignID = req.params.campaignID;
    var options = {
        include: [
            {
                model: db.brands,
                attributes: [
                    ["cr_co_name", "Brand Name"]
                ],
                include: [{
                    model: db.brands_budget,
                    attributes:
                        ["cr_bu_amount", "cr_bu_note","cr_bu_created_at"]
                }]
            },
			{
                model: db.tasks,
                attributes:["ta_task_id"]
            },
			{
                model: db.contest_task,
                attributes:["ct_id"]
            }
        ],
        where: {
            cp_campaign_id: campaignID
        }
    };
    const campaign = await Campaign.findOne(options);
    if(!campaign){
        res.status(500).send({
            message: "campaign not found"
        });
        return
    }
    res.status(200).send({
        data: campaign
    });
};
/**
 * Function to update single campaign
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateCampaign = async(req, res) => {
    const id = req.params.campaignID;
    var CampaignDetails = await Campaign.findOne({
        where: {
            cp_campaign_id: id
        }
    });
    Campaign.update(req.body, {
		returning:true,
        where: {
            cp_campaign_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','campaign',id,result.dataValues,CampaignDetails);
            res.status(200).send({
                message: "Campaign updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Campaign with id=${id}. Maybe Campaign was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Campaign with id=" + id);
        console.log(err)
        res.status(500).send({
            message: "Error updating Campaign with id=" + id
        });
    });
};