$(document).ready(main);
function main() {
    //A timer for use in animation
    var timer = new FrameTimer();
    timer.tick();

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x0077FF);

    var WIDTH = 800;
    var HEIGHT = 500;
    var tiles;
    var chunks;


    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    // add the renderer view element to the DOM
    $('#canvainer').append(renderer.view);

    // centre the canvas
    $('canvas').css("display", "inline");


    var dudeTexFront = PIXI.Texture.fromImage("/imgs/mainDude/frontView.png");
    var dude = new PIXI.Sprite(dudeTexFront);

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

    // Load needed animations (spriteSet, duration)
    var dudeUpAnimation = new Animation(dudeUpSet, 0.2);
    var dudeDownAnimation = new Animation(dudeDownSet, 0.2);
    var dudeLeftAnimation = new Animation(dudeLeftSet, 0.2);
    var dudeRightAnimation = new Animation(dudeRightSet, 0.2);
    
    // center the sprites anchor point
    dude.anchor.x = 0.5;
    dude.anchor.y = 0.5;

    var camera = new BoundingBox(dude.position.x, dude.position.y, WIDTH, HEIGHT);
    
    //Centre dude!
    dude.position.x = WIDTH / 2;
    dude.position.y = HEIGHT / 2;
    dude.gamePosition = new Point(10*64, 1150*64);
    
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

        updateLevel();
    
        requestAnimFrame(draw);
    });
  

    function updateLevel() {
        // Make a new camera object with a slightly bigger view, to hack seeing a chunk appear
        var tempCamera = new BoundingBox((camera.gamePosition.x - 50), (camera.gamePosition.y - 50), (camera.width + 100), (camera.height + 100));
        console.log(tempCamera);
        for(var i = 0; i < chunks.length; i++) {
            for(var j = 0; j < chunks[i].length; j++) {
                if(!(chunks[i][j].draw) && collides(chunks[i][j], tempCamera)) {
                    chunks[i][j].draw = true;
                    chunks[i][j].drawTiles(stage, dude);
                } else if ((chunks[i][j].draw) && !(collides(chunks[i][j], tempCamera))) {
                    chunks[i][j].draw = false;
                    chunks[i][j].unload(stage);
                }
            }
        }
        stage.addChild(dude);
        console.log(camera.height);
    }

    function draw() {
        requestAnimFrame(draw);
        // Keydrown shizzle
        kd.tick();

        update();

        // render the stage   
        renderer.render(stage);

        // signal end of frame to timer.
        timer.tick();

    }
     

    function update() {
        // Set boundries of screen position (100 pixels from edge)
        if(dude.position.x > 700) {
            dude.position.x = 700;
            cameraMove("right");
        } else if (dude.position.x < 100) {
            dude.position.x = 100;
            cameraMove("left");
        }

        if(dude.position.y > 400) {
            dude.position.y = 400;
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

    kd.UP.down(function() {
        animate(dude, dudeUpAnimation, timer.getSeconds());
        dude.position.y -= MOVE_SPEED;
        dude.gamePosition.y -= MOVE_SPEED;
    });

    kd.UP.up(function() {
        dude.setTexture(dudeTexRear);
    });

    kd.DOWN.down(function() {
        animate(dude, dudeDownAnimation, timer.getSeconds());
        dude.position.y += MOVE_SPEED;
        dude.gamePosition.y += MOVE_SPEED;
    });

    kd.DOWN.up(function() {
        dude.setTexture(dudeTexFront);
    });

    kd.LEFT.down(function() {
        animate(dude, dudeLeftAnimation, timer.getSeconds());
        dude.position.x -= MOVE_SPEED;
        dude.gamePosition.x -= MOVE_SPEED;
    });

    kd.LEFT.up(function() {
        dude.setTexture(dudeTexLeft1);
    });

    kd.RIGHT.down(function() {
        animate(dude, dudeRightAnimation, timer.getSeconds());
        dude.position.x += MOVE_SPEED;
        dude.gamePosition.x += MOVE_SPEED;
    });

    kd.RIGHT.up(function() {
        dude.setTexture(dudeTexRight1);
    });

    kd.SPACE.down(function() {
        dude.rotation += 0.1;
    });

    function loadTiles() {
        // Get Current location
        currentLocation = {
            lon: 0,
            lat: 0
        };

        var position;

        navigator.geolocation.getCurrentPosition(function(position) {
            // convert lon/lat into OS eastern northern coord
            position = OsGridRef.latLongToOsGrid(position.coords);
        });


     




    }
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
