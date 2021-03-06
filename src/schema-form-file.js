'use strict';

angular.
module('schemaForm').
config(['schemaFormProvider', 'schemaFormDecoratorsProvider', 'sfPathProvider',
    function(schemaFormProvider,  schemaFormDecoratorsProvider, sfPathProvider) {

        schemaFormDecoratorsProvider.addMapping(
            'bootstrapDecorator',
            'files',
            'files.html'
        );

        var schemaFormatFileType = function(name, schema, options) {
            if (schema.type === 'array' && schema.format === 'files' ) {

                if(schema.items.properties.size !== undefined && schema.items.properties.size.maximum !== undefined) {
                    schema.items.properties.size.validationMessage = {
                        "103": "This file is too large. Maximum size allowed is " + Math.floor(schema.items.properties.size.maximum/1000) + " ko."
                    };
                }

                if(schema.items.properties.mimeType !== undefined && schema.items.properties.mimeType.enum !== undefined) {
                    schema.items.properties.mimeType.validationMessage = {
                        "1": "Wrong file type. Allowed types are " + schema.items.properties.mimeType.enum + "."
                    };
                }

                if(schema.minItems !== undefined && schema.maxItems !== undefined) {
                    schema.validationMessage = {
                        "400": "You have to upload at least " + schema.minItems + " files.",
                        "401": "You can't upload more than " + schema.maxItems + " files.",
                        "302": "File(s) missing."
                    };
                }

            }
        };

        schemaFormProvider.defaults.array.unshift(schemaFormatFileType);

    }
]);

angular.
module('schemaFormFile', [
    'angularFileUpload'
]).
service('ImageUploadCleaner', function() {

    this.clone = function(obj) {
        var copy;

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj) return obj;

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date();
            copy.setTime(obj.getTime());
            return copy;
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = [];
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = this.clone(obj[i]);
            }
            return copy;
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {};
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.clone(obj[attr]);
            }
            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    };

    this.clean = function(obj, stringifyImages) {
        for (var k in obj) {
            if(obj[k].dataUrl != undefined) {
                obj[k] = obj[k].token;
            } else if (typeof obj[k] == "object" && obj[k] !== null) {
                    this.clean(obj[k]);
            }
        }
    };

   this.fullClean = function(obj, filesKeys) {
        for (var k in obj) {
            if (filesKeys.indexOf(k) >= 0) {
                if (obj[k].length > 0) {
                    obj[k] = obj[k][0].token;
                } else {
                    obj[k] = '';
                }
            } else if (typeof obj[k] == "object" && obj[k] !== null) {
                this.clean(obj[k]);
            }
        }
   };
}).

directive('ngSchemaFile', ['$upload', '$timeout', '$q', function($upload, $timeout, $q) {
    return {
		restrict: 'A',
        scope: true,
        require: 'ngModel',

        link: function(scope, element, attrs, ngModel) {
            scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);

            scope.upload = function (files) {
                if(scope.form.key.length == 1) {
                    scope.model[scope.form.key[0]] = [];
                } else if(scope.form.key.length == 2) {
                    scope.model[scope.form.key[0]][scope.form.key[1]] = [];
                } else if(scope.form.key.length == 3) {
                    scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]] = [];
                } else if(scope.form.key.length == 4) {
                    scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]] = [];
                } else {
                    console.log('Error');
                }

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];

                    if(scope.form.key.length == 1) {
                        scope.model[scope.form.key[0]].push({
                            token: i.toString(),
                            mimeType: file.type,
                            size: file.size,
                            name: file.name,
                            progress: 0
                        });
                    } else if (scope.form.key.length == 2) {
                        scope.model[scope.form.key[0]][scope.form.key[1]].push({
                            token: i.toString(),
                            mimeType: file.type,
                            size: file.size,
                            name: file.name,
                            progress: 0
                        });
                    } else if(scope.form.key.length == 3) {
                        scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]].push({
                            token: i.toString(),
                            mimeType: file.type,
                            size: file.size,
                            name: file.name,
                            progress: 0
                        });
                    } else if(scope.form.key.length == 4) {
                        scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]].push({
                            token: i.toString(),
                            mimeType: file.type,
                            size: file.size,
                            name: file.name,
                            progress: 0
                        });
                    } else {
                        console.log('Error');
                    }

                    if (scope.form.key.length == 1) {
                        scope.generateThumb(file, i).then(function(result) {
                            scope.model[scope.form.key[0]][result.i].dataUrl = result.dataUrl;
                        });
                    } else if (scope.form.key.length == 2) {
                        scope.generateThumb(file, i).then(function(result) {
                            scope.model[scope.form.key[0]][scope.form.key[1]][result.i].dataUrl = result.dataUrl;
                        });
                    } else if (scope.form.key.length == 3) {
                        scope.generateThumb(file, i).then(function(result) {
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][result.i].dataUrl = result.dataUrl;
                        });
                    } else if (scope.form.key.length == 4) {
                        scope.generateThumb(file, i).then(function(result) {
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]][result.i].dataUrl = result.dataUrl;
                        });
                    } else {
                        console.log('Error');
                    }

                    // size and mime types
                    if (scope.form.schema.items.properties.size !== undefined && scope.form.schema.items.properties.size.maximum !== undefined && scope.form.schema.items.properties.size.maximum < file.size) {
                        continue;
                    }

                    if (scope.form.schema.items.properties.mimeType !== undefined && scope.form.schema.items.properties.mimeType.enum !== undefined && scope.form.schema.items.properties.mimeType.enum.indexOf(file.type) == -1) {
                        continue;
                    }

                    if (scope.form.key.length == 1) {
                        scope.uploadFile(file, scope.form.key, i).then(function(data) {
                            scope.model[scope.form.key[0]][data.index].token = data.token;
                            scope.model[scope.form.key[0]][data.index].mimeType = data.mimeType;
                            scope.model[scope.form.key[0]][data.index].size = data.size;
                        });
                    } else if (scope.form.key.length == 2) {
                        scope.uploadFile(file, scope.form.key, i).then(function(data) {
                            scope.model[scope.form.key[0]][scope.form.key[1]][data.index].token = data.token;
                            scope.model[scope.form.key[0]][scope.form.key[1]][data.index].mimeType = data.mimeType;
                            scope.model[scope.form.key[0]][scope.form.key[1]][data.index].size = data.size;
                        });
                    } else if (scope.form.key.length == 3) {
                        scope.uploadFile(file, scope.form.key, i).then(function(data) {
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][data.index].token = data.token;
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][data.index].mimeType = data.mimeType;
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][data.index].size = data.size;
                        });
                    } else if (scope.form.key.length == 4) {
                        scope.uploadFile(file, scope.form.key, i).then(function(data) {
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]][data.index].token = data.token;
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]][data.index].mimeType = data.mimeType;
                            scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]][data.index].size = data.size;
                        });
                    } else {
                        console.log('Error');
                    }
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

                    evt.config.file.filesProgress = progressPercentage;

                    if (scope.form.key.length == 1) {
                        scope.model[scope.form.key[0]][evt.config.fields.index].progress = progressPercentage;
                    } else if (scope.form.key.length == 2) {
                        scope.model[scope.form.key[0]][scope.form.key[1]][evt.config.fields.index].progress = progressPercentage;
                    } else if (scope.form.key.length == 3) {
                        scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][evt.config.fields.index].progress = progressPercentage;
                    } else if (scope.form.key.length == 4) {
                        scope.model[scope.form.key[0]][scope.form.key[1]][scope.form.key[2]][scope.form.key[3]][evt.config.fields.index].progress = progressPercentage;
                    } else {
                        console.log('Error');
                    }
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
