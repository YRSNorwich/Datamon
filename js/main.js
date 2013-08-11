$(document).ready(init);

var currentLocation;
var minimap;
var countyData;

function init() {
    // Get Current location
    navigator.geolocation.getCurrentPosition(function(position) {
        // convert lon/lat into OS eastern northern coord
        position = OsGridRef.latLongToOsGrid(position.coords);
        currentLocation = new Point(Math.floor(position.easting / 1000), 1100 - Math.floor(position.northing / 1000));

        // Get up minimap!
        minimap = new Minimap();
        minimap.init();

        // Fetch the county data from the server
        $.ajax({
            url: "/getCountyData",
            dataType: "json",
            success: function(data) {
                countyData = data;
                main();
            }
        });
    });
}
function main() {
    //A timer for use in animation
    var timer = new FrameTimer();
    timer.tick();

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x0077FF);

    var tiles;
    var chunks;
    var rains;

    //Really hacky code to get the minimap coords.
    var canvas = document.getElementById('minimap');
    canvas.addEventListener('click', function(e) {
        var x;
        var y;

        if (e.pageX || e.pageY) { 
            x = e.pageX;
            y = e.pageY;
        }
        else { 
            x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        } 
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    var mapPos = new Point(dude.gamePosition.x / TILE_WIDTH, dude.gamePosition.y / TILE_HEIGHT);
    var dudePos = new Point(dude.gamePosition.x, dude.gamePosition.y)
        var clickpos = new Point(x,y);
    //teleport(dude,minimap2game(mapPos,dudePos,clickpos));

    //console.log("actual game pos:"+" "+mapPos.x+" "+mapPos.y);
    console.log("canvas has been clicked at:" + " " + x + " " + y);


    }, false);
    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    // add the renderer view element to the DOM
    $('#canvainer').append(renderer.view);

    // centre the canvas
    $('canvas').css("display", "inline");


    var dudeTexFront = PIXI.Texture.fromImage("/imgs/mainDude/frontView.png");
    var dude = new PIXI.Sprite(dudeTexFront);


    // Add animations to sprite sets
    var dudeUpSet = [
        dudeTexRear1,
        dudeTexRear2
            ];

    var dudeDownSet = [
        dudeTexFront1,
        dudeTexFront2
            ];

    var dudeLeftSet = [
        dudeTexLeft1,
        dudeTexLeft2
            ];

    var dudeRightSet = [
        dudeTexRight1,
        dudeTexRight2
            ];
    
    var rainFallSet = [
        rainTex1,
        rainTex2,
        rainTex3
            ];

    // Load needed animations (spriteSet, duration)
    var dudeUpAnimation = new Animation(dudeUpSet, 0.2);
    var dudeDownAnimation = new Animation(dudeDownSet, 0.2);
    var dudeLeftAnimation = new Animation(dudeLeftSet, 0.2);
    var dudeRightAnimation = new Animation(dudeRightSet, 0.2);

    // center the sprites anchor point
    dude.anchor.x = 0.5;
    dude.anchor.y = 0.5;

    var camera = new BoundingBox(dude.position.x, dude.position.y, WIDTH, HEIGHT);
    dude.gamePosition = new Point(TILE_WIDTH*currentLocation.x, TILE_HEIGHT*currentLocation.y);
    //dude.gamePosition = new Point(TILE_WIDTH*512, TILE_HEIGHT*919);

    //Centre dude!
    dude.position.x = WIDTH / 2;
    dude.position.y = HEIGHT / 2;

    //reads a file and converts into array, then sets up the tiles
    convert("/res/britain.txt", function(myLevel) {
        //split into array
        level = myLevel.split('');

        var mapWidth;
        var mapHeight = 1;

        //find width
        for(var i = 0; i < level.length; i++) {
            if(level[i] === '\n') {
                mapWidth = i;
                //Then count out all newlines for height, and splice them out before breaking.
                for(var j = 0; j < level.length; j++) {
                    if(level[j] === '\n') {
                        mapHeight++;
                        level.splice(j, 1);
                    } 
                }
                break;
            }
        }

        for(var i = 0; i < level.length; i++) {
            level[i] = parseInt(level[i]);
        }

        //finally convert to 2D array
        var tempLevel = get2DArray(mapWidth, mapHeight);

        for(var i = 0; i < level.length; i++) {
            tempLevel[i % mapWidth][Math.floor(i / mapWidth)] = level[i];
        }

        level = tempLevel;

        // Set up the tiles/chunks
        // Set all the position
        chunks = get2DArray((mapWidth / CHUNK_X), (mapHeight / CHUNK_Y));
        for(var i = 0; i < chunks.length; i++) {
            for(var j = 0; j < chunks[i].length; j++) {
                chunks[i][j] = new Chunk(i*CHUNK_WIDTH, j*CHUNK_HEIGHT);
                var pos = new Point(CHUNK_X*i, CHUNK_Y*j);
                chunks[i][j].loadTiles(level, pos);
            }
        }

        //updateLevel();

        requestAnimFrame(draw);
    });

    var removedRain = false;


    function updateLevel() {
        // Make a new camera object with a slightly bigger view, to hack seeing a chunk appear
        var tempCamera = new BoundingBox((camera.gamePosition.x - 50), (camera.gamePosition.y - 50), (camera.width + 100), (camera.height + 100));
        for(var i = 0; i < chunks.length; i++) {
            for(var j = 0; j < chunks[i].length; j++) {
                if(!(chunks[i][j].draw) && collides(chunks[i][j], tempCamera)) {
                    chunks[i][j].draw = true;
                    chunks[i][j].update();
                    chunks[i][j].drawTiles(stage, dude);

                    
                    stage.addChild(dude);
                    
                    fetchChunkData(new Point(i*CHUNK_X, j*CHUNK_Y), loadChunkData);
                    //console.log("Just drew chunk " + "[" + i + ", " + j + "]");
                } else if ((chunks[i][j].draw) && !(collides(chunks[i][j], tempCamera))) {
                    chunks[i][j].draw = false;
                    chunks[i][j].unload(stage);
                }

                if(chunks[i][j].draw) {
                    chunks[i][j].update();
                    
                    // Check if dude is on water
                    for(var x = 0; x < chunks[i][j].tiles.length; x++) {
                        for(var y = 0; y < chunks[i][j].tiles[x].length; y++) {
                                if(chunks[i][j].tiles[x][y].tileType === 0) {
                                    //HACK SO TILES HAVE GAME POSITION
                                    var tile = new BoundingBox(chunks[i][j].gamePosition.x + TILE_WIDTH*x, chunks[i][j].gamePosition.y + TILE_HEIGHT*y, TILE_WIDTH, TILE_HEIGHT);
                                    //TODO THIS ISN'T WORKING FOR SOME REASON ARGHHHHHHHHHHHHHHHHHHHHHHHHHH
                                    if(collides(dude, tile)) {
                                        dude.setTexture(dudeTexRaft);
                                    } 
                                }
                        }
                    }

                    if(chunks[i][j].rain) {
                        if( typeof rains != 'undefined') {
                            drawRain();
                            removedRain = false;
                        } else {
                            rains = get2DArray(15, 10); 
                            for(var i = 0; i < rains.length; i++) {
                                for(var j = 0; j < rains[i].length; j++) {
                                    rains[i][j] = new PIXI.Sprite(rainTex1);
                                    rains[i][j].position.x = i*64;
                                    rains[i][j].position.y = j*64;
                                    rains[i][j].animation = new Animation(rainFallSet, 0.2);
                                }
                            }
                        }
                    } else {
                        if( typeof rains != 'undefined') {
                            if(!removedRain) {
                                //TODO for loop crashes app for some reason. No idea why, tiles seems to be an array which exists at this point.
                                /*for(var i = 0; i < rains.length; i++) {
                                    for(var j = 0; j < rains[i].length; j++) {
                                        stage.removeChild(rains[i][j]);
                                        removedRain = true;
                                    }
                                }*/
                            }
                        }
                    }
                    chunks[i][j].loadNpcs(stage, tempCamera);
                    chunks[i][j].drawWeather(stage, tempCamera);
                }
            }
        }
    }

    function draw() {
        requestAnimFrame(draw);
        // Keydrown shizzle
        kd.tick();

        update();

        // render the main stage   
        renderer.render(stage);

        // render the minimap stage
        var mapPos = new Point(Math.floor(dude.gamePosition.x / TILE_WIDTH), dude.gamePosition.y / TILE_HEIGHT);
        minimap.render(mapPos);
        //console.log(mapPos);

        // signal end of frame to timer.
        timer.tick();
         updatestats();
    }


    function update() {
        if(typeof rains != 'undefined') {
            for(var i = 0; i < rains.length; i++) {
                for(var j = 0; j < rains[i].length; j++) {
                    animate(rains[i][j], rains[i][j].animation, timer.getSeconds());
                }
            }
        }
        
        // Set boundries of screen position (100 pixels from edge)
        if(dude.position.x > (WIDTH - 100)) {
            dude.position.x = (WIDTH - 100);
            cameraMove("right");
        } else if (dude.position.x < 100) {
            dude.position.x = 100;
            cameraMove("left");
        }

        if(dude.position.y > (HEIGHT - 100)) {
            dude.position.y = (HEIGHT - 100);
            cameraMove("up");
        } else if(dude.position.y < 100) {
            dude.position.y = 100;
            cameraMove("down");
        }

        // Set the camera's position in the game world
        camera.gamePosition.x = dude.gamePosition.x - dude.position.x;
        camera.gamePosition.y = dude.gamePosition.y - dude.position.y;

        updateLevel();

        //go go gadget.
        //stage.removeChild(dude);
    }

    //enityscreenloc = (entloc - camgameloc) + camscreenloc
    //tilescreenloc = (tilegameloc - playergameloc) + playerScreenloc
    function cameraMove(dir) {
        for(var i = 0; i < chunks.length; i++) {
            for(var j = 0; j < chunks[i].length; j++) {
                if(chunks[i][j].draw) {
                    switch(dir) {
                        case "left":
                            chunks[i][j].move(MOVE_SPEED, 0);
                            break;
                        case "right":
                            chunks[i][j].move(-MOVE_SPEED, 0);
                            break;
                        case "up":
                            chunks[i][j].move(0, -MOVE_SPEED);
                            break;
                        case "down":
                            chunks[i][j].move(0, MOVE_SPEED);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    // Sort out sprite animation 
    function animate(thing, animation, delta) {
        animation.duration -= delta;

        if(animation.duration <= 0) {
            animation.resetDuration();
            animation.frame++;
            if(animation.frame >= animation.frames.length) {
                animation.frame = 0;
            } 
        }

        thing.setTexture(animation.frames[animation.frame]);
    }


    function fetchChunkData(chunkCoords, callback) {
        $.ajax({
            url: "/getChunk",
        data: {"coord1" : chunkCoords.x,
            "coord2" : chunkCoords.y},
        dataType: "json",
        success: function(data) {
            var pos = new Point(chunkCoords.x, chunkCoords.y);
            callback(pos, data);
        }
        });
    }
    function updatestats(){
       
       var ref = new OsGridRef(Math.floor(dude.gamePosition.x / TILE_WIDTH),Math.floor(dude.gamePosition.y / TILE_HEIGHT));
       var latLon = OsGridRef.osGridToLatLong(ref);
        
       $("#latlng").html((latLon.x.toString()) + (latLon.y.toString()));

    }
    function loadChunkData(pos, data) {
        pos.x /= CHUNK_X;
        pos.y /= CHUNK_Y;
        for(var i = 0; i < chunks[pos.x][pos.y].tiles.length; i++) {
            for(var j = 0; j < chunks[pos.x][pos.y].tiles[i].length; j++) {
                chunks[pos.x][pos.y].tiles[i][j].countyId = data.chunk[i][j][1];
                switch(data.chunk[i][j][0]) {
                    case 0:
                        //sea
                        chunks[pos.x][pos.y].tiles[i][j].setTexture(waterTex);
                        chunks[pos.x][pos.y].tiles[i][j].tileType = 0;
                        break;
                    case 1:
                        //land
                        chunks[pos.x][pos.y].tiles[i][j].setTexture(landTex);
                        chunks[pos.x][pos.y].tiles[i][j].tileType = 1;
                        break;
                    case 2:
                        //farm
                        chunks[pos.x][pos.y].tiles[i][j].setTexture(farmTex);
                        chunks[pos.x][pos.y].tiles[i][j].tileType = 2;
                        break;
                    case 3:
                        //village
                        chunks[pos.x][pos.y].tiles[i][j].setTexture(villageTex);
                        chunks[pos.x][pos.y].tiles[i][j].tileType = 3;
                        break;
                    case 4:
                        //town
                        chunks[pos.x][pos.y].tiles[i][j].setTexture(townTex);
                        chunks[pos.x][pos.y].tiles[i][j].tileType = 4;
                        break;
                    case 5:
                        //city
                        chunks[pos.x][pos.y].tiles[i][j].setTexture(cityTex);
                        chunks[pos.x][pos.y].tiles[i][j].tileType = 5;
                        break;
                    default:
                        break;
                }
                
                // Get the county names from the county id using jQuery pagan magic.
                $.map(countyData, function(value, key) { 
                    if(chunks[pos.x][pos.y].tiles[i][j].countyId === value.id) {
                        chunks[pos.x][pos.y].tiles[i][j].county = key;
                        chunks[pos.x][pos.y].tiles[i][j].cloudRating = value.cloudCover;
                        chunks[pos.x][pos.y].tiles[i][j].crimeRating = value.crimeIncidents;
                    }
                });
                
            }
        }
        chunks[pos.x][pos.y].loadTileData(data.chunk);
        
        //stage.addChild(dude);
        
    }

    function drawRain() {
        for(var i = 0; i < rains.length; i++) {
            for(var j = 0; j < rains[i].length; j++) {
                stage.addChild(rains[i][j]);
                //rains[i][j].position.x -= RAIN_VEL;
                //rains[i][j].position.y += RAIN_VEL / 2;

            }
        }
        
        var x = rains.length - 1;
        var y = 0;//rains[x].length - 1;
        if(rains[x][y].position.x < 0 || rains[x][y].position.y > HEIGHT) {
            for(var i = 0; i < rains.length; i++) {
                for(var j = 0; j < rains[i].length; j++) {
                    rains[i][j].position.x = WIDTH + i*64;
                    rains[i][j].position.y = -HEIGHT + j*64;
                }
            }
        }
    }
    
    Number.prototype.toRad = function() {
        return this * Math.PI / 180;
    }
    
    var dudeInCar = false;
    kd.UP.down(function() {
        if(dudeInCar) {
            dude.rotation = 0;
        } else {
            animate(dude, dudeUpAnimation, timer.getSeconds());
        }
        dude.position.y -= MOVE_SPEED;
        dude.gamePosition.y -= MOVE_SPEED;
    });

    kd.UP.up(function() {
        dude.setTexture(dudeTexRear);
    });

    kd.DOWN.down(function() {
        if(dudeInCar) {
            dude.rotation = (180).toRad();
        } else {
            animate(dude, dudeDownAnimation, timer.getSeconds());
        }
        dude.position.y += MOVE_SPEED;
        dude.gamePosition.y += MOVE_SPEED;
    });

    kd.DOWN.up(function() {
        dude.setTexture(dudeTexFront);
    });

    kd.LEFT.down(function() {
        if(dudeInCar) {
            dude.rotation = (270).toRad();
        } else {
            animate(dude, dudeLeftAnimation, timer.getSeconds());
        }
        dude.position.x -= MOVE_SPEED;
        dude.gamePosition.x -= MOVE_SPEED;
    });

    kd.LEFT.up(function() {
        dude.setTexture(dudeTexLeft1);
    });

    kd.RIGHT.down(function() {
        if(dudeInCar) {
            dude.rotation = (90).toRad();
        } else {
            animate(dude, dudeRightAnimation, timer.getSeconds());
        }
        dude.position.x += MOVE_SPEED;
        dude.gamePosition.x += MOVE_SPEED;
    });

    kd.RIGHT.up(function() {
        dude.setTexture(dudeTexRight1);
    });

    kd.SPACE.down(function() {
        dude.rotation += 0.1;
    });
     kd.S.down(function() {
        MOVE_SPEED = 500;
        dude.setTexture(dudeTexStarship);
        dudeInCar = true;
    });
      kd.S.up(function() {
        MOVE_SPEED = 5;
        dudeInCar = false;
        dude.rotation = 0;
        dude.setTexture(dudeTexRear);
    });
    kd.Z.down(function() {
        MOVE_SPEED = 17;
        dude.setTexture(dudeTexCar);
        dudeInCar = true;
    });

    kd.Z.up(function() {
        MOVE_SPEED = 5;
        dudeInCar = false;
        dude.rotation = 0;
        dude.setTexture(dudeTexRear);
    });

}

var moveIt = function () {
    var halfObjectHeight = ($('#canvainer').height() / 2);
    var halfObjectWidth = ($('#canvainer').width() / 2);
    $('#canvainer').css({
        'margin-left': -halfObjectWidth + "px",
        'margin-top': -halfObjectHeight + "px"
    });
}; 

window.setInterval(function(){
    moveIt();
}, 0);
$(window).resize(moveIt);
moveIt();
