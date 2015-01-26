var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	gstylus = require('gulp-stylus'),
	stylus = require('stylus'),
	rimraf = require('gulp-rimraf'),
	fs = require('fs'),
	filename = 'path/to/sheet.styl',
	input = fs.readFileSync(filename, 'utf8'),
	output = filename.replace(/.styl/, '.css'),
	mapFile = output + '.map',
	assert = require('assert');


function checkOutput(css) {
	if(css.indexOf('subFolder/image-inside-subFolder.png') < 0 ||
		css.indexOf('sourceMappingURL=sheet.css.map') < 0) {
		console.error('oh oh. resolving of url did not work as expected', css);
	} else {
		console.log('resolving of url + sourcemaps succeeded', css);
	}
}

gulp.task('cleanOutput', function(){
	return gulp.src([output, mapFile]).pipe(rimraf());
});

gulp.task('gulp-stylus-task', function(){
	return gulp.src(filename)
		.pipe(sourcemaps.init())
		.pipe(gstylus({
			define: {
				url: stylus.resolver()
			},
			//sourcemap: {
			//	basePath: 'path/to'
			//}
		}))
		.pipe(sourcemaps.write())
		.on('error', function(e) {
			console.log(e);
		})
		.pipe(gulp.dest('.'));
});

gulp.task('gulp-stylus', ['gulp-stylus-task'], function(){
	checkOutput(fs.readFileSync(output, 'utf8'));
});


gulp.task('stylus-standalone', ['cleanOutput'], function(done){

	var style = stylus(input)
		.set('filename', filename)
		.set('sourcemap', {
			basePath: 'path/to'
		})
		.define('url', stylus.resolver());

	style.render(function(err, css){
		if(err) {
			throw new Error(err);
		}
		fs.writeFileSync(output, css);
		fs.writeFileSync(mapFile, JSON.stringify(style.sourcemap));
		checkOutput(css);
		done();
	});

});
