const db = require("../models");
const UserProfile = db.user_profile;
const Task = db.tasks;
const ContestTask = db.contest_task;
const Comment = db.post_comment;
const Op = db.Sequelize.Op;

/**
 * Function to get search result
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.searchRecords = async (req, res) => {
  console.log(req.query.keyWord);
  if (!req.query.keyWord || !req.query.searchObject) {
    res.status(400).send({
      message: "Keyword or searchObject are required parameters."
    });
    return;
  }
  const keyWord = req.query.keyWord;
  const searchObject = req.query.searchObject;
  const searchObjectValues = searchObject.split(",");

  //    var options = {
  //        where: {
  //          $or: [
  //            { 'u_display_name': { like: '%' + keyWord + '%' } },
  //            { '$Comment.pc_comments$': { like: '%' + keyWord + '%' } }
  //            { 'Task.ta_name': { like: '%' + keyWord + '%' } }
  //          ]
  //        },
  //        include: [{ model: Comment,
  //                include: [
  //                        Task
  //                      ]   
  //                }]
  //      };
  // var options = {
  //         where: {
  //           $or: [
  //             { 'u_display_name': { like: '%' + keyWord + '%' } }
  //           ]
  //         }
  //       };

  const response_data = {};

  var searchObjectValuescount = searchObjectValues.length;
  for (i = 0; i < searchObjectValuescount; i++) {
    var searchObjectValue = searchObjectValues[i].toLowerCase();
    if (searchObjectValue == 'profile') {
      var options = {
        // include: [{
        //   model: user_content_post
        // }],
        where: {
          u_display_name: {
            [Op.iLike]: `%${keyWord}%`
          }
        }
      };
      response_data.Profile = await UserProfile.findAll(options);
    }

    if (searchObjectValue == 'comments') {
      var options = {
        where: {
          pc_comments: {
            [Op.iLike]: `%${keyWord}%`
          }
        }
      };
      response_data.Comments = await Comment.findAll(options);
    }
    if (searchObjectValue == 'tasks') {
      var options = {
        where: {
          ta_name: {
            [Op.iLike]: `%${keyWord}%`
          }
        }
      };
      response_data.Tasks = await Task.findAll(options);
    }
    if (searchObjectValue == 'ContestTask') {
      var options = {
        where: {
          $or: [
            { 'ct_name': { [Op.iLike]: `%${keyWord}%` } },
            { 'ct_hashtag': { [Op.iLike]: `%${keyWord}%` } }
          ]
          // ct_name: {
          //   [Op.iLike]: `%${keyWord}%`
          // }
        }
      };
      response_data.Tasks = await ContestTask.findAll(options);
    }

  }

  if (!response_data) {
    res.status(500).send({
      message: "Record not found"
    });
    return
  }
  res.status(200).send(response_data);
}
