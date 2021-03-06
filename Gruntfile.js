/*
* BrainBrowser: Web-based Neurological Visualization Tools
* (https://brainbrowser.cbrain.mcgill.ca)
*
* Copyright (C) 2011 
* The Royal Institution for the Advancement of Learning
* McGill University
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* Author: Tarek Sherif  <tsherif@gmail.com> (http://tareksherif.ca/)
*/

module.exports = function(grunt) {
  "use strict";
  
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    BRAINBROWSER_VERSION: "<%= pkg.version %>",
    build_dir: "build/brainbrowser-<%= BRAINBROWSER_VERSION %>",
    release_dir: "public/common/release",
    license: grunt.file.read("license_header.txt"),
    concat: {
      options: {
        separator: ";",
        process: true
      },
      surface: {
        src: [
          "src/brainbrowser/lib/*.js",
          "src/brainbrowser/surface-viewer.js",
          "src/brainbrowser/surface-viewer/**/*.js"
        ],
        dest: "tmp/brainbrowser.surface-viewer.js"
      },
      volume: {
        src: [
          "src/brainbrowser/lib/*.js",
          "src/brainbrowser/volume-viewer.js",
          "src/brainbrowser/volume-viewer/**/*.js"
        ],
        dest: "tmp/brainbrowser.volume-viewer.js"
      }
    },
    uglify: {
      options: {
        report: "min",
        banner: "<%= license %>\n" +
                "/*\n" +
                "* BrainBrowser v<%= pkg.version %>\n" +
                "*\n" +
                "* Author: Tarek Sherif  <tsherif@gmail.com> (http://tareksherif.ca/)\n" +
                "* Author: Nicolas Kassis\n" +
                "*/\n"
      },
      surface: {
        files: {
          "<%= build_dir %>/brainbrowser.surface-viewer.min.js": "<%= concat.surface.dest %>"
        }
      },
      volume: {
        files: {
          "<%= build_dir %>/brainbrowser.volume-viewer.min.js": "<%= concat.volume.dest %>"
        }
      },
      workers: {
        files: {
          "<%= build_dir %>/workers/mniobj.worker.js": "src/brainbrowser/workers/mniobj.worker.js",
          "<%= build_dir %>/workers/wavefrontobj.worker.js": "src/brainbrowser/workers/wavefrontobj.worker.js",
          "<%= build_dir %>/workers/freesurferasc.worker.js": "src/brainbrowser/workers/freesurferasc.worker.js",
          "<%= build_dir %>/workers/mniobj.intensity.worker.js": "src/brainbrowser/workers/mniobj.intensity.worker.js",
          "<%= build_dir %>/workers/freesurferasc.intensity.worker.js": "src/brainbrowser/workers/freesurferasc.intensity.worker.js",
          "<%= build_dir %>/workers/deindex.worker.js": "src/brainbrowser/workers/deindex.worker.js"
        }
      }
    },
    jshint: {
      options: {
        eqeqeq: true,
        undef: true,
        unused: true,
        strict: true,
        indent: 2,
        immed: true,
        newcap: true,
        nonew: true,
        trailing: true
      },
      grunt: {
        src: "Gruntfile.js",
        options: {
          node: true
        }
      },
      brainbrowser: {
        options: {
          browser: true,
          jquery: true,
          globals: {
            THREE: true,
            BrainBrowser: true,
            alert: true,
            console: true
          }
        },
        src: [
          "<%= concat.surface.src %>",
          "<%= concat.volume.src %>",
          "examples/js/surface-viewer-demo.js",
          "examples/js/volume-viewer-demo.js",
        ]
      },
      workers: {
        options: {
          worker: true,
          globals: {
            Float32Array: true
          }
        },
        src: ["src/brainbrowser/workers/*.js"]
      }
    },
    clean: {
      tmp: "tmp/*.js",
      docs: ["docs/docular/.htaccess", "docs/docular/favicon.ico", "docs/docular/configs", "docs/docular/controller", "docs/docular/php"]
    },
    compress: {
      release: {
        options: {
          archive: "release/brainbrowser-<%= BRAINBROWSER_VERSION %>.tar.gz"
        },
        expand: true,
        cwd: "build/",
        src: "brainbrowser-<%= BRAINBROWSER_VERSION %>/**"
      }
    },
    docular: {
      docular_webapp_target: "docs/docular",
      docular_partial_home: "docs/docular_brainbrowser_home.html",
      groups: [
        {
          groupTitle: "BrainBrowser v<%= pkg.version %>",
          groupId: "brainbrowser",
          showSource: false,
          sections: [
            {
              title: "Utilities",
              id: "utils",
              scripts: ["src/brainbrowser/lib"]
            },
            {
              title: "Surface Viewer",
              id: "surface-viewer",
              scripts: ["src/brainbrowser/surface-viewer.js", "src/brainbrowser/surface-viewer"]
            },
            {
              title: "Volume Viewer",
              id: "volume-viewer",
              scripts: ["src/brainbrowser/volume-viewer.js", "src/brainbrowser/volume-viewer"]
            }
          ]
        }
      ]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-compress");
  grunt.loadNpmTasks("grunt-docular");

  grunt.registerTask("compile", ["clean", "concat", "uglify"]);
  grunt.registerTask("build", ["jshint", "compile", "compress"]);
  grunt.registerTask("docs", ["docular", "clean:docs"]);
  grunt.registerTask("default", "jshint");
};
