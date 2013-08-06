$(document).ready(main);

function main() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    var WIDTH = 400;
    var HEIGHT = 600;

    var TILE_WIDTH = 40;
    var TILE_HEIGHT = 40;

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

    // Load bunny texture
    var texture = PIXI.Texture.fromImage("/imgs/bunny.png");
    
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);

    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;
    
    //Centre bunny!
    bunny.position.x = WIDTH / 2;
    bunny.position.y = HEIGHT / 2;
    
    stage.addChild(bunny);
    
    function animate() {
        requestAnimFrame(animate);

        // render the stage   
        renderer.render(stage);
    }
    
    // Keydrown shizzle
    kd.run(function () {
        kd.tick();
    });
    
    kd.UP.down(function() {
        bunny.position.y -= 5;
    });

    kd.DOWN.down(function() {
        bunny.position.y += 5;
    });

    kd.LEFT.down(function() {
        bunny.position.x -= 5;
    });

    kd.RIGHT.down(function() {
        bunny.position.x += 5;
    });

    kd.SPACE.down(function() {
        bunny.rotation += 0.1;
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
                    // Load bunny texture
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

