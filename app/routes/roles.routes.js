module.exports = app => {
    const Role = require("../controllers/admin_roles.controller.js");
    var router = require("express").Router();
	 const auth = require("../middleware/auth");
	 const access = require("../middleware/access");
    /**
   * @swagger
   * /api/roles:
   *   post:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        Role name:
   *                            type: string
   *                        Role actions:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["user/add", "user/update","user/view","user/list","user/delete", "brand/add", "brand/update","brand/view","brand/list"]
   *                        Role status:
   *                            type: integer
   *     tags:
   *       - Admin Role
   *     description: Add new user role
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Add new role
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
	router.post("/roles",auth,access, Role.createNewRole);
    /**
   * @swagger
   * /api/roles:
   *   get:
   *     parameters:
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
   *              example: ar_role_id,ar_name    # Example of a parameter value
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
   *       - Admin Role
   *     description: Returns all user roles
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of users roles
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
    router.get('/roles',auth,access, Role.listing)
  /**
   * @swagger
   * /api/roles/{roleID}:
   *   get:
   *     parameters:
   *         - name: roleID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Admin Role
   *     description: Retrieve a single Admin role with Role id
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Details of a Admin role
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
    router.get("/roles/:roleID",auth,access, Role.roleDetail);
     /**
   * @swagger
   * /api/roles/{roleID}:
   *   put:
   *     requestBody:
   *        required: false
   *        content:
   *            application/json:
   *                schema:
   *                    type: object
   *                    properties:
   *                        ar_name:
   *                            type: string
   *                        ar_action:
   *                            type: array
   *                            items:
   *                              oneOf:
   *                               type: string
   *                            example: ["user/add", "user/update","user/view","user/list","user/delete", "brand/add", "brand/update","brand/view","brand/list"]
   *                        ar_status:
   *                            type: integer
   *     parameters:
   *         - name: roleID
   *           in: path
   *           required: true
   *           schema:
   *              type: string
   *     tags:
   *       - Admin Role
   *     description: Update Admin role
   *     produces:
   *       - application/json
   *     responses:
   *       201:
   *         description: Admin role updated
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
  router.put("/roles/:roleID",auth,access, Role.updateRole);
    app.use("/api", router);
  };
  