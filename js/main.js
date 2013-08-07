$(document).ready(main);

function main() {
    //A timer for use in animation
    var timer = new FrameTimer();
    timer.tick();

    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    var WIDTH = 400;
    var HEIGHT = 600;

    var TILE_WIDTH = 64;
    var TILE_HEIGHT = 64;

    var tiles = new Array();

    // The Length should be however wide the map is
    tiles.length = 100;

    // Hack a 2D array
    for(var i = 0; i < tiles.length; i++) {
        tiles[i] = new Array();
        
        // Should be the height of the map
        tiles[i].length = 100;
    }

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimFrame(draw);

    loadTiles();

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
    
    //Centre dude!
    dude.position.x = WIDTH / 2;
    dude.position.y = HEIGHT / 2;

    stage.addChild(dude);
    
    function draw() {
        requestAnimFrame(draw);
    
        // Keydrown shizzle
        kd.tick();


        // render the stage   
        renderer.render(stage);

        // signal end of frame to timer.
        timer.tick();
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
            console.log(position);
        });

        for(var i = 0; i < tiles.length; i++) {
            for(var j = 0; j < tiles[i].length; j++) {
                if((i % 2) == 0) {
                    // Load background texture
                    var texture = PIXI.Texture.fromImage("/imgs/nic.png");

                    // create a new Sprite using the texture
                    var tile = new PIXI.Sprite(texture);

                    // center the sprites anchor point
                    tile.anchor.x = 0.5;
                    tile.anchor.y = 0.5;

                    tile.position.x = i*TILE_WIDTH;
                    tile.position.y = j*TILE_HEIGHT;

                    stage.addChild(tile);
                }
            }
        }
    }
}

