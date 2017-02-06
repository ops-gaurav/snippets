/**
 * persisting image does not take place in the database
 * the images are stored in a folder on server and the
 * url is stored in database.
 */
var express = require ('express');
var router = express.Router();


// get image by _id in the database
router.get ('/img/:id', function (req, res) {

});