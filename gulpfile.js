var gulp = require('gulp'),
	sourcemaps = require('gulp-sourcemaps'),
	gstylus = require('gulp-stylus'),
	stylus = require('stylus'),
	rimraf = require('gulp-rimraf'),
	fs = require('fs'),
	filename = 'path/to/sheet.styl',
	input = fs.readFileSync(filename, 'utf8'),
	output = filename.replace(/.styl/, '.css'),
	mapFile = output + '.map';


gulp.task('cleanOutput', function(){
	return gulp.src([output, mapFile]).pipe(rimraf());
});

gulp.task('gulp-stylus', ['cleanOutput'], function(){
	return gulp.src(filename)
		.pipe(gstylus({
			define: {
				url: stylus.resolver()
			},
			sourcemap: {
				basePath: 'path/to'
			}
		}))
		.pipe(gulp.dest('.'))
		.on('data', function(data){
			console.log('data', data);
		})
		.on('error', function(err){
			console.log('gulp-stylus failed', err);
		});
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
		console.log(css);
		done();
	});

});
