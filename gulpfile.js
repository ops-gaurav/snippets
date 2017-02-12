var gulp = require ('gulp');
var sass = require ('gulp-sass');

gulp.task ('default', () => {
});

// gulp sass task
gulp.task ('build-stylesheets', () => {
    gulp.src ('src/style/sass/**/*.scss')
        .pipe (sass().on ('error', sass.logError))
        .pipe (gulp.dest ('build/css'));
});


// minify the javascript files and stylesheets and html files
glup.task ('minify-scripts', () => {

});