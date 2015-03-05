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
            'directives/decorators/bootstrap/files.html'
        );


        
        var schemaFormatFileType = function(name, schema, options) {
            if (schema.type === 'array' && schema.format === 'files' ) {
                
                
                var itemsDef = {
                    "title" : "image",
                    "type" : "object",
                    "properties": {
                        "token" : {
                            "title": "token",
                            "type" : "string"
                        },
                        "extension" : {
                            "title" : "Extension",
                            "type" : "string",
                            "allowed_extensions": [""]
                        },
                        "size" : {
                            "title" : "Size",
                            "type" : "number",
                            "max_size" : 10000000
                        }
                    }
                };
                
                itemsDef.properties.extension.allowed_extensions = schema.allowed_extensions;
                itemsDef.properties.size.max_size = schema.max_size;

                schema.items = itemsDef;
   
            }
        };

        schemaFormProvider.defaults.array.unshift(schemaFormatFileType);
        
    }
]);



tv4.defineError('ALLOWED_EXTENSIONS_ERROR', 10000, 'Wrong file extension. Allowed extensions are {allowedExtensions}.');
tv4.defineKeyword('allowed_extensions', function (data, value, schema) {     
    if(value == undefined || value == '' || typeof data != 'string') {
        return null;
    }    
    var extension = data.split('.').pop();
    for (var i = 0; i < value.length; i++) {
        if (value[i] === extension) {
            return null;
        }
    }
    return {code: tv4.errorCodes.ALLOWED_EXTENSIONS_ERROR, message: {allowedExtensions: value.join(', ')}};         
});





tv4.defineError('MAX_SIZE_ERROR', 10001, 'This file is too large. Maximum size allowed is {maxSize}.');
tv4.defineKeyword('max_size', function (data, value, schema) {        
    if(value == undefined || value == '' || typeof data != 'string') {
        return null;
    }    
    if(data < value) {
        return null;
    } else {
        return {code: tv4.errorCodes.MAX_SIZE_ERROR, message: {fileName: data, maxSize: value}};
    }
});







ngSchemaFormFileType.directive('ngSchemaFile', function($upload, $timeout) {
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
                    
                    scope.generateThumb(file);                     
                    var extension = file.name.split('.').pop();
                        
                    scope.model[key].push({
                        token: i.toString(),
                        extension: extension,
                        size: file.size
                    });

                    $upload.upload({
                        url: scope.form.endpoint,
                        file: file,
                        fields: {
                            index: i
                        }
                    }).progress(function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        // console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                        evt.config.file.filesProgress = progressPercentage;
                    }).success(function (data, status, headers, config) {                                
                        
                        scope.model[key][data.index] = {
                            token: data.token,
                            extension: data.extension,
                            size: data.size
                        };
                        
                       
                    });

                }

                $timeout(function() {
                    scope.$broadcast('schemaFormValidate');
                }, 100);
                
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
            
            scope.deleteFile = function(files, index) {                
                files.splice(index, 1);          
                $timeout(function() {
                    scope.$broadcast('schemaFormValidate');
                }, 100);
            };

        }

	};
});