module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-wiredep');    // grunt-wiredep automates adding bower_components links
    grunt.loadNpmTasks('grunt-script-link-tags');   // grunt-script-link-tags automates adding custom js,css,etc links

    grunt.initConfig({
        wiredep: {
            task: {
                // Point to the files that should be updated when
                // you run `grunt wiredep`
                src: [
                    'index.html',        // import css
                ],
                options: {
                    // See wiredep's configuration documentation for the options
                    // you may pass:

                    // https://github.com/taptapship/wiredep#configuration
                }
            }
        },
        tags: {
            task: {
                options: {
                    scriptTemplate: '<script src="{{ path }}"></script>',
                    linkTemplate: '<link rel="stylesheet" href="{{ path }}"/>',
                    openTag: '<!-- start script-link-tags -->',
                    closeTag: '<!-- end script-link-tags -->'
                },
                src: [
                    'app/*.js',
                    'app/styles/*.css'
                ],
                dest: 'index.html'
            }
        }
    });

    grunt.registerTask('default', [
        'wiredep',
        'tags'
    ]);

};