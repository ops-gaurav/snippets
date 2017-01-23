var app = require ('express');
var router = app.Router();
var mongoose = require ('mongoose');

var SnippetModel = require ('../schemas/snippet-model.js');
var Snippets = mongoose.model ('snippets', SnippetModel);

/**
 * get all the snippets for type
 * type maybe java, nodejs etc
 */
router.get ('/snippets/:type', function (req, res) {

    res.type('json');

    var languageType = req.params.type;
    if (languageType == null || languageType == '') {
        res.send ({status: 'error', message: 'No result'});
    } else {
        mongoose.connect ('localhost', 'real-time');

        Snippets.findOne ({name: languageType}, function (err, rawData) {
            if (!err) {
                res.send ({status: 'success', message: 'data found', raw: rawData});
            } else {
                res.send ({status: 'error', message: 'server error'});
            }
        });

        mongoose.disconnect ();
    }
});


router.get ('/snippet/create', function (req, res) {

});

module.exports = router;