var SnippetDocumentModel = require ('./snippet-doc-model.js');
var Schema = require('mongoose').Schema;

var SnippetModel = new Schema ({
    name: String,
    keywords: [String],
    snippet: [SnippetDocumentModel]
});

module.exports = SnippetModel;