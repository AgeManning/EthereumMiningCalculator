module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-wiredep');    // automates adding bower_components links
  grunt.loadNpmTasks('grunt-script-link-tags');   // automates adding our app's js,css,etc links
  grunt.loadNpmTasks('grunt-contrib-connect');  // creates a static web server

  grunt.initConfig({
    wiredep: {
      task: {
        src: [
          'index.html',
        ]
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
          'app/**/*.js',
          'app/styles/*.css'
        ],
        dest: 'index.html'
      }
    },
    connect: {
      task: {
        options: {
          directory: 'app',
          port: 9001,
          keepalive: true
        }
      },
    }
  });
  
  grunt.registerTask('default', [
    'wiredep',
    'tags',
    'connect'
  ]);

};