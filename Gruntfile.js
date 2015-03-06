module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/schema-form-file-type.js',
                dest: 'dist/schema-form-file-type.min.js'
            }
        },

        ngtemplates: {
            app:{
                src:        'src/directives/decorators/bootstrap/files.html',
                dest:       'tmp-files-template.js',
                options:    {
                    htmlmin:  { collapseWhitespace: true, collapseBooleanAttributes: true },
                    bootstrap:  function(module, script) {
                        return "angular.module('ngSchemaFormFileType').run(['$templateCache', function($templateCache) {" + script + "}]);";
                    },
                    url:    function(url) { return 'files.html'; }
                }
            }
        },

        concat:   {
            app:    {
                src:  [ 'dist/schema-form-file-type.min.js', 'tmp-files-template.js' ],
                dest:  'dist/schema-form-file-type.min.js' 
            }
        },

        clean: ["tmp-files-template.js"],
        
        watch: {
            scripts: {
                files: ['src/schema-form-file-type.js', 'src/directives/decorators/bootstrap/files.html'],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        }

    }


    );

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'ngtemplates', 'concat', 'clean']);

};