/*
	Gruntfile.js for shaojing.wang - master
  Latest modified 2016-10-12 13:10
*/

module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
    clean: {
      js: ['build/js/*.js'],
      css: ['build/css/*.css']
    },
		uglify: {
			options: {
				banner: ' /*! Javascript <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd hh:mm:ss") %> */\n ',
        footer: ' /*! shaojing.wang All rights reserved. */',
        beautify: false,
        mangle: false // false to prevent mangle the input files.
			},
			runUglify: {
				src: ['js/*.js', '!js/*.min.js'],
				dest: 'build/js/combo.js'
			}
		},
		cssmin: {
			runCssmin: {
				src: ['css/*.css', '!css/*.min.css'],
				dest: 'build/css/combo.css'
			}
		},
    concat: {
      dist: {
        src: ['build/js/*.js'],
        dest: 'build/js/con/concat.js'
      }
    },
		my_property: 'whatever'
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', [ 'clean', 'uglify', 'cssmin']); // Here define the order of execution, first running clean.


};
