var langModule = angular.module ('langModule', ['devmodule']);

/**
 * Language module factory containing services related to api calls
 */
langModule.factory ('languageModuleService', ['$http', 'devlogger', function ($http, devlogger) {
    return {
        listLanguages: (successCallback, errorCallback) => {
            $http({
                method: 'GET',
                url: 'http://localhost:3000/api/snippets/languages'
            }).then (successCallback, errorCallback);
        },
        /**
         * find a language
         * GET /lookup_lang/:langType
         */
        findLang: (langName) => {
            $http ({
                mathod: 'GET',
                url: '/api/snippets/lookup_lang/:'+ langName
            }).then (function successCallback(data){
                // success happens here
                return data;
            }, function errorCallback(error) {
                // error happens here
                return error;
            });
        },
        /**
         * http:// GET
         * find a snippet unser language lang and snippet id sId
         * GET /lookup_snippet/:langName/:sId
         */
        findSnippet: (lang, sID) => {},
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
        updateSnippet: (doc) => {},
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
        createSnippet: (lang) => {},
        /**
         * DELETE /api/snippets/delete_lang/:langName
         */
        deleteLang: (lang) => {},
        /**
         * DELETE /api/snippets/delete_snippet/:lang/:sId
         */
        deleteSnippet: (lang, sId) => {}
    };
}]);


/**
 * controller for langugae based actions
 */
langModule.controller ('LangModuleController', ['$scope', '$compile', 'languageModuleService', 'devlogger', function ($scope, $compile, languageModuleService, devlogger){
    
    // the grid contains the items as columns of 4 => 4 languages in a row.
    // to make results iterable in angularJS, adding them in the group of 4 items as array in an array
    $scope.languageGroup = [];

    $scope.breadcrumbItems = ['Languages'];
    languageModuleService.listLanguages ((data) => {
        // success callback
        var response = data.data;
        if (response.status == 'success') {
            devlogger.success ('success fetching data', true);
            var languages = response.data;
            var index = 0;
            var items = [];
            languages.forEach ((obsolete, index, raw) => {
                items.push (obsolete);
                index++;
                if (index == 4) {
                    $scope.languageGroup.push (items);
                    index = 0;
                    items = [];
                }
            });
            $scope.languageGroup.push (items);

            devlogger.info ($scope.languageGroup.length + ' item(s) in group');
        } else {
            devlogger.error ('no response fetched'+ JSON.stringify(response), true);
        }
    }, (data)=> {
        // error callback
        devlogger.error ('Server error '+ JSON.stringify(data), true);
    });

    function getFileContent (fileURL) {
        return $.ajax ({
            url: fileURL,
            async: false
        }).responseText;
    }

    $scope.showSnippetsFor =  (language) => {
        $scope.snippets = "snippets";
        $('.dynamic-content').html ($compile(getFileContent ('/component/testcomponent'))($scope));
    }
}]);