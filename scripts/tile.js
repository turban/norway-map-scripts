var fs = require('fs-extra'),
	exec = require('child_process').exec; // https://www.npmjs.org/package/fs-extra

var bounds = [-80000, 6445000, 1120000, 7945000],
	tileSize = 50000, // 50 km
	resolution = 10, // 10m/px
	pixelSize = tileSize / resolution,
	tiles = [{x: 18, y: 0}, {x: 19, y: 0}, {x: 20, y: 0}, {x: 21, y: 0}, {x: 22, y: 0}, {x: 23, y: 0}, {x: 16, y: 1}, {x: 17, y: 1}, {x: 18, y: 1}, {x: 19, y: 1}, {x: 20, y: 1}, {x: 21, y: 1}, {x: 22, y: 1}, {x: 23, y: 1}, {x: 14, y: 2}, {x: 15, y: 2}, {x: 16, y: 2}, {x: 17, y: 2}, {x: 18, y: 2}, {x: 19, y: 2}, {x: 20, y: 2}, {x: 21, y: 2}, {x: 22, y: 2}, {x: 23, y: 2}, {x: 13, y: 3}, {x: 14, y: 3}, {x: 15, y: 3}, {x: 16, y: 3}, {x: 17, y: 3}, {x: 18, y: 3}, {x: 19, y: 3}, {x: 20, y: 3}, {x: 22, y: 3}, {x: 23, y: 3}, {x: 13, y: 4}, {x: 14, y: 4}, {x: 15, y: 4}, {x: 16, y: 4}, {x: 17, y: 4}, {x: 18, y: 4}, {x: 19, y: 4}, {x: 20, y: 4}, {x: 22, y: 4}, {x: 11, y: 5}, {x: 12, y: 5}, {x: 13, y: 5}, {x: 14, y: 5}, {x: 15, y: 5}, {x: 16, y: 5}, {x: 17, y: 5}, {x: 18, y: 5}, {x: 19, y: 5}, {x: 20, y: 5}, {x: 10, y: 6}, {x: 11, y: 6}, {x: 12, y: 6}, {x: 13, y: 6}, {x: 14, y: 6}, {x: 15, y: 6}, {x: 17, y: 6}, {x: 18, y: 6}, {x: 19, y: 6}, {x: 9, y: 7}, {x: 10, y: 7}, {x: 11, y: 7}, {x: 12, y: 7}, {x: 13, y: 7}, {x: 14, y: 7}, {x: 15, y: 7}, {x: 9, y: 8}, {x: 10, y: 8}, {x: 11, y: 8}, {x: 12, y: 8}, {x: 13, y: 8}, {x: 14, y: 8}, {x: 8, y: 9}, {x: 9, y: 9}, {x: 10, y: 9}, {x: 11, y: 9}, {x: 12, y: 9}, {x: 9, y: 10}, {x: 10, y: 10}, {x: 11, y: 10}, {x: 12, y: 10}, {x: 8, y: 11}, {x: 9, y: 11}, {x: 10, y: 11}, {x: 11, y: 11}, {x: 12, y: 11}, {x: 8, y: 12}, {x: 9, y: 12}, {x: 10, y: 12}, {x: 11, y: 12}, {x: 8, y: 13}, {x: 9, y: 13}, {x: 10, y: 13}, {x: 11, y: 13}, {x: 7, y: 14}, {x: 8, y: 14}, {x: 9, y: 14}, {x: 10, y: 14}, {x: 11, y: 14}, {x: 7, y: 15}, {x: 8, y: 15}, {x: 9, y: 15}, {x: 10, y: 15}, {x: 5, y: 16}, {x: 6, y: 16}, {x: 7, y: 16}, {x: 8, y: 16}, {x: 9, y: 16}, {x: 10, y: 16}, {x: 4, y: 17}, {x: 5, y: 17}, {x: 6, y: 17}, {x: 7, y: 17}, {x: 8, y: 17}, {x: 9, y: 17}, {x: 2, y: 18}, {x: 3, y: 18}, {x: 4, y: 18}, {x: 5, y: 18}, {x: 6, y: 18}, {x: 7, y: 18}, {x: 8, y: 18}, {x: 1, y: 19}, {x: 2, y: 19}, {x: 3, y: 19}, {x: 4, y: 19}, {x: 5, y: 19}, {x: 6, y: 19}, {x: 7, y: 19}, {x: 8, y: 19}, {x: 0, y: 20}, {x: 1, y: 20}, {x: 2, y: 20}, {x: 3, y: 20}, {x: 4, y: 20}, {x: 5, y: 20}, {x: 6, y: 20}, {x: 7, y: 20}, {x: 8, y: 20}, {x: 0, y: 21}, {x: 1, y: 21}, {x: 2, y: 21}, {x: 3, y: 21}, {x: 4, y: 21}, {x: 5, y: 21}, {x: 6, y: 21}, {x: 7, y: 21}, {x: 8, y: 21}, {x: 0, y: 22}, {x: 1, y: 22}, {x: 2, y: 22}, {x: 3, y: 22}, {x: 4, y: 22}, {x: 5, y: 22}, {x: 6, y: 22}, {x: 7, y: 22}, {x: 8, y: 22}, {x: 9, y: 22}, {x: 0, y: 23}, {x: 1, y: 23}, {x: 2, y: 23}, {x: 3, y: 23}, {x: 4, y: 23}, {x: 5, y: 23}, {x: 6, y: 23}, {x: 7, y: 23}, {x: 8, y: 23}, {x: 9, y: 23}, {x: 0, y: 24}, {x: 1, y: 24}, {x: 2, y: 24}, {x: 3, y: 24}, {x: 4, y: 24}, {x: 5, y: 24}, {x: 6, y: 24}, {x: 7, y: 24}, {x: 8, y: 24}, {x: 0, y: 25}, {x: 1, y: 25}, {x: 2, y: 25}, {x: 3, y: 25}, {x: 4, y: 25}, {x: 5, y: 25}, {x: 6, y: 25}, {x: 7, y: 25}, {x: 8, y: 25}, {x: 0, y: 26}, {x: 1, y: 26}, {x: 2, y: 26}, {x: 3, y: 26}, {x: 4, y: 26}, {x: 5, y: 26}, {x: 6, y: 26}, {x: 7, y: 26}, {x: 8, y: 26}, {x: 0, y: 27}, {x: 1, y: 27}, {x: 2, y: 27}, {x: 3, y: 27}, {x: 4, y: 27}, {x: 5, y: 27}, {x: 6, y: 27}, {x: 7, y: 27}, {x: 0, y: 28}, {x: 1, y: 28}, {x: 2, y: 28}, {x: 3, y: 28}, {x: 4, y: 28}, {x: 5, y: 28}, {x: 6, y: 28}, {x: 7, y: 28}, {x: 1, y: 29}, {x: 2, y: 29}, {x: 3, y: 29}, {x: 4, y: 29}],
	tileCount = 0;

