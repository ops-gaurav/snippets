/**
 * the snippets router for handling api/snippets REST requests
 * this snippet handles both
 */
var app = require ('express');
var router = app.Router();
var mongoose = require ('mongoose');
var es6Promise = require ('es6-promise').Promise;

var LanguageModuleModel = require ('../schemas/language-module-model.js');
var LanguageModule = mongoose.model ('snippets', LanguageModuleModel);
/**
 * get all the snippets for type
 * type maybe java,
 *  nodejs etc
 */

var config = require ('../data/data.js');

/**
 * find the snippet with id snippetId under the language module languageType
 */
router.get ('/lookup_snippet/:languageType/:snippetId', (req, res) => {
    res.type ('json');

    var languageType= req.params.languageType;
    var snippetId = req.params.snippetId;

    mongoose.Promise = es6Promise;
    mongoose.connect ('localhost', 'real-time');

    LanguageModule.findOne ({name: languageType}, (err, doc) => {
        if (err) {
            res.send ({status: 'error', message: 'Some server error'});
        } else {
            if (doc) {

                var requestedSnippet = doc.snippets.id (snippetId);
                if (requestedSnippet)
                    res.send ({status: 'success', doc: requestedSnippet});
                else 
                    res.send ({status: 'error', message: 'requested snippet not found'});

                mongoose.disconnect();
            } else {
                mongoose.disconnect();
                res.send ({status: 'error', message: 'No language found with name '+ languageType});
            }
        }
    });
});

/**
 * get the language module specified by languageType
 * this request is different from api/snippets/:languageType/:snippetId as this request returns the snipped specified
 * by id under the languageType but this api will return whole language module document that contains an array of snippets
 */
router.get ('/lookup_lang/:languageType', function (req, res) {

    res.type('json');

    var languageType = req.params.languageType;
    if (languageType == null || languageType == '') {
        res.send ({status: 'error', message: 'No result'});
    } else {
        mongoose.Promise = es6Promise;
        mongoose.connect ('localhost', 'real-time');

        LanguageModule.findOne ({name: languageType}, function (err, rawData) {
            if (!err) {
                res.send ({status: 'success', message: 'data found', raw: rawData});
            } else {
                res.send ({status: 'error', message: 'server error'});
            }
        });

        mongoose.disconnect ();
    }
});

// router to lookup all the languages in the database
// returns the list of language names as array
router.get ('/languages', (req, res) => {
    res.type ('json');

    mongoose.prommise = es6Promise;

    mongoose.connect (config.host, config.db);

    LanguageModule.find ({}, (err, rawData) => {
        if (!err) {
            if (rawData) {
                var resData = [];
                rawData.forEach ((obsolete, value, raw) => {
                    resData.push (obsolete.name);
                });

                res.send ({status: 'success', data: resData});
                mongoose.disconnect();
            }
        } else {
            mongoose.disconnect ();
            res.send ({status:'error', message: 'server error'});
        }
    });
});

// api to create a new snippet. The request will also create a
// new language module if it doesn't exists so.
router.post ('/create/:languageName', function (req, res) {
    res.type ('json');

    // snippte id is used to fetch the snippet and then add the new snippet send in the 
    // request body to the requested snippet collection

    var language = req.params.languageName;
    var newSnippet = req.body.snippet;

    if (newSnippet == null || newSnippet == undefined) {
        res.send ({status: 'error', message:'empty request'});
    } else {

        mongoose.Promise = es6Promise;
        mongoose.connect ('localhost', 'real-time');
        
        LanguageModule.findOne({name: language}, function (error, document) {
            if (error) {
                res.send ({status: 'error', message: 'No snippet with this id'});
            } else {
                if (document == null) {

                    // if there is no snippet with this id...create one

                    var languageModule = new LanguageModule;
                    languageModule.name = language;
                    languageModule.keywords = [language, language+' programming', 'programming in '+ language];

                    var snippetDocument = {
                        snippetTitle: newSnippet.title,
                        snippetText: newSnippet.snippet,
                        footnotes: new Array
                    };

                    languageModule.snippets = [snippetDocument];

                    languageModule.save (function(error, row, affected) {
                        if (error)
                            res.send ({status:'error', message:'error saving snippet'});
                        else 
                            res.send ({status: 'success', message: 'saved document.'});
                        
                        mongoose.disconnect();
                    });

                } else {

                    document.snippets.push({
                        snippetTitle: newSnippet.title,
                        snippetText: newSnippet.snippet,
                        footnotes: new Array
                    });

                    document.save (function (err, row, affected) {
                        if (err) {
                             res.send ({status: 'error', message: 'error saving snippet'});  
                        } else {
                            res.send({status:'success', message: 'snippet has been saved'});
                        }

                        mongoose.disconnect();
                    });
                }
            }
        });
    }
});

