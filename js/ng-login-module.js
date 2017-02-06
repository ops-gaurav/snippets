var langModule = angular.module ('langModule', []);
langModule.service ('lang_module_actions', () =>{
    /**
     * find a language
     * GET /lookup_lang/:langType
     */
    this.findLang = (langName) => {

    };

    /**
     * http:// GET
     * find a snippet unser language lang and snippet id sId
     * GET /lookup_snippet/:langName/:sId
     */
    this.findSnippet = (lang, sId) => {

    };

    /**
     * supported doc format is
     * PUT /api/snippets/update
     * BODY
     * {
     *      targetLang: 'java',
     *      schemaId: '65HXDS8A38JIOJLK981',
     *      snippet: {
     *          title: '',
     *          snippet: ''
     *      }
     * }
     */
    this.updateSnippet = (doc) => {

    }

    /**
     * POST /api/snippets/create/:langName
     * BODY 
     * {
     *      snippet: {
     *          title:'title of snippet',
     *          snippet: 'content of snippet'
     *      }
     * }
     */
    this.createSnippet = (lang) =>{

    }

    /**
     * DELETE /api/snippets/delete_lang/:langName
     */
    this.deleteLanguage = (lang) => {

    }

    /**
     * DELETE /api/snippets/delete_snippet/:lang/:sId
     */
    this.deleteSnippet = (lang, sId) => {
        
    }
});