var gulp = require ('gulp'),
	sass = require ('gulp-sass'),
	minify = require ('gulp-minify'),
	clean = require ('gulp-clean'),
	exec = require ('child_process').exec,
	nodemon = require ('gulp-nodemon'),
	livereload = require ('gulp-livereload'),
	notify = require ('gulp-notify');

gulp.task ('test-system', () => {
    console.log ('system is up and running..');
});

gulp.task ('default', () => {
});

// gulp sass task
gulp.task ('build-stylesheets', () => {
    gulp.src ('src/style/sass/**/*.scss')
        .pipe (sass().on ('error', sass.logError))
        .pipe (gulp.dest ('./build/css'));
});

/**
* Real time server with auto update and reloading
*/
gulp.task ('server', () => {
	gulp.task ('server', () => {
		// the gulp will watch over all the js files and realod 
		// the app as soon as the changes are detected in the system
		livereload.listen ();
		nodemon ({
			script: './src/server.js',
			ext: 'js'
		}).on ('restart', () => {
			gulp.src ('.`/src/server.js')
				.pipe (livereload())
				.pipe (notify ('Reloading Snippets.. Hold on...'));
		});
	});
});

//https://www.npmjs.com/package/gulp-minify
// minify the javascript files and stylesheets and html files]
// THROWING ERROR
gulp.task ('minify-scripts', () => {
	gulp.src ('./src/**/*.js')
		.pipe (minify ({
			ext:{
				src: '-debug.js',
				min: '.js'
			}
		}))
		.pipe (gulp.dest ('./build'));
});

/**
*	gulp task to clean up the dist folder
*/
gulp.task ('clean', () => {
	gulp.src ('./dest/**/*.*')
	.pipe (clean ({force: true}))
	.pipe (gulp.dest ('build'));
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
gulp.task ('move', () =>{
	gulp.src (filesToMove, {base: './src'})
	.pipe (gulp.dest ('build'));
});