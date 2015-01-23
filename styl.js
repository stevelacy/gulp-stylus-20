var stylus = require('stylus'),
	argv = require('yargs').argv,
	fs = require('fs'),
	input = fs.readFileSync(argv.filename, 'utf8'),
  output = argv.filename.replace(/.styl/, '.css'),
  style;

style = stylus(input)
  .set('filename', argv.filename)
  .set('sourcemap', {
    basePath: argv.filename.replace(/(.*)\/.*$/, '$1')
  })
  .define('url', stylus.resolver());

style.render(function(err, css){
    if(err) {
      throw new Error(err);
    } 
    fs.writeFileSync(output, css);
    fs.writeFileSync(output + '.map', JSON.stringify(style.sourcemap));
    if(css.indexOf('subFolder/image-inside-subFolder.png') === -1) {
    	console.log('oh oh. Conversion did not succeed', css);
    } else {
      console.log('Converted '  + argv.filename + ' into ' + output, css);
    }
  });