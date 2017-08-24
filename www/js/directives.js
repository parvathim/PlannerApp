angular.module('starter.directives', [])

    .directive('profileEdit', ['apiUrls', function(apiUrls) {
        return {
            restrict: 'E',
            templateUrl: 'templates/profileedit.html',
        }
    }])

