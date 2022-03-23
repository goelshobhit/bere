module.exports = params => {
	const { app, passport } = params;
	var router = require("express").Router();
	/**
	* @swagger
	* /api/users/social_login/facebook:
	*   get:
	*     tags:
	*       - Social Login
	*     description: Login using Facebook
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Login using Facebook
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
	router.get('/users/social_login/facebook', passport.authenticate('facebook', { scope : ['email', 'public_profile'] }));
	router.get('/users/social_login/facebook/callback', function(req, res, next) {
		passport.authenticate("facebook", function (err, user) {
			if (err) { 
				res.status(500).send("Error"); 
			}
			if (user) { 
				res.status(200).send(user); 
			}
		})(req, res, next);
	});
/**
	* @swagger
	* /api/users/social_login/instagram:
	*   get:
	*     tags:
	*       - Social Login
	*     description: Login using Instagram
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Login using Instagram
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
	router.get('/users/social_login/instagram', passport.authenticate('instagram', { scope : ['user_profile', 'user_media'] }));
	router.get('/users/social_login/instagram/callback/', function(req, res, next) {
		passport.authenticate("instagram", function (err, user) {
			if (err) { 
				res.status(500).send("Error"); 
			}
			if (user) { 
				res.status(200).send(user); 
			}
		})(req, res, next);
	});
	/**
	* @swagger
	* /api/users/social_login/twitter:
	*   get:
	*     tags:
	*       - Social Login
	*     description: Login using Twitter
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Login using Twitter
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
	router.get('/users/social_login/twitter', passport.authenticate('twitter'));
	router.get('/users/social_login/twitter/callback/', function(req, res, next) {
		passport.authenticate("twitter", function (err, user) {
			if (err) { 
				res.status(500).send("Error"); 
			}
			if (user) { 
				res.status(200).send(user); 
			}
		})(req, res, next);
	});
	/**
	* @swagger
	* /api/users/social_login/pinterest:
	*   get:
	*     tags:
	*       - Social Login
	*     description: Login using Pinterest
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Login using Pinterest
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
	router.get('/users/social_login/pinterest', passport.authenticate('pinterest'));
	router.get('/users/social_login/pinterest/callback', function(req, res, next) {
		passport.authenticate("pinterest", function (err, user) {
			if (err) { 
				res.status(500).send("Error"); 
			}
			if (user) { 
				res.status(200).send(user); 
			}
		})(req, res, next);
	});
	/**
	* @swagger
	* /api/users/social_login/snapchat:
	*   get:
	*     tags:
	*       - Social Login
	*     description: Login using Snapchat
	*     produces:
	*       - application/json
	*     responses:
	*       200:
	*         description: Login using Snapchat
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
	router.get('/users/social_login/snapchat', passport.authenticate('snapchat'));
	router.get('/users/social_login/snapchat/callback', function(req, res, next) {
		passport.authenticate("snapchat", function (err, user) {
			if (err) { 
				res.status(500).send("Error"); 
			}
			if (user) { 
				res.status(200).send(user); 
			}
		})(req, res, next);
	});
	app.use("/api", router);
};
