(function () {
    'use strict';

    /**
     * Subject directive
     * Creates the possibility to use a <subject-dir> element,
     * which will be replaced with the contents of template/subject.html
     * Additionally a subject directive uses it's own scope which is needed,
     * so that each subject can hold it's own property list
     *
     */

    angular.module('GSB.subject.instance', ['GSB.config', 'GSB.endPointService', 'GSB.arrowService', 'GSB.filters'])

        .directive('subjectDir', subjectDir);

    function subjectDir(ArrowService, connectionService, zIndexService, $rootScope) {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                subject: '='
            },
            controller: SubjectInstanceCtrl,
            controllerAs: 'vm',
            templateUrl: '/modules/subject/subject.tpl.html',
            link: linkFunction(ArrowService, connectionService, zIndexService, $rootScope)
        };
    }

    function SubjectInstanceCtrl($scope, $q, SubjectService, $rootScope) {

        var subject = $scope.subject;

        var vm = this;
        vm.editAlias = false;
        vm.comment = subject.uri + '.$comment';
        vm.removeSubject = removeSubject;
        vm.addProperty = addProperty;
        vm.searchRelation = searchRelation;
        vm.$availableProperties = [];

        function addProperty() {
            subject.addProperty(vm.propertySelected);
            vm.propertySelected = undefined;
            vm.showAddProperty = false;
        }

        function removeSubject() {
            SubjectService.removeSubject(subject.$id);
        }

        function searchRelation() {
            subject.$searchRelation = true;
            SubjectService.searchRelation(subject);
        }

        vm.loading = true;

        $q.when(subject.$loading).then(function () {
            vm.loading = false;
            vm.refreshProperties('', 50);
        });

        $rootScope.$on('translateEverything', function () {
            if (vm.showAddProperty) {
                vm.refreshProperties('', 50);
            }
        });

        vm.refreshProperties = function (search, limit) {

            return subject.getAvailableProperties(search, limit)
                .then(function (data) {
                    var diff = _.xor(_.pluck(data.items, 'id'),
                        _.pluck(vm.$availableProperties, 'id'));
                    if (diff.length > 0) {
                        vm.$availableProperties = data.items;
                        vm.totalItems = data.total;
                        vm.matchingItems = data.matching;
                    }
                });
        };

    }


    /**
     * The Link Function enables Drag & Drop and saves position back to the VM
     *
     */
    function linkFunction(ArrowService, connectionService, zIndexService, $rootScope) {
        return function (scope, element) {

            var pos = angular.copy(scope.subject.pos);

            var x = pos.x || 150, y = pos.y || 250;

            element.css({
                left: x + 'px',
                top: y + 'px'
            });

            $rootScope.$on('moveSubjectDrag', function (event, offset, oneTimeMove) {
                x = x + offset.x;
                y = y + offset.y;
                element.css({
                    left: x + 'px',
                    top: y + 'px'
                });
                if(oneTimeMove){
                    scope.subject.pos.x = angular.copy(x);
                    scope.subject.pos.y = angular.copy(y);
                }
            });

            $rootScope.$on('moveSubjectEnd', function () {
                scope.subject.pos.x = angular.copy(x);
                scope.subject.pos.y = angular.copy(y);
            });


            zIndexService.registerSubject(scope.$id, element);

            //Todo: Handle Vsibibility with CSS
            ArrowService.makeDraggable(element,
                {
                    handle: '.mover',
                    start: function () {
                        scope.$evalAsync(function () {
                            zIndexService.increaseIndex(scope.$id);
                            scope.vm.showAddProperty = false;
                        });
                    },
                    stop: function (event, ui) {
                        x = angular.copy(ui.position.left);
                        y = angular.copy(ui.position.top);
                        scope.$evalAsync(function () {
                            scope.subject.pos.x = angular.copy(x);
                            scope.subject.pos.y = angular.copy(y);
                        });
                    }
                }
            );

            //Todo: Move Positions to Service
            //scope.$on('$destroy', function () {
            //    scope.subject.pos = angular.copy({
            //        x: x,
            //        y: y
            //    });
            //});

            connectionService.addMapping(scope.subject.$id, scope.$id);

        };
    }

})();