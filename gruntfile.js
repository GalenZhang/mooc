module.exports = function(grunt){
	grunt.initConfig({
		watch: {
			jade: {
				files: ['views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'models/**/*.js', 'schemas/**/*.js'],
				//tasks: ['jshint'],
				options: {
					livereload: true
				}
			}
		},
		nodemon: {
			dev: {
				script: 'app.js',
				options: {
					file: 'app.js',
					args: [],
					ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
					watchedExtensions: ['js'],
					watchedFolders: ['./'],
					debug: true,
					delayTime: 1,
					env: {
						PORT: 3000
					},
					cwd: __dirname
				}
			}
		},

		mochaTest: {
			options: {
				reporter: 'spec'
			},
			src: ['test/**/*.js']
		},

		concurrent: {
			tasks: ['nodemon', 'watch'],
			options: {
				logConcurrentOutput: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');	// 文件添加、修改、删除，重新执行注册好的任务
	grunt.loadNpmTasks('grunt-nodemon');	// 实时监听app.js 文件变化
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-mocha-test');

	grunt.option('force', true); // 开发时使用，避免因语法错误，中断了整个服务
	grunt.registerTask('default', ['concurrent']);
	grunt.registerTask('test', ['mochaTest']);
};