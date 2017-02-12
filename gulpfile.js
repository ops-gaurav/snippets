var gulp = require ('gulp');
var sass = require ('gulp-sass');
var minify = require ('gulp-minify');

gulp.task ('test-system', () => {
    console.log ('system is up and running..');
});

gulp.task ('default', () => {
});

// gulp sass task
gulp.task ('build-stylesheets', () => {
    gulp.src ('src/style/sass/**/*.scss')
        .pipe (sass().on ('error', sass.logError))
        .pipe (gulp.dest ('build/css'));
});


// minify the javascript files and stylesheets and html files
gulp.task ('minify-scripts', () => {

});