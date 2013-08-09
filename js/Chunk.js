function Chunk(x, y) {
    this.position;
    this.gamePosition = new Point (x, y);
    this.width = CHUNK_WIDTH;
    this.height = CHUNK_HEIGHT;
    this.sizew = 14;
    this.sizeh = 20;
    this.tiles = get2DArray(this.sizew, this.sizeh);
    this.tileMap = get2DArray(this.sizew, this.sizeh);
    this.draw = false;
    this.boundingBoxes = new Array();

    var landTex = PIXI.Texture.fromImage("/imgs/terrain/grass.png");
    var waterTex = PIXI.Texture.fromImage("/imgs/water.png");

    this.loadTiles = function(array, blockpos) {
        for(var x = 0; x < this.sizew; x++) {
            for(var y = 0; y < this.sizeh; y++) {
                this.tileMap[x][y] = array[x + blockpos.x][y + blockpos.y];
            }
        }
    }

    this.drawTiles = function(stage, dude, camera) {
        //console.log("beg: " + this.gamePosition.x);
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                if(this.tileMap[i][j] === 1) {
                    this.tiles[i][j] = new PIXI.Sprite(landTex);
                } else {
                    this.tiles[i][j] = new PIXI.Sprite(waterTex);
                }
                
                this.tiles[i][j].anchor.x = 0.5;
                this.tiles[i][j].anchor.y = 0.5;
                this.tiles[i][j].position.x = dude.position.x + i*TILE_WIDTH - (dude.gamePosition.x - this.gamePosition.x);
                this.tiles[i][j].position.y = dude.position.y + j*TILE_HEIGHT - (dude.gamePosition.y - this.gamePosition.y);
                stage.addChild(this.tiles[i][j]);
            }
        }
        //console.log("end: " +  this.gamePosition.x);
    }

    this.move = function(dx, dy) {
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].position.x += dx;
                this.tiles[i][j].position.y += dy;
            }
        }
    }

    this.unload = function(stage) {
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                stage.removeChild(this.tiles[i][j]);
            }
        }
    }
}
