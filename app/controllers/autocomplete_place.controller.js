const db = require("../models");
const audit_log = db.audit_log
/**
 * Function to add Page Location
 * @param  {object}  req expressJs request object
 * @param  {object}  res expressJs response object
 * @return {Promise}
 */

exports.autocompletePlace = async (req, res) => {
    var axios = require('axios');
    if (!req.query.place) {
        res.status(400).send({
            msg:
                "Place Parameter is required"
        });
        return;
    }
    var place = req.query.place;
    var config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + place + '&radius=500&key=AIzaSyDc0FyHkQoLX040CKmw6QpbD_EDchPwXic',
        headers: {}
    };

    axios(config)
        .then(function (response) {
            res.status(200).send({
                msg:
                    response.data
            });
            return;
        })
        .catch(function (error) {
            res.status(500).send({
                error:
                    error
            });
            return;
        });
}