function run (command, callback){
	console.log(command);
	exec(command, function (err, stdout, stderr) {
		if (err) throw err;
		if (err) throw stderr;
		callback(stdout);
	});
}

function createTile (x, y, callback) {
	var west = bounds[0] + (x * tileSize),
		north = bounds[3] - (y * tileSize),
		east = west + tileSize,
		south = north - tileSize,	
		tileBounds = [west, south, east, north],
		folder =  x + '/' + y + '/';

	console.log("tile", tileBounds);

	// Create folder
	fs.mkdirsSync(folder);
	fs.removeSync(folder + 'dem.tif');

	// Extract DEM data
	run('gdalwarp -te ' + tileBounds.join(' ') + ' -ts ' + pixelSize + ' ' + pixelSize + ' -r bilinear -co compress=lzw ../dem/utm33/utm33_10m.vrt ' + folder + 'dem.tif', function () {

		// Convert to ESRI ASCII grid supported by Terrain Sculptor 
		run('gdal_translate -of AAIGrid ' + folder + '/dem.tif ' + folder + '/dem.asc', function (){

		});	

		// Create color relief
		run('gdaldem color-relief -co compress=lzw ' + folder + 'dem.tif ../styles/color-relief.txt ' + folder + 'color-relief.tif', function(){
			//createMap(relief = true, hillshade, slopeshade, slope);
		});	

		// Create hillshade
		/*
		run('gdaldem hillshade -co compress=lzw ' + folder + 'dem.tif ' + folder + 'hillshade.tif', function(){


		});
		*/

		// Create sculptor hillshade
		run('gdaldem hillshade -co compress=lzw ' + folder + 'sculp-dem.asc ' + folder + 'sculp-hillshade.tif', function(){

			// Create snow hillshade
			run('gdaldem color-relief -co compress=lzw ' + folder + 'sculp-hillshade.tif ../styles/hillshade-snow.txt ' + folder + 'hillshade-snow.tif', function(){
				//createMap(relief, hillshade = true, slopeshade, slope);
			});

		});

		// Create snow hillshade
		/*
		run('gdaldem color-relief -co compress=lzw ' + folder + 'hillshade.tif ../styles/hillshade-snow.txt ' + folder + 'hillshade-snow.tif', function(){
			//createMap(relief, hillshade = true, slopeshade, slope);
		});
		*/

	});



	callback();
}

// Create tileset
function createTileset (tile) {
	createTile(tile.x, tile.y, function(file) {
		if (++tileCount < tiles.length) {
			createTileset(tiles[tileCount])
		}
	});
};

//createTileset(tiles[0]);

createTile(4, 22, function (){

});