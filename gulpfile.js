var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	gstylus = require('gulp-stylus'),
	stylus = require('stylus'),
	rimraf = require('gulp-rimraf'),
	fs = require('fs'),
	filename = 'to/sheet.styl',
	output = filename.replace(/.styl/, '.css'),
	mapFile = output + '.map',
	assert = require('assert');


function checkOutput(css) {
	if(css.indexOf('subFolder/image-inside-subFolder.png') < 0 ||
		css.indexOf('sourceMappingURL=../to/sheet.css.map') < 0) {
		console.error('oh oh. resolving of url did not work as expected', css);
	} else {
		console.log('resolving of url + sourcemaps succeeded', css);
	}
}

gulp.task('cleanOutput', function(){
	return gulp.src(['./to/**/*.css','./to/**/*.map']).pipe(rimraf());
});

gulp.task('gulp-stylus-task', function(){
	// need to use wildcard to write css/map-files to correct path
	return gulp.src('./path/**/*.styl')
		.pipe(sourcemaps.init())
		.pipe(gstylus({
			define: {
				url: stylus.resolver()
			}
		}))
		.pipe(sourcemaps.write('.'))
		.on('error', function(e) {
			console.log(e);
		})
		.pipe(gulp.dest('.'));
});

gulp.task('gulp-stylus', ['gulp-stylus-task'], function(){
	checkOutput(fs.readFileSync(output, 'utf8'));
});
