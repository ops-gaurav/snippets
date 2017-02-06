var Schema = require ('mongoose').Schema;

var FootnoteDocumentModel = require ('./footnote-doc-model.js');

var SnippetDocumentModel = new Schema ({
    snippetTitle: String,
    snippetText: String,
    footnotes: [FootnoteDocumentModel]
});

module.exports = SnippetDocumentModel;