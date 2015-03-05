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

    }
]);










tv4.defineError('ALLOWED_EXTENSIONS_ERROR', 10000, 'Wrong file extension. Allowed extensions are {allowedExtensions}.');

tv4.defineKeyword('allowed-extensions', function (data, value, schema) {        
    if(value == undefined || value == '') {
        return null;
    }        
    var extension = data.split('.').pop();
    for (var i = 0; i < value.length; i++) {
        if (value[i] === extension) {
            return null;
        }
    }
    return {code: tv4.errorCodes.ALLOWED_EXTENSIONS_ERROR, message: {allowedExtensions: value}};         
});





tv4.defineError('MAX_SIZE_ERROR', 10001, 'File {fileName} is too large. Maximum size allowed is {maxSize}.');

tv4.defineKeyword('max-size', function (data, value, schema) {        
    if(value == undefined || value == '') {
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
            
            
            
            scope.upload = function (files) {
                
                var key = scope.form.key[0];
                
                scope.model[key] = [];
              
                for(var i = 0; i < files.length; i++) {
                    
                    var file = files[i];
                    
                    var extension = file.name.split('.').pop();
                    
                    scope.model[key].push({
                        token: 'token is coming',
                        extension: extension,
                        size: file.size
                    });                    
                    
                }
              
                console.log(files);
                console.log(scope.model);
                
            };

        }

	};
});