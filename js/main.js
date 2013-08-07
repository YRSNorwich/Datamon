$(document).ready(main);
function main() {
    //A timer for use in animation
    var timer = new FrameTimer();
    timer.tick();

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    var WIDTH = 600;
    var HEIGHT = 600;

    var TILE_WIDTH = 64;
    var TILE_HEIGHT = 64;

    var MOVE_SPEED = 5;

    var tiles = new Array();

    // create a renderer instance
   
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    // add the renderer view element to the DOM
    $('#canvainer').append(renderer.view);

    // centre the canvas
    $('canvas').css("display", "inline");

    requestAnimFrame(draw);

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
    var nicTex = PIXI.Texture.fromImage("/imgs/nic.png");    
    var bunnyTex = PIXI.Texture.fromImage("/imgs/bunny.png");
    
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
    
    //Centre dude!
    dude.position.x = WIDTH / 2;
    dude.position.y = HEIGHT / 2;
    
    //reads a file and converts into array, then sets up the tiles
    convert("/res/test.txt", function(myLevel) {
        //split into array
        level = myLevel.split('');

        var mapWidth;
        var mapHeight = 0;

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
        var tempLevel = new Array();
        tempLevel.length = mapWidth;

        for(var i = 0; i < tempLevel.length; i++) {
            tempLevel[i] = new Array();
            tempLevel[i].length = mapHeight;
        }

        for(var i = 0; i < level.length; i++) {
            tempLevel[i % 10][Math.floor(i / 10)] = level[i];
        }

        level = tempLevel;


        //Set up the tiles
        tiles.length = mapWidth;
        for(var i = 0; i < tiles.length; i++) {
            tiles[i] = new Array();
            tiles[i].length = mapHeight;
        }
        
        readLevel();

        //go go gadget.
        stage.addChild(dude);
    });
  

    function readLevel() {
        for (var i = 0; i < level.length; i++) {
            for (var j = 0; j < level[i].length; j++) {
                if(level[i][j] === 1) {
                    tiles[i][j] = new PIXI.Sprite(nicTex);
                    tiles[i][j].anchor.x = 0.5;
                    tiles[i][j].anchor.y = 0.5;
                    tiles[i][j].position.x = i*TILE_WIDTH;
                    tiles[i][j].position.y = j*TILE_HEIGHT;
                    stage.addChild(tiles[i][j]);
                } else {
                    tiles[i][j] = new PIXI.Sprite(bunnyTex);
                    tiles[i][j].anchor.x = 0.5;
                    tiles[i][j].anchor.y = 0.5;
                    tiles[i][j].position.x = i*TILE_WIDTH;
                    tiles[i][j].position.y = j*TILE_HEIGHT;
                    stage.addChild(tiles[i][j]);
                }
                //(i * blockSize, j * blockSize, level[i][j], false, false, tempImg);

                //throw('tiles['+i+']'+j+'] = ' + level[i][j]);
            }
        }
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

    window.onresize = function(event) {
    		
    }
     

    function update() {
        // Set boundries of screen position (100 pixels from edge)
        if(dude.position.x > 500) {
            dude.position.x = 500;
            cameraMove("right");
        } else if (dude.position.x < 100) {
            dude.position.x = 100;
            cameraMove("left");
        }

        if(dude.position.y > 500) {
            dude.position.y = 500;
            cameraMove("up");
        } else if(dude.position.y < 100) {
            dude.position.y = 100;
            cameraMove("down");
        }
    }

    //enityscreenloc = (entloc - camgameloc) + camscreenloc
    //tilescreenloc = (tilegameloc - playergameloc) + playerScreenloc
    function cameraMove(dir) {
        for(var i = 0; i < tiles.length; i++) {
            for(var j = 0; j < tiles[i].length; j++) {
                switch(dir) {
                    case "left":
                        tiles[i][j].position.x += MOVE_SPEED;
                        break;
                    case "right":
                        tiles[i][j].position.x -= MOVE_SPEED;
                        break;
                    case "up":
                        tiles[i][j].position.y -= MOVE_SPEED;
                        break;
                    case "down":
                        tiles[i][j].position.y += MOVE_SPEED;
                        break;
                    default:
                        break;
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
        dude.position.y -= 5;
    });

    kd.UP.up(function() {
        dude.setTexture(dudeTexRear);
        dude.position.y -= 5;
    });

    kd.DOWN.down(function() {
        animate(dude, dudeDownAnimation, timer.getSeconds());
        dude.position.y += 5;
    });

    kd.DOWN.up(function() {
        dude.setTexture(dudeTexFront);
        dude.position.y += 5;
    });

    kd.LEFT.down(function() {
        animate(dude, dudeLeftAnimation, timer.getSeconds());
        dude.position.x -= 5;
    });

    kd.LEFT.up(function() {
        dude.setTexture(dudeTexLeft1);
        dude.position.x -= 5;
    });

    kd.RIGHT.down(function() {
        animate(dude, dudeRightAnimation, timer.getSeconds());
        dude.position.x += 5;
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


        for(var i = 0; i < tiles.length; i++) {
            for(var j = 0; j < tiles[i].length; j++) {
                var texture;
                if((i % 2) === 0) {
                    tiles[i][j] = new PIXI.Sprite(nicTex);
                } else {
                    tiles[i][j] = new PIXI.Sprite(bunnyTex);
                }
                // create a new Sprite using the texture

                // center the sprites anchor point
                tiles[i][j].anchor.x = 0.5;
                tiles[i][j].anchor.y = 0.5;

                tiles[i][j].position.x = i*TILE_WIDTH;
                tiles[i][j].position.y = j*TILE_HEIGHT;

                stage.addChild(tiles[i][j]);
            }
        }




    }
}
function Point(x, y) {
    this.x = x;
    this.y = y;
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
