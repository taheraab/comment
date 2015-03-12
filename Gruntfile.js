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
    watch: {
      styles: {
        files: 'sass/*.scss',
        tasks: ['sass']
      }
    }
    
  });
  
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');  
  grunt.registerTask('default', ['sass', 'watch']);
  
}
