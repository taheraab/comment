module.exports = function(grunt) {
  grunt.initConfig({
    sass:{
      dist: {
        files: [{
          expand: true,
          cwd: 'sass/',
          src: ['*.scss'],
          dest: 'www/styles',
          ext: '.css'
        }]
      }
    },
    
  });
  
  grunt.loadNpmTasks('grunt-contrib-sass');  
  grunt.registerTask('default', ['sass']);
  
}
