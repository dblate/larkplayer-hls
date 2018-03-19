module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                    sourceMap: false,
                    presets: ['env']
                },
                dist: {
                    files: [{
                        expand: true,
                        cwd: './',
                        src: ['*.js'],
                        dest: './lib'
                    }]
                }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['./dist/<%= pkg.name %>.js']
                }
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {
                            presets: ['env']
                        }],
                        ["browserify-shim"]
                    ],
                    browserifyOptions: {
                        standalone: '<%= pkg.name %>'
                    }
                },
                files: {
                    './dist/<%= pkg.name %>.js': ['./src/<%= pkg.name %>.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-babel');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['browserify']);
    // grunt.registerTask('default', ['less', 'browserify', 'copy']);

    grunt.registerTask('generate-lib', ['babel'])
};