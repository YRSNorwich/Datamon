function Chunk(x, y) {
    this.position = new Point (x, y);
    this.gamePosition = new Point (x, y);
    this.width = CHUNK_WIDTH;
    this.height = CHUNK_HEIGHT;
    this.sizew = 14;
    this.sizeh = 24;
    this.tiles = get2DArray(this.sizew, this.sizeh);
    this.draw = false;
    var nicTex = PIXI.Texture.fromImage("/imgs/nic.png");    
    var bunnyTex = PIXI.Texture.fromImage("/imgs/bunny.png");

    this.loadTiles = function(array, blockpos, blockdimensions) {
        for(var i = blockpos.x; i < blockdimensions.x; i++) {
            for(var j = blockpos.y; j < blockdimensions.y; j++) {
                this.putTile(array[i][j]);
            }
        }
    }

    this.putTile = function(tile) {
        this.tiles.push(tile);
    }

    this.drawTiles = function(stage) {
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                if(this.tiles[i][j] === 1) {
                    this.tiles[i][j] = new PIXI.Sprite(nicTex);
                    this.tiles[i][j].anchor.x = 0.5;
                    this.tiles[i][j].anchor.y = 0.5;
                    this.tiles[i][j].position.x = /*this.gamePosition.x + */i*TILE_WIDTH;
                    this.tiles[i][j].position.y = /*this.gamePosition.y + */j*TILE_HEIGHT;
                    stage.addChild(tiles[i][j]);
                } else {
                    this.tiles[i][j] = new PIXI.Sprite(bunnyTex);
                    this.tiles[i][j].anchor.x = 0.5;
                    this.tiles[i][j].anchor.y = 0.5;
                    this.tiles[i][j].position.x = i*TILE_WIDTH;
                    this.tiles[i][j].position.y = j*TILE_HEIGHT;
                    stage.addChild(this.tiles[i][j]);
                }
            }
        }
    }

    this.move = function(dx, dy) {
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                this.tiles[i][j].position.x += dx;
                this.tiles[i][j].position.y += dy;
            }
        }
    }
}
