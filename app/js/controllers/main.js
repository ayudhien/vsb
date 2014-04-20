'use strict';

/**
 * MainCtrl
 * Controller that controls mainly everything.
 */

angular.module('GSB.controllers.main', ['GSB.config'])
  //Inject $scope, $log and globalConfig (see @ js/config.js) into controller
  .controller('MainCtrl', ['$scope', '$log', 'globalConfig', function ($scope, $log, globalConfig) {

    //** FUNCTIONS START **//

    $scope.showArea = 'workspace';
    $scope.offsetX = 0;
    $scope.offsetY = 0;
    $scope.mouseDownAct = false;
    $scope.theMouseDown = function($event){
      $scope.offsetX = 0;
      $scope.offsetY = 0;
      $scope.startX = $event.pageX;
      $scope.startY = $event.pageY;
      $scope.mouseDownAct = true;
    };

    $scope.theMouseMove = function($event){
      if($scope.mouseDownAct){
        $scope.offsetX = $event.pageX - $scope.startX;
        $scope.offsetY = $event.pageY - $scope.startY;
        $scope.startX = $event.pageX;
        $scope.startY = $event.pageY;
      }
    };

    $scope.theMouseUp = function(){
      $scope.mouseDownAct = false;
    };

    /**
     * TODO: Call translate function...
     */
  $scope.translate = function () {
	
	  $scope.$broadcast('translationEvent');
	
    };

    /**
     * Initializes the Workspace
     */
    $scope.initializeWorkspace = function () {
      $log.info('Initialize Workspace');
      $scope.translatedJSON = "In the near future the translated JSON will be here.";
      $scope.translatedSPARQL = "In the near future the translated SPARQL will be here.";
      $scope.expertView = false;
    };

    //** FUNCTIONS END **//

    //Initialize Workspace
    $scope.initializeWorkspace();


    /** FOLGENDES MUSS AUS DIESEM CONTROLLER RAUS! **/

    /**
     * translates the GSBL to JSON
     * TODO-FELIX: Make code nicer (if you need help, ask @leipert, der hat den bockmist geschrieben)
     * TODO-FELIX: Move it to translation Service
     *
     * @namespace currentProperty.link.linkPartner
     */
    $scope.translateGSBLToJSON = function (mainSubjectSelected, subjects) {
      $log.info('Translate GSBL to JSON');
      if (mainSubjectSelected == null) {
        $log.error("Main Subject not connected");
        $scope.translatedJSON = null;
        return;
      }
      var json = {
          START: {
            type: "LIST_ALL",
            "link": {
              "direction": "TO",
              "linkPartner": mainSubjectSelected.alias
            }
          },
          SUBJECTS: []
        },
        allSubjects = angular.copy(subjects);
      allSubjects.map(function (currentSubject) {
        delete currentSubject["availableProperties"];
        currentSubject.properties = currentSubject["selectedProperties"].map(function (currentProperty) {
          delete currentProperty["isObjectProperty"];
          delete currentProperty["propertyType"];
          if (currentProperty.link.linkPartner !== null && currentProperty.link.linkPartner.hasOwnProperty("alias")) {
            currentProperty.link.linkPartner = currentProperty.link.linkPartner.alias;
          } else {
            currentProperty.link = {};
          }
          return currentProperty;
        });
        delete currentSubject["selectedProperties"];
        return currentSubject;
      });
      json.SUBJECTS = allSubjects;
      //Converts the 'json'-named-object to JSON notation
      $scope.translatedJSON = JSON.stringify(json, null, 2);
    };

    /**
     * translates the JSON to SPARQL
     * TODO-FELIX: Move it to translation Service
     */
    $scope.translateJSONtoSPARQL = function (mainSubjectSelected, subjects) {
      $log.info('Translate JSON to SPARQL');
      $scope.translateGSBLToJSON(mainSubjectSelected, subjects);
      if ($scope.translatedJSON == null) {
        $log.error("JSON is not valid");
        return;
      }
      $scope.translatedSPARQL = translateAllFromString($scope.translatedJSON);
    };

    /**
     * Open the SPARQL Query in a new dbpedia tab
     * TODO-NICO: Use or delete it.
     */
    $scope.openInNewTab = function () {
      var win = window.open(globalConfig.queryURL + encodeURIComponent($scope.translatedSPARQL), '_blank');
      win.focus();
    };


  }]);