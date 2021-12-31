const db = require("../models");
const UserProfile = db.user_profile;
const Task = db.tasks;
const Brand = db.brands;
const BlackListed = db.blacklisted;
const Campaigns = db.campaigns;
const ContestTask = db.contest_task;
const Comment = db.post_comment;
const Hashtags = db.hashtags;
const SearchResults = db.search_results;
const SearchObjects = db.search_objects;
const Op = db.Sequelize.Op;
const logger = require("../middleware/logger");
const common = require("../common");
const sequelize= require('sequelize');

/**
 * Function to add search objects
 * @param  {object} req expressJs request object
 * @param  {object} res expressJs response object
 * @return {Promise}
*/
exports.addSearchObject = async (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "search Object is required."
    });
    return;
  }
  const searchObjectResult = await SearchObjects.findAll({
    where: {},
    attributes: ['search_obj_category']
  });
  const searchDBCategories = searchObjectResult.map(function (item) {
    return item.search_obj_category
  });
  var searchObjectData = [];
  var SearchData = req.body;
  for (const SearchObject in SearchData) {
    if (searchDBCategories.indexOf(SearchObject) >= 0) {
      SearchObjects.update({
        "is_active": SearchData[SearchObject]
      }, {
        where: {
          search_obj_category: SearchObject
        }
      }).catch(err => {
        logger.log("error", "Some error occurred while updating the Search Objects=" + err);
      });
    } else {
      searchObjectData.push({
        "search_obj_category": SearchObject,
        "is_active": SearchData[SearchObject]
      });
    }
  }
  //res.status(200).send({message:searchObjectData, update : searchUpdateObjectData});

  if (searchObjectData.length) {
    SearchObjects.bulkCreate(searchObjectData).catch(err => {
      logger.log("error", "Some error occurred while creating the Search Objects=" + err);
    });
  }
  res.status(201).send({
    msg: "Search Objects added Successfully"
  });

  return;
}

