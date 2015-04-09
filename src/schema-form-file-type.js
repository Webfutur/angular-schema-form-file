'use strict';

var ngSchemaFormFileType = angular.module('ngSchemaFormFileType', [
    'angularFileUpload'
]);


angular.module('schemaForm').config(
['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

        schemaFormDecoratorsProvider.addMapping(
            'bootstrapDecorator',
            'files',
            // 'src/directives/decorators/bootstrap/files.html'
            'files.html'
        );

        
        var schemaFormatFileType = function(name, schema, options) {
            if (schema.type === 'array' && schema.format === 'files' ) {                
                if(schema.items.properties.size !== undefined && schema.items.properties.size.maximum !== undefined) {
                    schema.items.properties.size.validationMessage = {
                        "103": "This file is too large. Maximum size allowed is " + Math.floor(schema.items.properties.size.maximum/1000) + " ko."
                    };
                }                
                if(schema.items.properties.extension !== undefined && schema.items.properties.extension.enum !== undefined) {
                    schema.items.properties.extension.validationMessage = {
                        "1": "Wrong file extension. Allowed extensions are " + schema.items.properties.extension.enum + "."
                    };
                }      
                
                if(schema.maxItems !== undefined) {
                    schema.validationMessage = {
                        "401": "You can't upload more than " + schema.maxItems + " files."
                    };
                }

                
            }
        };

        schemaFormProvider.defaults.array.unshift(schemaFormatFileType);

    }
]);


function validateExtension(fileName, allowedExtensions) {
    var extension = fileName.split('.').pop();
    for (var i = 0; i < allowedExtensions.length; i++) {
        if (allowedExtensions[i] === extension) {
            return true;
        }
    }
    return false;
}


ngSchemaFormFileType.directive('ngSchemaFile', ['$upload', '$timeout', '$q', function($upload, $timeout, $q) {
    return {
		restrict: 'A',
        scope: true,
        require: 'ngModel',
        
        link: function(scope, element, attrs, ngModel) {
            
            scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
            
            scope.upload = function (files) {
                
                var key = scope.form.key[0];
                
                scope.model[key] = [];
                              
                for(var i = 0; i < files.length; i++) {                    
                    var file = files[i];                              
                                       
                    var extension = file.name.split('.').pop();                    
                        
                    scope.model[key].push({
                        token: i.toString(),
                        extension: extension,
                        size: file.size,
                        name: file.name,
                        progress: 0
                    });
                    
                    scope.generateThumb(file, i).then(function(result) {
                        scope.model[key][result.i].dataUrl = result.dataUrl;
                    });

                    // size and extensions                    
                    if(scope.form.schema.items.properties.size !== undefined && scope.form.schema.items.properties.size.maximum !== undefined && scope.form.schema.items.properties.size.maximum < file.size) {
                        continue;
                    }                    
                    if(scope.form.schema.items.properties.extension !== undefined && scope.form.schema.items.properties.extension.enum !== undefined && !validateExtension(file.name, scope.form.schema.items.properties.extension.enum)) {
                        continue;
                    } 
                    
                    scope.uploadFile(file, key, i).then(function(data) {
                        scope.model[key][data.index].token = data.token;
                        scope.model[key][data.index].extension = data.extension;
                        scope.model[key][data.index].size = data.size;
                    });

                }

                scope.revalidate();
                
            };
            
            scope.uploadFile = function(file, key, index) {
                var deferred = $q.defer();
                $upload.upload({
                    url: scope.form.endpoint,
                    file: file,
                    fields: {
                        index: index
                    }
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                    evt.config.file.filesProgress = progressPercentage;

                    scope.model[key][evt.config.fields.index].progress = progressPercentage;

                }).success(function (data, status, headers, config) {     

                    deferred.resolve(data);
                    
                });
                return deferred.promise;
            };

            scope.generateThumb = function(file, i) {
                var deferred = $q.defer();
                if (file != null) {
                    if (scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                        $timeout(function() {
                            var fileReader = new FileReader();
                            fileReader.readAsDataURL(file);
                            fileReader.onload = function(e) {
                                $timeout(function() {
                                    file.dataUrl = e.target.result;
                                    deferred.resolve({dataUrl: file.dataUrl, i: i});
                                });
                            };
                        });
                    }
                }
                return deferred.promise;
            };
            
            scope.revalidate = function() {                
                $timeout(function() {
                    scope.$broadcast('schemaFormValidate');
                }, 100);
            };

        }

	};
}]);
