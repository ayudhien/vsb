(function () {
    'use strict';

    /**
     * MainCtrl
     * Controller that controls mainly everything.
     */

    angular.module('GSB.mainCtrl', ['GSB.config', 'ngTable','angular-intro'])
//Inject $scope, $log and globalConfig (see @ js/config.js) into controller
        .controller('MainCtrl', MainCtrl);
    function MainCtrl($scope, $log, globalConfig, $http, $translate, languageStorage) {

        $http.get('locale.json').success(function (data) {
            languageStorage.mergeLanguages(data);
            $translate.refresh();
        });

        $scope.IntroOptions = {
            steps:[
                {
                    element: document.querySelector('sadnavigation'),
                    intro: '<h1>Graphical SPARQL Builder Hilfe</h1>' +
                    '<p>Der Graphical SPARQL Builder....</p>' +
                    '<p>Zum Start der Tour, bitte auf weiter klicken.</p>',
                    tooltipClass: 'wide'

                },
                {
                    intro: '<h2>Arbeitsfläche</h2>' +
                    '<p>Im Hintergrund sehen Sie die Arbeitsfläche, das Kernstück des GSB.... </p>'
                },
                {
                    element: '#navigation',
                    intro: '<h2>Navigation</h2>' +
                    '<p>Lorem IPSUM</p>',
                    position: 'right'
                },
                {
                    element: '#step4',
                    intro: 'Another step.',
                    position: 'bottom'
                },
                {
                    element: '#step5',
                    intro: 'Get it, use it.'
                }
            ],
            showBullets: true,
            exitOnOverlayClick: true,
            exitOnEsc:true,
            showStepNumbers:false,
            nextLabel: 'Weiter <i class="fa fa-chevron-right"></i>',
            prevLabel: '<i class="fa fa-chevron-left"></i> Zurück',
            skipLabel: 'Abbruch',
            doneLabel: 'Fertig'
        };

        $scope.CompletedEvent = function () {
            //console.log('Completed Event called');
        };

        $scope.ExitEvent = function () {
            //console.log('Exit Event called');
        };

        $scope.ChangeEvent = function (targetElement) {
            //console.log('Change Event called');
            if(targetElement.id === 'navigation'){
                //SubjectService.reset();
            }
        };

        //$scope.BeforeChangeEvent = function (targetElement) {
            //console.log('Before Change Event called');
            //console.warn(arguments);
        //};

        //$scope.AfterChangeEvent = function (targetElement) {
            //console.log('After Change Event called');
            //console.log(arguments);
        //};

        /**
         * Triggers save JSON event
         */
        $scope.saveJSON = function () {
            $scope.$broadcast('saveJsonEvent');

        };

        /**
         * Initializes the Workspace
         */
        $scope.initializeWorkspace = function () {
            $log.debug('Initialized Workspace');
            $scope.translatedJSON = 'In the near future the translated JSON will be here.';
            $scope.translatedSPARQL = 'In the near future the translated SPARQL will be here.';
        };

        //Initialize Workspace
        $scope.initializeWorkspace();

        /** FOLGENDES MUSS AUS DIESEM CONTROLLER RAUS! **/

        /**
         * Open the SPARQL Query in a new dbpedia tab
         */
        $scope.openInNewTab = function () {
            var win = window.open(globalConfig.resultURL + encodeURIComponent($scope.translatedSPARQL), '_blank');
            win.focus();
        };


    }


})();