/**
 * Function to get search object
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.getSearchObject = async (req, res) => {
  const searchObjectResult = await SearchObjects.findAll({
    where: {
      is_active: 1
    },
    order: [
      ['search_obj_id', 'ASC']
    ],
    attributes: ['search_obj_id', 'search_obj_category']
  });

  if (!searchObjectResult) {
    res.status(500).send({
      message: "Record not found"
    });
    return
  }
  res.status(200).send(searchObjectResult);
}

/**
 * Function to get recent search result
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
 exports.searchRecentRecords = async (req, res) => {
    const blackListedList = 
      await BlackListed.findAll();
    const blackListedShorthanded = blackListedList.map(x => x.keyword);
    var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
    var options = {
      where: {
        search_uid: userId
      },
      order: [ [ 'createdAt', 'DESC' ]]
    };
    const Searchdata = await SearchResults.findOne(options);
    if (Searchdata) {
      if(blackListedShorthanded.includes(Searchdata.search_keyword)) {
        res.status(400).send({
          message: "Keyword has been blacklisted."
        });
        return;
      } else {
        res.status(200).send(Searchdata);
        return;
      }
    }
}
/**
 * Function to get search result
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.searchRecords = async (req, res) => {
  const blackListedList = 
    await BlackListed.findAll();
  const blackListedShorthanded = blackListedList.map(x => x.keyword);
  const keyWord = req.query.keyWord;
  const searchObjectValues = await SearchObjects.findAll({
    where: {},
    attributes: ['search_obj_category']
  });
  const searchObjectConstant = common.searchObject();
  const response_data = {};
  if(keyWord && !blackListedShorthanded.includes(keyWord)) {
    /* get Search result from search_results table */
    var userId = req.header(process.env.UKEY_HEADER || "x-api-key");
    var options = {
      where: {
        search_uid: userId
      }
    };
    const Searchdata = await SearchResults.findAll(options);
    var SearchUserCount = Searchdata.length;
    if (Searchdata) {
      for (var i = 0; i < SearchUserCount; i++) {
        var FirstRecordId = Searchdata[0].id;
        if (Searchdata[i].search_keyword == keyWord) {
          res.status(200).send(Searchdata[i].search_results);
          return;
        }
      }
    }
    for (var j = 0; j < searchObjectValues.length; j++) {
      var searchObjectValue = searchObjectValues[j].search_obj_category.toLowerCase();
      if (searchObjectValue == searchObjectConstant.Profile) {
        var userOptions = {
          where: {
            u_display_name: {
              [Op.iLike]: `%${keyWord}%`
            }
          }
        };
        const UserProfileDetails = await UserProfile.findAll(userOptions);
        if (UserProfileDetails.length) {
          var UserProfileDisplayDetails = [];
          for (const UserProfileDetail in UserProfileDetails) {
            UserProfileDisplayDetails.push({
              "u_display_name": UserProfileDetails[UserProfileDetail].u_display_name,
              "u_f_name": UserProfileDetails[UserProfileDetail].u_f_name,
              "u_l_name": UserProfileDetails[UserProfileDetail].u_l_name,
              "u_prof_img_path": UserProfileDetails[UserProfileDetail].u_prof_img_path
            });
          }
          response_data.Profile = UserProfileDisplayDetails;
        }
      }

      if (searchObjectValue == searchObjectConstant.Comments) {
        var commentOptions = {
          where: {
            pc_comments: {
              [Op.iLike]: `%${keyWord}%`
            }
          }
        };
        const CommentsDetails = await Comment.findAll(commentOptions);
        if (CommentsDetails.length) {
          var CommentsDisplayDetails = [];
          for (const CommentsDetail in CommentsDetails) {
            CommentsDisplayDetails.push({
              "pc_comments": CommentsDetails[CommentsDetail].pc_comments,
              "pc_comment_prof_img_url": CommentsDetails[CommentsDetail].pc_comment_prof_img_url
            });
          }
          response_data.Comments = CommentsDisplayDetails;
        }
      }
      if (searchObjectValue == searchObjectConstant.Tasks) {
        var taskOptions = {
          where: {
            ta_name: {
              [Op.iLike]: `%${keyWord}%`
            },
            ta_status: 2
          }
        };
        const TaskDetails = await Task.findAll(taskOptions);
        if (TaskDetails.length) {
          const TaskDisplayDetails = [];
          const TaskDisplayVideoDetails = [];
          for (const TaskDetail in TaskDetails) {
            const TaskData = {
              "ta_name": TaskDetails[TaskDetail].ta_name,
              "ta_desc": TaskDetails[TaskDetail].ta_desc,
              "ta_oneline_summary": TaskDetails[TaskDetail].ta_oneline_summary,
              "ta_post_insp_image": TaskDetails[TaskDetail].ta_post_insp_image,
              "ta_header_image": TaskDetails[TaskDetail].ta_header_image,
              "ta_do": TaskDetails[TaskDetail].ta_do,
              "ta_dont_do": TaskDetails[TaskDetail].ta_dont_do,
              "ta_insta_question": TaskDetails[TaskDetail].ta_insta_question,
              "ta_type": TaskDetails[TaskDetail].ta_type,
              "ta_start_date": TaskDetails[TaskDetail].ta_start_date,
              "ta_end_date": TaskDetails[TaskDetail].ta_end_date
            };
            if (TaskDetails[TaskDetail].ta_type == 3) {
              TaskDisplayVideoDetails.push(TaskData);
            } else {
              TaskDisplayDetails.push(TaskData);
            }
          }
          if (TaskDisplayDetails.length) {
            response_data.Tasks = TaskDisplayDetails;
          }
          if (TaskDisplayVideoDetails.length) {
            response_data.Videos = TaskDisplayVideoDetails;
          }
        }
      }
      if (searchObjectValue == searchObjectConstant.Contest) {
        var contentOptions = {
          where: {
            ct_name: {
              [Op.iLike]: `%${keyWord}%`
            }
          }
        };
        const ContestTaskDetails = await ContestTask.findAll(contentOptions);
        if (ContestTaskDetails.length) {
          const ContestTaskDisplayDetails = [];
          for (const ContestTaskDetail in ContestTaskDetails) {
            ContestTaskDisplayDetails.push({
              "ct_name": ContestTaskDetails[ContestTaskDetail].ct_name,
              "ct_post_insp_image": ContestTaskDetails[ContestTaskDetail].ct_post_insp_image,
              "ct_hashtag": ContestTaskDetails[ContestTaskDetail].ct_hashtag,
              "ct_header_image": ContestTaskDetails[ContestTaskDetail].ct_header_image,
              "ct_winner_token": ContestTaskDetails[ContestTaskDetail].ct_winner_token,
              "ct_type": ContestTaskDetails[ContestTaskDetail].ct_type,
              "ct_start_voting_date": ContestTaskDetails[ContestTaskDetail].ct_start_voting_date,
              "ct_end_voting_date": ContestTaskDetails[ContestTaskDetail].ct_end_voting_date,
              "ct_winner_date": ContestTaskDetails[ContestTaskDetail].ct_winner_date
            });
          }
          response_data.Contest = ContestTaskDisplayDetails;
        }
      }
      if (searchObjectValue == searchObjectConstant.Brand) {
        var brandOptions = {
          /* check active task exist in brand, return param is_task_active 1 if active task exist. */
          include: [
            {
              model: Campaigns,
              required:false,
              attributes:['cp_campaign_id'],
              where : {
                cp_campaign_status: 2
              },
              include: [{
                model: Task,
                required:false,
                where : {
                  ta_status: 2
                },
                  attributes:['ta_name', 'ta_task_id'],
                }]
            }
          ],
          where: {
            cr_co_name: {
              [Op.iLike]: `%${keyWord}%`
            },
            cr_co_status:1
          }
        };
        const BrandTaskDetails = await Brand.findAll(brandOptions);
        if (BrandTaskDetails.length) {
          const BrandTaskDisplayDetails = [];
          for (const BrandTaskDetail in BrandTaskDetails) {
            var isActiveTask = 0;
            if (BrandTaskDetails[BrandTaskDetail].campaigns.length) {
              const BrandCampaigns = BrandTaskDetails[BrandTaskDetail].campaigns;
              for (const BrandCampaign in BrandCampaigns) {
                if (BrandCampaigns[BrandCampaign].tasks.length) {
                  isActiveTask = 1;
                }
              }
            }
            BrandTaskDisplayDetails.push({
              "cr_co_name": BrandTaskDetails[BrandTaskDetail].cr_co_name,
              "cr_co_logo_path": BrandTaskDetails[BrandTaskDetail].cr_co_logo_path,
              "cr_co_cover_img_path": BrandTaskDetails[BrandTaskDetail].cr_co_cover_img_path,
              "is_task_active": isActiveTask
            });
          }
          response_data.Brand = BrandTaskDisplayDetails;
        }
      }
      if (searchObjectValue == searchObjectConstant.Hashtags) {
        var hashtagOptions = {
          where: {
            th_hashtag_values: {
              [Op.iLike]: `%${keyWord}%`
            }
          },
          attributes: [
            'th_hashtag_values',
            [sequelize.fn('COUNT', sequelize.col('th_hashtag_values')), 'hashtag_count']
          ],
          group: ['th_hashtag_values']
        };
        const HashtagsDetails = await Hashtags.findAll(hashtagOptions);
        
        if (HashtagsDetails.length) {
          response_data.Hashtags = HashtagsDetails;
        }
      }
    }
    if (!Object.keys(response_data).length) {
      res.status(500).send({
        message: "Record not found"
      });
      return
    }
    const data = {
      "search_uid": userId,
      "search_date": new Date(),
      "search_keyword": keyWord,
      "search_results": response_data
    }
    if (FirstRecordId && SearchUserCount > common.searchUserCount()) {
      SearchResults.destroy({
        where: { id: FirstRecordId }
      })
    }
    res.status(200).send(response_data);
    SearchResults.create(data)
      .catch(err => {
        logger.log("error", "Some error occurred while creating the Campaign=" + err);
      });
  } else {
    var userOptions = {
      order: db.Sequelize.literal('random()'), limit: 8
    };
    const UserProfileDetails = await UserProfile.findAll(userOptions);
    if (UserProfileDetails.length) {
        var UserProfileDisplayDetails = [];
        for (const UserProfileDetail in UserProfileDetails) {
          UserProfileDisplayDetails.push({
            "u_display_name": UserProfileDetails[UserProfileDetail].u_display_name,
            "u_f_name": UserProfileDetails[UserProfileDetail].u_f_name,
            "u_l_name": UserProfileDetails[UserProfileDetail].u_l_name,
            "u_prof_img_path": UserProfileDetails[UserProfileDetail].u_prof_img_path
          });
        }
        
        response_data.Profile = UserProfileDisplayDetails;
        res.status(200).send(response_data);
        return;
    }
  }
}
