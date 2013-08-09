var WIDTH = 600;
var HEIGHT = 600;

var TILE_WIDTH = 64;
var TILE_HEIGHT = 64;
var CHUNK_X = 14;
var CHUNK_Y = 20;
var CHUNK_WIDTH = CHUNK_X*TILE_WIDTH;
var CHUNK_HEIGHT = CHUNK_Y*TILE_HEIGHT;

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
function teleport(dudeguy,point1){
        dudeguy.gamePosition.x = point1.x;
        dudeguy.gamePosition.y = point1.y;
      
        
}
function minimap2game(coords,dudepos,clickPos){
      //var mapPos = new Point(Math.floor(dude.gamePosition.x / 64), dude.gamePosition.y / 64);
      var base = new Point((coords.x), (coords.y));
     
      var finalpos = new Point((((base.x)*64)/clickPos.x)+150,(((base.y)*64)/clickPos.y)+100);
      //console.log(dudepos);
      //console.log(base);
      //console.log(clickPos);
      //console.log(finalpos);
      console.log(finalpos);
      return finalpos;
}
function collides(a, b) {
    return a.gamePosition.x < b.gamePosition.x + b.width &&
	   a.gamePosition.x + a.width > b.gamePosition.x &&
	   a.gamePosition.y < b.gamePosition.y + b.height &&
	   a.gamePosition.y + a.height > b.gamePosition.y;
}
