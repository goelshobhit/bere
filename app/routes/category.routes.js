module.exports = app => {
    const category = require("../controllers/category.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
   * /api/category:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Category Name:
   *                           type: string
   *                        Category Type:
   *                           type: string
   *                        Category Status:
   *                           type: integer
   *     tags:
   *       - Category
   *     description: Add Category
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add Category
   *       422:
   *         description: validation errors
   *       500:
   *         description: Internal server error
   *       401:
   *          description: Unauthorized
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          message:
   *                              type: string
   *                              example: Authorisation Required
   */
    router.post("/category", auth, category.addCategory);

    

    // Retrieve all Category Listing
    /**
     * @swagger
     * /api/category:
     *   get:
     *     parameters:
     *         - name: categoryId
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: pageNumber
     *           in: query
     *           required: false
     *           schema:
     *              type: integer
     *         - name: sortBy
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: category_id,category_name,category_type,category_status    # Example of a parameter value
     *         - name: sortOrder
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *              example: ASC,DESC    # Example of a parameter value
     *         - name: sortVal
     *           in: query
     *           required: false
     *           schema:
     *              type: string
     *     tags:
     *       - Category
     *     description: Returns all Categories
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of Categories
     *       401:
     *          description: Unauthorized
     *          content:
     *              application/json:
     *                  schema:
     *                      type: object
     *                      properties:
     *                          message:
     *                              type: string
     *                              example: Authorisation Required
     */
    router.get('/category', auth, category.categoryListing);

    /**
   * @swagger
   * /api/category/{categoryId}:
   *   get:
   *     parameters:
   *         - name: categoryId
   *           in: path
   *           required: true
   *           schema:
   *              type: integer
   *     tags:
   *       - Category
   *     description: Retrieve Category with categoryId
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Category
   *       401:
   *          description: Unauthorized
   *          content:
   *              application/json:
   *                  schema:
   *                      type: object
   *                      properties:
   *                          message:
   *                              type: string
   *                              example: Authorisation Required
   */
  router.get("/category/:categoryId",auth, category.categoryDetails);

  /**
 * @swagger
 * /api/category/{categoryId}:
 *   put:
 *     requestBody:
 *        required: false
 *        content:
 *            application/json:
 *                schema:
 *                    type: object
 *                    properties:
 *                        category_name:
 *                            format: string
 *                        category_type:
 *                            type: string
 *                        category_status:
 *                            type: interger
 *     parameters:
 *         - name: categoryId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *       - Category
 *     description: Update Category
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: Category updated
 *       422:
 *         description: validation errors
 *       500:
 *         description: Internal server error
 *       401:
 *          description: Unauthorized
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Authorisation Required
 */
 router.put("/category/:categoryId",auth, category.updateCategory);

 /**
 * @swagger
 * /api/category/{categoryId}:
 *   delete:
 *     parameters:
 *         - name: categoryId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - Category
 *     description: Delete Category with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete Category
 *       401:
 *          description: Unauthorized
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          message:
 *                              type: string
 *                              example: Authorisation Required
 */
router.delete("/category/:categoryId", auth, category.deleteCategory);
    
  app.use("/api", router);
};