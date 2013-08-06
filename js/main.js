$(document).ready(main);

function main() {
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

    requestAnimFrame( animate );

    loadTiles();

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
    
    // create a new Sprite using the texture
    var dude = new PIXI.Sprite(dudeTexFront);

    // center the sprites anchor point
    dude.anchor.x = 0.5;
    dude.anchor.y = 0.5;
    
    //Centre dude!
    dude.position.x = WIDTH / 2;
    dude.position.y = HEIGHT / 2;
    //go go gadget.
    stage.addChild(dude);
    
    function animate() {
        requestAnimFrame(animate);
    
        // Keydrown shizzle
        kd.tick();

        // render the stage   
        renderer.render(stage);
    }
    
    
    kd.UP.down(function() {
        dude.setTexture(dudeTexRear);
        dude.position.y -= 5;
    });

    kd.DOWN.down(function() {
        dude.setTexture(dudeTexFront);
        dude.position.y += 5;
    });

    kd.LEFT.down(function() {
        dude.setTexture(dudeTexLeft1);
        dude.position.x -= 5;
    });

    kd.RIGHT.down(function() {
        dude.setTexture(dudeTexRight1);
        dude.position.x += 5;
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
      
      $.get('res/britain.txt', function(data) {
            //var fileDom = $(data);

            var lines = data.split(",");
            var land = new Array();//black earth!
            var sea = new Array();//blue water!
            $.each(lines, function(n, elem) {
             //   $('#myContainer').append('<div>' + elem + '</div>');
                if(elem == 1) {
                  land.push(elem);
                }
           });
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

