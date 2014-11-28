var fs = require('fs-extra'), // https://www.npmjs.org/package/fs-extra
	request = require('request'),
	pngparse = require('pngparse'),
	Png = require('png').Png,
	exec = require('child_process').exec;

var date = '2014-11-23',
	bounds = [-80000, 6445000, 1120000, 7945000],
	resolution = 1000, 
	width = (bounds[2] - bounds[0]) / resolution, 
	height = (bounds[3] - bounds[1]) / resolution,	
	url = 'http://arcus.nve.no/WMS_server/wms_server.aspx?&request=GetMap&service=WMS&transparent=true&format=image%2Fpng&bgcolor=0xffffff&version=1.1.1&layers=ski&styles=&TIME=' + date + '&bbox=' + bounds.join() + '&srs=EPSG%3A32633&width=' + width + '&height=' + height,
	snow = {
		//'510': 'Lite', // 255 + 255 + 0
		'640': 'Våt',  // 222 + 163 + 255
		'622': 'Tørr'  // 145 + 222 + 255
	};

function run (command, callback){
	console.log(command);
	exec(command, function (err, stdout, stderr) {
		if (err) throw err;
		if (err) throw stderr;
		callback(stdout);
	});
}

// Add CRS to geojson file
function addCrs (file, callback){
	fs.readJson(file, function(err, geojson) {
		if (err) throw err;

		geojson.crs = {
			type: 'name',
			properties: {
				name: 'urn:ogc:def:crs:EPSG::32633'
			}
		};

		fs.writeJson(file, geojson, function(err){
			if (err) throw err;
			callback();
		});
	});
}

request({ url: url, encoding: null }, function (err, response, body) {
	if (err) throw err;

	pngparse.parseBuffer(body, function(err, image) {
		if (err) throw err;

		var buffer = image.data,
			out = new Buffer(image.width * image.height * 3); 

		for (var i = 0; i < image.width * image.height; i++) {
			var value = (buffer[i * 3] + buffer[i * 3 + 1] + buffer[i * 3 + 2]).toString(),
	  			y = Math.floor(i / image.width),
				x = i % image.width;

			if (snow[value]) {
				out[i * 3] = 0;
				out[i * 3 + 1] = 0;
				out[i * 3 + 2] = 0;
			} else {
				out[i * 3] = 255;
				out[i * 3 + 1] = 255;
				out[i * 3 + 2] = 255;
			}
		}

		var png = new Png(out, image.width, image.height, 'rgb'),
			png_image = png.encodeSync(),
			folder = '../snow/';

		fs.writeFile(folder + date + '.png', png_image.toString('binary'), 'binary', function (err) {
			if (err) throw err;

			// Convert to pnm format supported by potrace
			run('gdal_translate -of PNM -ot Byte ' + folder + date + '.png ' + folder + date + '.pnm', function(){

				// Vectorize snow surface
				run('potrace -t 1 -b geojson ' + folder + date + '.pnm -o ' + folder + date + '.geojson -x ' + resolution + ' -L ' + bounds[0] +' -B ' + bounds[1], function(){
					addCrs(folder + date + '.geojson', function(){
						console.log('DONE!');
					});
				});
			});
		});
	});
});