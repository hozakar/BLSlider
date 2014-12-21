module.exports = function(grunt) {

    grunt.initConfig({
        uglify: {
            options: {
                mangle: true,
                compress: true,
                banner: "/* \n" +
                        "**  BLSlider 0.0.0\n" +
                        "**  https://github.com/hozakar/BLSlider\n" +
                        "**\n" +
                        "**  Copyright 2014, Hakan Ozakar <hozakar@gmail.com>\n" +
                        "**  http://beltslib.net\n" +
                        "**\n" +
                        "**  CC0 1.0 Universal Licence\n" +
                        "**  https://creativecommons.org/publicdomain/zero/1.0/\n" +
                        "*/\n"
            },
            target: {
                files: {
                    "dist/blslider.min.js" : ["dist/blslider.js"]
                }
            }
        },
        concat: {
            options: {
                banner: "/* \n" +
                        "**  BLSlider 0.0.0\n" +
                        "**  https://github.com/hozakar/BLSlider\n" +
                        "**\n" +
                        "**  Copyright 2014, Hakan Ozakar <hozakar@gmail.com>\n" +
                        "**  http://beltslib.net\n" +
                        "**\n" +
                        "**  CC0 1.0 Universal Licence\n" +
                        "**  https://creativecommons.org/publicdomain/zero/1.0/\n" +
                        "*/\n" +
                        "(function ($) {\n",
                footer: "\n}(jQuery));"
            },
            dist: {
                src: ['src/blslider-main.js', 'src/prepdom.js', 'src/timer.js', 'src/move.js', 'src/animation.js'],
                dest: 'dist/blslider.js'
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            target: {
                src: ["dist/blslider.js"]
            }
        },
        sass: {
            dist: {
                options: {
                    style: "expanded",
                    sourcemap: 'none',
                    update: true
                },
                files: {
                    "dist/blslider.css": "src/blslider.scss"
                }
            }
        },
        watch: {
            scripts: {
                files: ["src/*.js", "src/*.scss", "specs/*"],
                tasks: ["run-tests"]
            }
        },
        jasmine: {
            pivotal: {
                src: 'dist/blslider.js',
                options: {
                    vendor: ["jquery.min.js"],
                    specs: 'specs/*.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    grunt.registerTask("default", [
        "concat",
        "sass",
        "uglify",
        "jasmine",
        "jshint"
    ]);
    grunt.registerTask("run-tests", [
        "sass",
        "concat",
        "jasmine",
        "jshint"
    ]);
};