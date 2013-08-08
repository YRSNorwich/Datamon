var WIDTH = 600;
var HEIGHT = 600;

var TILE_WIDTH = 64;
var TILE_HEIGHT = 64;
var CHUNK_WIDTH = 14*TILE_WIDTH;
var CHUNK_HEIGHT = 24*TILE_HEIGHT;
var CHUNK_X = 14;
var CHUNK_Y = 20;

var MOVE_SPEED = 5;

function convert(file, callback)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                callback(allText);
            }
        }
    }
    rawFile.send(null);
}

function get2DArray(x, y) {
    var array = new Array();
    array.length = x;
    for(var i = 0; i < array.length; i++) {
        array[i] = new Array();
        array[i].length = y;
    }

    return array;
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function collides(a, b) {
    return a.gamePosition.x < b.gamePosition.x + b.width &&
	   a.gamePosition.x + a.width > b.gamePosition.x &&
	   a.gamePosition.y < b.gamePosition.y + b.height &&
	   a.gamePosition.y + a.height > b.gamePosition.y;
}
