var SnippetDocumentModel = require ('./snippet-doc-model.js');
var Schema = require('mongoose').Schema;

// represents an individual language in the database
// which further contains the snippets
var LanguageModuleModel = new Schema ({
    name: String,
    keywords: [String],
    snippets: [SnippetDocumentModel]
});

module.exports = LanguageModuleModel;