'use strict';

var ngSchemaFormFileType = angular.module('ngSchemaFormFileType', [
    'angularFileUpload'
]);

angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

        schemaFormDecoratorsProvider.addMapping(
            'bootstrapDecorator',
            'file',
            'directives/decorators/bootstrap/file.html'
        );

    }
]);

ngSchemaFormFileType.directive('ngSchemaFile', function($upload, $timeout) {
    return {
		restrict: 'A',
        scope: true,        
        require: 'ngModel',
        
        link: function(scope, element, attrs, ngModel) {
            
            scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
            
            scope.upload = function (files) {
                
                scope.displayThumbs();
                
                ngModel.$setViewValue('');
                
                
                if (files && files.length) {
                    for (var i = 0; i < scope.files.length; i++) {                
                        var file = scope.files[i];
                        $upload.upload({
                            url: 'endpoint-upload.php',
                            fields: {'username': scope.username},
                            file: file
                        }).progress(function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                            evt.config.file.filesProgress = progressPercentage;
                        }).success(function (data, status, headers, config) {    
                            
                            // TODO : use an array instead of a string
                            var currentViewValue = ngModel.$viewValue;                            
                            if(currentViewValue !== '') {
                                currentViewValue = currentViewValue.split('/');
                                currentViewValue.push(data.token);
                                currentViewValue = currentViewValue.join('/');
                                ngModel.$setViewValue(currentViewValue);
                            } else {
                                ngModel.$setViewValue(data.token);
                            } 
                            
                            
                        });
                    }
                }
            };

            scope.displayThumbs = function() {
                if (scope.files && scope.files.length) {
                    for (var i = 0; i < scope.files.length; i++) {   
                        var file = scope.files[i];
                        scope.generateThumb(file);                
                    }
                }
            };

            scope.generateThumb = function(file) {
                if (file != null) {
                    if (scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                });
                            };
                        });
                    }
                }
            };

        }

	};
});