const { campaigns } = require("../models");
module.exports = app => {
	const Search = require("../controllers/search.controller");
	var router = require("express").Router();
	const auth = require("../middleware/auth");
	const access = require("../middleware/access");
    
    router.get('/search',auth, Search.searchRecords);
    app.use("/api", router);
}