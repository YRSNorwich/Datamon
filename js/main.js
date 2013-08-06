$(document).ready(main);

function main() {
    // create an new instance of a pixi stage
    var stage = new PIXI.Stage(0x66FF99);

    var WIDTH = 400;
    var HEIGHT = 600;

    var TILE_WIDTH = 20;
    var TILE_HEIGHT = 20;

    // create a renderer instance
    var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT);

    // add the renderer view element to the DOM
    document.body.appendChild(renderer.view);

    requestAnimFrame( animate );

    // create a texture from an image path
    var texture = PIXI.Texture.fromImage("/imgs/bunny.png");
    
    // create a new Sprite using the texture
    var bunny = new PIXI.Sprite(texture);

    // center the sprites anchor point
    bunny.anchor.x = 0.5;
    bunny.anchor.y = 0.5;


    stage.addChild(bunny);
    
    function animate() {
        requestAnimFrame(animate);

        kd.run(function () {
              kd.tick();
        });

        // just for fun, lets rotate mr rabbit a little
        bunny.rotation += 0.1;

        console.log("bunny pos: " + bunny.position.x + ", " + bunny.position.y);

        // render the stage   
        renderer.render(stage);
    }
    
    kd.UP.down(function() {
        bunny.position.y -= 0.05;
    });

    kd.DOWN.down(function() {
        bunny.position.y += 0.05;
    });

    kd.LEFT.down(function() {
        bunny.position.x -= 0.05;
    });

    kd.RIGHT.down(function() {
        bunny.position.x += 0.05;
    });
}

