module.exports = app => {
    const AppSuggestion = require("../controllers/app_suggestion.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    /**
     * @swagger
     * /api/app_suggestion:
     *   post:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        Type Name:
     *                            type: string
     *                        Detail:
     *                            type: string
     *                        Images:
     *                            type: string
     *     tags:
     *       - App Suggestion
     *     description: Add new App Suggestion
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Add new App Suggestion
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
    router.post("/app_suggestion", AppSuggestion.createNewAppSuggestion);

    // Update a Data with id
    /**
     * @swagger
     * /api/app_suggestion/{appSuggestionId}:
     *   put:
     *     requestBody:
     *        required: false
     *        content:
     *            application/json:
     *                schema:
     *                    type: object
     *                    properties:
     *                        u_id:
     *                            type: integer
     *                        feedback_type_name:
     *                            type: string
     *                        feedback_in_detail:
     *                            type: string
     *                        feedback_images:
     *                            type: string
     *     parameters:
     *         - name: appSuggestionId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - App Suggestion
     *     description: Update  Data
     *     produces:
     *       - application/json
     *     responses:
     *       201:
     *         description: Data updated
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
     router.put("/app_suggestion/:appSuggestionId", auth, AppSuggestion.updateAppSuggestion);
    // Retrieve all Data
    /**
     * @swagger
     * /api/app_suggestion:
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
     *              example: app_suggestion_id,u_id,feedback_type_name,feedback_in_detail,feedback_images  # Example of a parameter value
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
     *       - App Suggestion
     *     description: Returns all App Suggestion
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of App Suggestion
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
    router.get('/app_suggestion', auth, AppSuggestion.listing)
    /**
     * @swagger
     * /api/app_suggestion/{appSuggestionId}:
     *   get:
     *     parameters:
     *         - name: appSuggestionId
     *           in: path
     *           required: true
     *           schema:
     *              type: string
     *     tags:
     *       - App Suggestion
     *     description: Retrieve a single heading with appSuggestionId
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Details of a  App Suggestion
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
    router.get("/app_suggestion/:appSuggestionId", auth, AppSuggestion.appSuggestionDetail);

 /**
 * @swagger
 * /api/app_suggestion/{appSuggestionId}:
 *   delete:
 *     parameters:
 *         - name: appSuggestionId
 *           in: path
 *           required: true
 *           schema:
 *              type: integer
 *     tags:
 *      - App Suggestion
 *     description: Delete data with id
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Delete data
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
  router.delete("/app_suggestion/:appSuggestionId", auth, AppSuggestion.deleteAppSuggestion);
    app.use("/api", router);
};