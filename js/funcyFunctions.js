var WIDTH = 800;
var HEIGHT = 500;

var TILE_WIDTH = 512;
var TILE_HEIGHT = 512;
var CHUNK_X = 14;
var CHUNK_Y = 20;
var CHUNK_WIDTH = CHUNK_X*TILE_WIDTH;
var CHUNK_HEIGHT = CHUNK_Y*TILE_HEIGHT;

var MOVE_SPEED = 5;

// Load textures. Numbered ones are animation.
var dudeTexRear = PIXI.Texture.fromImage("/imgs/mainDude/rearView.png");
var dudeTexRear1 = PIXI.Texture.fromImage("/imgs/mainDude/rearView1.png");
var dudeTexRear2 = PIXI.Texture.fromImage("/imgs/mainDude/rearView2.png");
var dudeTexFront = PIXI.Texture.fromImage("/imgs/mainDude/frontView.png");
var dudeTexFront1 = PIXI.Texture.fromImage("/imgs/mainDude/frontView1.png");
var dudeTexFront2 = PIXI.Texture.fromImage("/imgs/mainDude/frontView2.png");
var dudeTexLeft1 = PIXI.Texture.fromImage("/imgs/mainDude/sideViewLeft1.png");
var dudeTexLeft2 = PIXI.Texture.fromImage("/imgs/mainDude/sideViewLeft2.png");
var dudeTexRight1 = PIXI.Texture.fromImage("/imgs/mainDude/sideViewRight1.png");
var dudeTexRight2 = PIXI.Texture.fromImage("/imgs/mainDude/sideViewRight2.png");
var dudeTexRaft = PIXI.Texture.fromImage("/imgs/mainDude/raft.png");
var dudeTexCar = PIXI.Texture.fromImage("/imgs/mainDude/car1.png");
var landTex = PIXI.Texture.fromImage("/imgs/terrain/grass.png");
var townTex = PIXI.Texture.fromImage("/imgs/terrain/town.png");
var villageTex = PIXI.Texture.fromImage("/imgs/terrain/village.png");
var waterTex = PIXI.Texture.fromImage("/imgs/terrain/water.png");
var cityTex = PIXI.Texture.fromImage("/imgs/terrain/city.png");
var farmTex = PIXI.Texture.fromImage("/imgs/terrain/farm.png");

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
     
      var finalpos = new Point((((base.x)*TILE_WIDTH)/clickPos.x)+150,(((base.y)*TILE_HEIGHT)/clickPos.y)+100);
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
