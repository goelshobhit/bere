module.exports = app => {
    const autocomplete_place = require("../controllers/autocomplete_place.controller.js");
    var router = require("express").Router();
    const auth = require("../middleware/auth");

    /**
   * @swagger
  /**
   * @swagger
   * /api/autocomplete_place:
   *   get:
   *     parameters:
   *         - name: place
   *           in: query
   *           required: false
   *           schema:
   *              type: string
   *     tags:
   *       - Autocomplete Address
   *     description: Returns Autocomplete Listing for Places
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: A list of Autocomplete Places
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
    router.get("/autocomplete_place", auth, autocomplete_place.autocompletePlace);
    
  app.use("/api", router);
};