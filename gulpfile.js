var gulp = require ('gulp');
var sass = require ('gulp-sass');
var minify = require ('gulp-minify');
var clean = require ('gulp-clean');

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


//https://www.npmjs.com/package/gulp-minify
// minify the javascript files and stylesheets and html files
gulp.task ('minify-scripts', () => {

});

/**
*	gulp task to clean up the dist folder
*/
gulp.task ('clean', () => {
	gulp.src ('./dest/**/*.*')
	.pipe (clean ({force: false}))
	.pipe (gulp.dest ('./dist'));
});

const filesToMove = [
	'./src/data/**/*.*',
	'./src/img/**/*.*',
	'./src/routers/**/*.*',
	'./src/schemas/**/*.*',
	'./src/views/**/*.*',
	'./src/*.*'
];

/**
*	gulp task to move files from src to dist directory
*/
gulp.task ('move', ['clean'], () =>{
	gulp.src (filesToMove, {base: './src'})
	.pipe (gulp.dest ('build'));
});