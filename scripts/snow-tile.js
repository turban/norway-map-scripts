var fs = require('fs-extra'), // https://www.npmjs.org/package/fs-extra
	exec = require('child_process').exec,
	mapnik = require('mapnik');

// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();

var bounds = [-80000, 6445000, 1120000, 7945000],
	tileSize = 50000, // 50 km
	resolution = 10, // 10m/px
	pixelSize = tileSize / resolution;

function run (command, callback){
	console.log(command);
	exec(command, function (err, stdout, stderr) {
		if (err) throw err;
		if (err) throw stderr;
		callback(stdout);
	});
}

function createTile (x, y, callback) {
	var tile = new mapnik.Map(pixelSize, pixelSize),
		west = bounds[0] + (x * tileSize),
		north = bounds[3] - (y * tileSize),
		east = west + tileSize,
		south = north - tileSize,	
		tileBounds = [west, south, east, north],
		folder = '../grid/' + x + '/' + y + '/';

	console.log("tile", x, y, tileBounds);

	// Create folder
	fs.mkdirsSync(folder);

	// Copy style file
	fs.copySync('../styles/snowmap.xml', folder + 'snowmap.xml');



	tile.load(folder + 'snowmap.xml', function (err, tile) {
		if (err) throw err;

		tile.extent = tileBounds;

		var im = new mapnik.Image(pixelSize, pixelSize);

		tile.render(im, function (err, im) {
			if (err) throw err;
			im.encode('png', function(err, buffer) {
				if (err) throw err;
				fs.writeFile(folder + 'map.png', buffer, function (err) {
					if (err) throw err;

					// Convert to GeoTIFF
					var file = folder + 'map.tif';
					run('gdal_translate -of GTiff -a_ullr ' + [west, north, east, south].join(' ') + ' -a_srs EPSG:32633 ' + folder + 'map.png ' + file, function(){
						//fs.removeSync(folder);
						//callback(file);
					});
				});
			});
		});

	});

}


createTile(4, 22, function (){

});