// update am existing snippet
router.put ('/update', function (req, res) {
    res.type('json');
    // get the request body content
    var languageName = req.body.targetLang;
    var schemaId = req.body.schemaId;
    var newSnippet = req.body.snippet;

    mongoose.Promise = es6Promise;
    mongoose.connect ('localhost', 'real-time');

    LanguageModule.findOne({name: languageName}, function(error, data) {
        if (error)
            res.send ({status: 'error', message: 'error finding the specified language'});
        else {
            if (data != null) {

                for (var i=0; i< data.snippets.length; i++) {
                    var doc = data.snippets[i];
                    console.log (doc);
                }

                data.snippets.forEach (function (value, index) {
                    if (value._id == schemaId) {
                        value.snippetTitle = newSnippet.title;
                        value.snippetText = newSnippet.snippet;
                        console.log (value);
                    }
                });

                data.save (function (error, row, affected) {
                    if (error) 
                        res.send ({status:'error', message: 'Error updating snippet'});
                    else 
                        res.send ({status:'success', message: 'snippet updated'});

                    mongoose.disconnect();
                });
            } else {
                mongoose.disconnect();
                res.send ({status:'error', message: 'data is empty'});
            }
        }
    });
});

// delete a language
router.delete ('/delete_lang/:languageName', function (req, res) {
    res.type ('json');
    var lang = req.params.languageName;

    mongoose.Promise = es6Promise;
    mongoose.connect ('localhost', 'real-time');

    LanguageModule.findOne ({name: lang}, (err, doc) => {
        if (err)
            res.send (eResponse('some server error occured'));
        else {
            if (doc) {

                var removeQuery = LanguageModule.remove ({name: lang});
                removeQuery.exec();

                res.send (sResponse('successfully deleted language module'));
                mongoose.disconnect();

            } else {
                mongoose.disconnect();
                res.send (eResponse('no such language '+ lang +''));
            }
        }
    });
});

// api call to delete a snippet uneder language :lang and having id :sId
// UNTESTED
router.delete ('/delete_snippet/:lang/:sId', (req, res) =>{
    const lang = req.params.lang;
    const snippetId = req.params.sId;


    mongoose.Promise = es6Promise;
    mongoose.connect ('localhost', 'real-time');

    LanguageModule.findOne ({name: lang}, (err, doc) => {
        if (err)
            res.send (eResponse('Server error'));
        else {
            if (doc) {
                var removeQuery = doc.snippets.remove ({_id: snippetId});
                removeQuery.exec();

                res.send (sResponse ('deleted the snippet#'+ snippetId +' of '+ lang));
                mongoose.disconnect();
            } else {
                mongoose.disconnect();
                res.send (eResponse ('cannot find language '+ lang));
            }
        }
    });
});

function responseSendBuilder (status, message) {
    return {status: status, message: message};
}
// error response
function eResponse (message) {
    return responseSendBuilder('error', message);
}
// success response
function sResponse (message) {
    return responseSendBuilder ('success', message);
}

module.exports = router;