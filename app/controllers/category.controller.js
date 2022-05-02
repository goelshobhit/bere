const db = require("../models");
const Category = db.category;
const audit_log = db.audit_log
const logger = require("../middleware/logger");
const { isNull } = require("util");
const Op = db.Sequelize.Op;
/**
 * Function to add Category
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.addCategory = async (req, res) => {
    const body = req.body;
    if (!req.body["Category Name"]) {
        res.status(400).send({
            msg:
                "Category Name is required"
        });
        return;
    }
    const categoryData = {
        "category_name": body.hasOwnProperty("Category Name") ? req.body["Category Name"] : '',
        "category_type": body.hasOwnProperty("Category Type") ? req.body["Category Type"] : "POST",
        "category_status": body.hasOwnProperty("Category Status") ? req.body["Category Status"] : 1
    }
    Category.create(categoryData)
        .then(data => {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"), 'add', 'Category', data.category_id, data.dataValues);
            res.status(201).send({
                msg: "Category Added Successfully",
                categoryId: data.category_id
            });
        })
        .catch(err => {
            logger.log("error", "Some error occurred while adding the Category=" + err);
            res.status(500).send({
                message:
                    err.message || "Some error occurred while adding the Category."
            });
        });
}


/**
 * Function to get all Categorys
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.categoryListing = async (req, res) => {
    const pageSize = parseInt(req.query.pageSize || 10);
    const pageNumber = parseInt(req.query.pageNumber || 1);
    const skipCount = (pageNumber - 1) * pageSize;
    const sortBy = req.query.sortBy || 'category_id'
    const sortOrder = req.query.sortOrder || 'DESC'
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
            [Op.or]: [{
                cr_co_name: {
                    [Op.iLike]: `%${sortValue}%`
                }
            }
            ]
        } : null;
    }
    if (req.query.categoryId) {
        options['where']['category_id'] = req.query.categoryId;
    }
    var total = await Category.count({
        where: options['where']
    });
    const category_list = await Category.findAll(options);
    res.status(200).send({
        data: category_list,
        totalRecords: total
    });
}

/**
 * Function to get Category Detail
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.categoryDetails = async(req, res) => {
    var options = {
        where: {
            category_id: req.params.categoryId
        }
    };
    const catDetail = await Category.findOne(options);
    if(!catDetail){
        res.status(500).send({
            message: "Category not found"
        });
        return
    }
    res.status(200).send({
        data: catDetail
    });
};

/**
 * Function to update Category
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.updateCategory = async(req, res) => {
    const id = req.params.categoryId;
    var catDetails = await Category.findOne({
        where: {
            category_id: id
        }
    });
    Category.update(req.body, {
		returning:true,
        where: {
            category_id: id
        }
    }).then(function([ num, [result] ]) {
        if (num == 1) {
            audit_log.saveAuditLog(req.header(process.env.UKEY_HEADER || "x-api-key"),'update','Category',id,result.dataValues,catDetails);
            res.status(200).send({
                message: "Category updated successfully."
            });
        } else {
            res.status(400).send({
                message: `Cannot update Category with id=${id}. Maybe Category was not found or req.body is empty!`
            });
        }
    }).catch(err => {
        logger.log("error", err+":Error updating Category with id=" + id);
        res.status(500).send({
            message: "Error updating Category with id=" + id
        });
    });
};

/**
 * Function to delete Category
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */
exports.deleteCategory = async (req, res) => {
    const catDetails = await Category.findOne({
            where: {
                category_id: req.params.categoryId
            }
        });
    if(!catDetails){
        res.status(500).send({
            message: "Could not delete Category with id=" + req.params.categoryId
          });
          return;
    }
    Category.destroy({
        where: { 
            category_id: req.params.categoryId
        }
      })
        .then(num => {
        res.status(200).send({
              message: "Category deleted successfully!"
        });
            return;
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Category with id=" + req.params.categoryId
          });
          return;
        });
    }


