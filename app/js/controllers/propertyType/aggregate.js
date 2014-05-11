'use strict';

/**
 * PropertyInstanceCtrl
 * Controller for a single property.
 */

angular.module('GSB.controllers.propertyType.aggregate', ['GSB.config'])
  //Inject $scope, $http, $log and globalConfig (see @ js/config.js) into controller
  .controller('AggregatePropertyCtrl', ['$scope', '$http', '$log', 'globalConfig', function($scope, $http, $log, globalConfig) {
    $scope.$watch('selected',function(nv,ov){
      if(nv !== undefined && nv !== null) {
        $scope.propertyInst.alias = nv.alias;
        $scope.propertyInst.operator = nv.operator;
        if (nv.restrictTo !== null && $scope.link !== undefined && $scope.link !== null) {
          if (nv.restrictTo !== $scope.link.type) {
            $scope.link = null;
          }
        }
      }
    });
    $scope.$watch('link',function(nv,ov){
      if(nv !== undefined && nv !== null) {
        $scope.propertyInst.link.linkPartner = nv.alias;
      }
    });
  }]);