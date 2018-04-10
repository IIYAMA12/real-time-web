const gulp = require("gulp");
const sass = require("gulp-sass");
const cleanCSS = require("gulp-clean-css");
const minify = require("gulp-minify");

const startPath = "builder/";
const paths = {
	// scripts: ["scripts/local/*.js", "scripts/*.js"],
	scripts: [startPath + "js/*.js"],
	html: [startPath + "html/*.html"],
	styles: [startPath + "css/*.css"],
}



gulp.task("sass", function () {
	gulp
		.src("builder/css/*.scss") // Get the sass/scss file
        .pipe(sass({ includePaths: ["scss"] })) // Pipe the sass/scss through the sass()
        .pipe(cleanCSS({compatibility: "ie8"}))
		.pipe(gulp.dest("public/css")); // Output to the destination map style
});


 
gulp.task("compress", function() {
  gulp.src("builder/js/*.js")
    .pipe(minify({
        ext:{
            src:"-debug.js",
            min:".js"
        },
        exclude: ["tasks"],
        ignoreFiles: [".combo.js", "-min.js"]
    }))
    .pipe(gulp.dest("public/js"))
});


gulp.task("default", ["sass", "compress"], function () {
    gulp.watch("builder/css/*.scss", ["sass"]); // Watching all scss changes on changes in the background
    gulp.watch("builder/js/*.js", ["compress"]);
});


