module.exports = function(grunt) {

	var banner = 
				'/*!\n' +
				' * SandwichJS v<%= pkg.version %>\n' +
				' * <%= pkg.homepage %>\n' +
				' *\n' +
				' * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>\n' +
		        ' * Licensed <%= pkg.license %>\n' +
				' *\n' +
				' * Build date <%= grunt.template.today("yyyy-mm-dd HH:MM") %>\n' +
				' */\n';

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		// Concat
		concat: {
			
			dist: {
				options: {

					banner: banner
				},
				src: [

					'source/intro.js',

					// Core
					'source/application.js',
					'source/error.js',
					// 'source/model.js',
					// 'source/view.js',
					'source/router.js',
					// 'source/binding.js',
					// 'source/collection.js',

					'source/outro.js'
				],
				dest: 'dist/sandwich.js'
			}
		},
		/*jshint: {

			options: {
                jshintrc: '.jshintrc'
            },
            afterconcat: ['dist/pbjs.js']
		},*/
		// Uglify
		uglify: {

			options: {

				report: 'gzip',
				preserveComments: 'some'
			},
			build: {

				src: ["dist/sandwich.js"],
				dest: "dist/sandwich.min.js"
			}
		},
		watch: {
			scripts: {
				files: ['**/*.js'],
				tasks: ['default'],
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'uglify']);
	grunt.registerTask('test', ['jshint']);

};
