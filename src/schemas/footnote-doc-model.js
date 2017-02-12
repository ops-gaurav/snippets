var Schema = require ('mongoose').Schema;

var FootnotesDocumentModel = new Schema ({
    footnoteText: String
});

module.exports = FootnotesDocumentModel;