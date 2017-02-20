var langModule = angular.module ('langModule', ['devmodule']);

/**
 * Language module factory containing services related to api calls
 */
langModule.factory ('languageModuleService', ['$http', 'devlogger', function ($http, devlogger) {
    return {
        listLanguages: (successCallback, errorCallback) => {
            $http({
                method: 'GET',
                url: '/api/snippets/languages'
            }).then (successCallback, errorCallback);
        },
        /**
         * find a language
         * GET /lookup_lang/:langType
         */
        findLang: (langName) => {
            $http ({
                method: 'GET',
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
         * find a snippet unser language lang
         * GET /lookup_snippet/:langName
         */
         getSnippets: (lang, successCallback, errorCallback) => {
            $http ({
                method: 'GET',
                url: '/api/snippets/getSnippets/'+ lang
            }). then (successCallback, errorCallback);;
         },
         /*
         *  This method will lookup for the individual snippet
         *  under the language :lang and having snippet id
         *  :sID. This will

         *  GET /api/snippets/lookup_snippet/:lang/:sId
         *  FETCH requested snippet in doc property of response
         *  OR error message (if any)
         */
        findSnippet: (lang, sID, successCallback, errorCallback) => {
            $http({
                method: 'GET',
                url: '/api/snippets/lookup_snippet/'+ lang +'/'+ sID 
            }). then (successCallback, errorCallback);
        },
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
        updateSnippet: (snippet) => {
            var payload = {
                targetLang: $scope.breadcrumbItems[1];
                schemaId: doc._id,
                snippet: doc
            };
            $http({
                method: 'PUT',
                url: '/api/snippets/update'
            });
        },
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
        createSnippet: (lang, successCallbak, errorCallback) => {
            var payload = {
                snippet: {
                    title: lang.title,
                    snippet: lang.snippet
                }
            };

            var apiURL = '/api/snippets/create/'+ lang.name + '/';

            $http({
                method: 'POST',
                url: apiURL,
                data: payload
            }).then (successCallbak, errorCallback);
        },
        /**
         * DELETE /api/snippets/delete_lang/:langName
         */
        deleteLang: (lang, successCallback, errorCallback) => {
            $http ({
                method: 'DELETE',
                url: '/api/snippets/delete_lang/'+ lang
            }).then (successCallback, errorCallback);;
        },
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
    $scope.serialLanguages = [];
    $scope.breadcrumbItems = ['Languages'];

    // an auxilary variable to store temporary values
    $scope.aux = {};

    showHome();

    // call this on startup
    // this load all the available list of languages in the database
    // and populate languageGroup with array in a pair of 4 to make it
    // suitable for a grid system to iterate over
    // Accepts 2 arguments success and error
    languageModuleService.listLanguages ((data) => {
        // success callback
        var response = data.data;
        if (response.status == 'success') {
            devlogger.success ('success fetching data', true);
            var languages = response.data;
            var index = 0;
            var items = [];
            languages.forEach ((actual, index, raw) => {
                items.push (actual);
                index++;
                $scope.serialLanguages.push (actual.name);
                if (index == 4) {
                    $scope.languageGroup.push (items);
                    index = 0;
                    items = [];
                }
            });
            $scope.languageGroup.push (items);
            $scope.editorModel = {
                lang: $scope.serialLanguages[0]
            };

            //devlogger.info ($scope.editorModel.lang, true);
        } else {
            devlogger.error ('no response fetched'+ JSON.stringify(response), true);
        }
    }, (data)=> {
        // error callback
        devlogger.error ('Server error '+ JSON.stringify(data), true);
    });
    // prive function to read the file content
    // usually used for reading the HTML components and 
    // compiling them using $compile service of angularJS (if they contains
    // angular JS code)
    function getFileContent (fileURL, asyncCallback) {
        $.ajax ({
            url: fileURL,
            async: false,
            success: asyncCallback
        });
    }

    $scope.setEditorLang = (lang) => $scope.editorModel.lang = lang;


    function showHome () {
        getFileContent ('/component/lang-homepage', (result) => {
            //devlogger.info (result);
            $('.dynamic-content').html ($compile (result)($scope));
            for (var i=1; i< $scope.breadcrumbItems.length; i++)
                $scope.breadcrumbItems.pop (i);
        });
    }
    // load the snippets
    // load the UI components for the lang module and 
    $scope.showSnippetsFor =  (language) => {
        getFileContent ('/component/snippets-listing', (result) => {
            //devlogger.info ('fetched');
            languageModuleService.getSnippets (language, (data) => {
                var response = data.data;
                if (response.status == 'success') {
                    $scope.snippetsGroup = [];

                    var nestGroup = [];
                    var index = 0;
                    response.data.forEach ((actual, index, raw) => {
                        nestGroup[index++] = actual;
                        if (index == 4) {
                            $scope.snippetsGroup.push (nestGroup);
                            index = 0;
                            nestGroup = [];
                        }
                    });

                    $scope.snippetsGroup.push (nestGroup);
                    //devlogger.info (  JSON.stringify (response.data));

                    $('.dynamic-content').html ($compile (result)($scope));
                    $scope.breadcrumbItems.push (language);
                }
                else
                    devlogger.error ('Error : '+ response.message);
            },(data) => {
                devlogger.error ('Error '+ data);
            });
        });
    }

    /**
    *   open the add snippet modal to add a new snippet for
    *   the selected language. The language will be auto selected
    *   in the dropdown options
    */
    $scope.triggerAddSnippetFor = ($event, lang) => {
        // prevent bubbling here... so that the card-text on click should
        // not be invoked.
        $('#create-modal').modal ({
            backdrop: 'static',
            keyboard: false
        });
        $scope.editorModel.lang = lang; 

        $event.stopPropagation();
    }

    /**
    *   trigger this to delete the particular language
    */
    $scope.triggerDeleteLanguage = ($event, lang) => {
        $scope.aux.param1 = lang;

        $('#delete-prompt-modal').modal ({
            backdrop: 'static',
            keyboard: false
        });
        $event.stopPropagation ();
    }

    // action on confirming the delete option
    $scope.deleteLang = (lang) => {
        languageModuleService.deleteLang (lang, (data) =>{
            // success callback
            var response = data.data;
            if (response.status == 'success') {
                
                $('#delete-prompt-modal').modal ('hide');
                $('#delete-success').modal ({
                    backdrop: 'static',
                    keyboard: false
                });
                setTimeout (() => {
                    $('#delete-success').modal ('hide'); 
                    location.reload();
                }, 3000);

            } else {
                $('#delete-prompt-modal').modal ('hide');
                $('#delete-error').modal ({
                    backdrop: 'static',
                    keyboard: false
                });
                setTimeout (() => {
                    $('#delete-error').modal ('hide');
                    location.reload();
                }, 3000);
            }
        }, (data) => {
            // error callback
            $('#delete-prompt-modal').modal ('hide');
            $('#delete-error').modal ({
                    backdrop: 'static',
                    keyboard: false
                });
            setTimeout (() => {
                $('#delete-error').modal ('hide');
                location.reload();  
            }, 3000);
        });
    }
    // load the individual snippet
    // also update the breadcrumbs
    $scope.showSnippet = (id) => {
        var language = $scope.breadcrumbItems[1];
        languageModuleService.findSnippet (language, id, (data) => {
            var response = data.data;
            if (response.status = 'success') {
                //devlogger.info (JSON.stringify(response.doc));

                // update the content of .dynamic-content
                // to show the requested snipped under :language
                $scope.reqSnippet = response.doc;
                getFileContent ('/component/snippet-content', (file) => {
                    $('.dynamic-content').html ($compile (file)($scope));
                    $scope.breadcrumbItems.push (response.doc.snippetTitle);
                });

            } else {
                devlogger.error ('ERROR: '+ response.message);
            }
        }, (data)=> {
            devlogger.error ('Error getting the data: '+ data);
        });
    }
    
    /*
    *   show snippet editing options for snippet having snippet id
    *   sID under the language lang
    */
    $scope.showEditDialogue = ($event, snippet) => {
        
        $scope.aux = {};

        const lang = $scope.breadcrumbItems[1];
        // init the content here
        $scope.aux.param1 = snippet._id;
        $scope.aux.param2 = snippet.snippetTitle;
        $scope.aux.param3 = snippet.snippetText;

        getFileContent ('/component/edit-modal', (file) => {

            $('.compiled-modal').html ($compile (file)($scope));

            $('#edit-dialogue').modal ({
                backdrop: 'static',
                keyboard: false
            });
        });
        $event.stopPropagation();
    }

    // to be called via the update dialogue
    // tp update the 
    $scope.updateSnippet = (snippet) => {
        languageModuleService.
    };

    // play the animation loading
    function _playLoading () {
        //devlogger.info ('loading animation');
        $('.abs-container-loading').css({display: 'block'});
        $('.abs-container-loading').animate ({
            opacity: 0
        }, 300);
    }

    // stop the animation loading
    function _stopLoading () {
        // ('done loading');
        $('.abs-container-loading').animate ({opacity: 0}, 300, () => {
            $('.abs-container-loading').css ({display: 'none'});
        });
    }

    // START FROM HERE
    // creates a new snippetGroup
    $scope.newSnippet = (langName, title, snippet) => {

        // alert (langName);

        _playLoading();

        // fetch the form values
        var lang = {
            name: langName,
            title: title,
            snippet: snippet
        };
        languageModuleService.createSnippet (lang, (successData) => {
            _stopLoading();

            var response = successData.data;
            if (response.status == 'success') {
                $('.create-info').html ('Language added');
                setTimeout (() => {
                    $('#create-modal').modal ('hide');
                    location.reload ();
                }, 2000);

            } else {
                ('.create-info').html ('Server error');
                setTimeout (() => {
                    $('#create-modal').modal ('hide');
                    location.reload ();
                }, 2000);
            }
        }, (errData) => {
            _stopLoading();

            $('.create-info').html ('Error connecting with server');
            setTimeout (() => {
                    $('#create-modal').modal ('hide');
                    location.reload ();
                }, 2000);
        });
    }

    // handle the page navigation of breadcrumbs
    $scope.handleBreadcrumbs = (clicked) => {
        var clikedIndex = -1;

        $scope.breadcrumbItems.map ((value, index) => {
            if (value == clicked) {
                clickedIndex = index;
                return;
            }
        });

        if (clickedIndex == 0) {
            // home
            $scope.breadcrumbItems.splice (1, $scope.breadcrumbItems.length-1);
            showHome ();
        } else if (clickedIndex == 1) {
            // show home for specific language

            // remove all thd breadcrumb items
            var lang = $scope.breadcrumbItems[1];
            $scope.breadcrumbItems.splice (1, $scope.breadcrumbItems.length-1);

            $scope.showSnippetsFor (lang);
        } else if (clickedIndex == 2) {
            // reload the current page (this is the only situtation when a user
            // is in the exact same page that user requests)
            // or do nothing
        }
    }
}]);