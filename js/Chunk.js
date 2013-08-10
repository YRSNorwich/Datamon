function Chunk(x, y) {
    this.position;
    this.gamePosition = new Point (x, y);
    this.width = CHUNK_WIDTH;
    this.height = CHUNK_HEIGHT;
    this.sizew = CHUNK_X;
    this.sizeh = CHUNK_Y;
    this.tiles = get2DArray(this.sizew, this.sizeh);
    this.tileMap = get2DArray(this.sizew, this.sizeh);
    this.draw = false;
    this.rainNumber = 0;
    this.rain = false;
    this.boundingBoxes = new Array();
    this.clouds = new Array();
    this.crimeRating;
    this.npcs = new Array();
    this.loadTiles = function(array, blockpos) {
        for(var x = 0; x < this.sizew; x++) {
            for(var y = 0; y < this.sizeh; y++) {
                this.tileMap[x][y] = array[x + blockpos.x][y + blockpos.y];
            }
        }
    }

    this.update = function() {
        for(var i = 0; i < this.clouds.length; i++) {
            this.clouds[i].position.x += this.clouds[i].velocity.x;
            this.clouds[i].position.y += this.clouds[i].velocity.y;
        }
    }

    this.drawTiles = function(stage, dude) {
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                if(this.tileMap[i][j] === 1) {
                    this.tiles[i][j] = new PIXI.Sprite(landTex);
                } else {
                    this.tiles[i][j] = new PIXI.Sprite(waterTex);
                }
               
                // I think these cause trouble with rendering? 
                //this.tiles[i][j].anchor.x = 0.5;
                //this.tiles[i][j].anchor.y = 0.5;
                this.tiles[i][j].position.x = dude.position.x + i*TILE_WIDTH - (dude.gamePosition.x - this.gamePosition.x);
                this.tiles[i][j].position.y = dude.position.y + j*TILE_HEIGHT - (dude.gamePosition.y - this.gamePosition.y);
                stage.addChild(this.tiles[i][j]);
            }
        }
        for(var i = 0; i < this.clouds.length; i++) {
            //this.clouds[i].position.x = dude.position.x + this.clouds[i].gamePosition.x - (dude.gamePosition.x - this.gamePosition.x);
            //this.clouds[i].position.y = dude.position.y + this.clouds[i].gamePosition.y - (dude.gamePosition.y - this.gamePosition.y);
        }
    }

    this.drawWeather = function(stage, camera) {
        for(var i = 0; i < this.clouds.length; i++) {
            if(collides(this.clouds[i], camera)) {
                stage.addChild(this.clouds[i]);
            }

        }
    }
    this.loadNpcs = function(stage, camera){
        for (var i = 0; i < this.npcs.length; i++){
if (collides(this.npcs[i],camera)){
    stage.addChild(this.npcs[i]);
}
}
    }
    this.loadTileData = function(chunkData) {
        for(var x = 0; x < this.sizew; x++) {
            for(var y = 0; y < this.sizeh; y++) {
                this.tiles[x][y].countyId = chunkData[x][y][1];
            }
        }

        for (var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++){

                var robberProbability = 1 / this.tiles[i][j].crimeRating;
                console.log(robberProbability);
                console.log(this.tiles[i][j].crimeRating);

                var randomrobber = Math.floor(Math.random()*robberProbability);
                var robber = new PIXI.Sprite(robberTex);
                robber.position.x = this.tiles[i][j].position.x;
                robber.position.y = this.tiles[i][j].position.y;
                robber.gamePosition = new Point(0,0);
                robber.gamePosition.x = this.gamePosition.x + j*TILE_WIDTH;
                robber.gamePosition.y = this.gamePosition.y + i*TILE_HEIGHT;
                //var robberSpeedx = 
                //var robberSpeedy =
                this.npcs.push(robber);
            }
        }

        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                var cloudProb = 100 / this.tiles[i][j].cloudRating;
                var randomNumber=Math.floor(Math.random()*cloudProb);
                // TODO first load of random numbers are NaN... From chunk 0,0?
                if(randomNumber < 20) {
                    var cloud = new PIXI.Sprite(cloudTex);
                    cloud.position.x = this.tiles[i][j].position.x;
                    cloud.position.y = this.tiles[i][j].position.y;
                    cloud.gamePosition = new Point(0,0);
                    cloud.gamePosition.x = this.gamePosition.x + i*TILE_WIDTH;
                    cloud.gamePosition.y = this.gamePosition.y + j*TILE_HEIGHT;
                    var xVel = Math.floor(Math.random()*CLOUD_MAX_VEL);
                    var yVel = Math.floor(Math.random()*CLOUD_MAX_VEL);
                    //cloud.velocity = new Point(xVel, yVel);
                    cloud.velocity = new Point(0, 0);
                    this.clouds.push(cloud);
                }

                if(this.tiles[i][j].cloudRating > 0.6) {
                    this.rainNumber++;
                }

                if(this.rainNumber > 30) {
                    this.rain = true;
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
        
        for(var i = 0; i < this.clouds.length; i++) {
                this.clouds[i].position.x += dx;
                this.clouds[i].position.y += dy;
        }

        for(var i = 0; i < this.npcs.length; i++) {
                this.npcs[i].position.x += dx;
                this.npcs[i].position.y += dy;
        }
    }

    this.unload = function(stage) {
        for(var i = 0; i < this.tiles.length; i++) {
            for(var j = 0; j < this.tiles[i].length; j++) {
                stage.removeChild(this.tiles[i][j]);
            }
        }
        
        if(this.clouds > 0) {
            for(var i = 0; i < this.clouds.length; i++) {
                stage.removeChild(this.clouds[i]);
            }
        }

        this.rain = false;
    }
}
