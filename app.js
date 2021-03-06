'use strict';

var myApp = angular.module('myApp', [
    'schemaForm',
    'ngSchemaFormFileType'
]);

// our controller for the form
// =============================================================================
myApp.controller('FormController', ['$scope', '$http', 'ImageUploadCleaner', function($scope, $http, ImageUploadCleaner) {

        
    $http.get('schema.json').success(function(data) { 
        $scope.schema = data.schema;
        $scope.form = data.form;
    });

    $scope.model = {};
    
    $scope.submit = function() {
        $scope.$broadcast('schemaFormValidate');
        if ($scope.myForm.$valid) {
            
            
            var modelClone = ImageUploadCleaner.clone($scope.model);            
            ImageUploadCleaner.clean(modelClone, ['images']);  
            console.log(modelClone);
            
            
        }
    };

}]);

