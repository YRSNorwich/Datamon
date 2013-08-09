//TODO For some reason - 100 doesn't centre x. 
function Minimap() {
    this.canvas = document.getElementById('minimap');
    var ctx = this.canvas.getContext('2d');
    this.texture = new Image();
    this.WIDTH;
    this.HEIGHT;
    this.startx = 0;
    this.starty = 0;
    
    this.init = function() {
        this.texture.src = "/res/minimap.png";
        
        this.texture.onload = function() {
            ctx.drawImage(this, 400, 600, 200, 200, 0, 0, 200, 200);
        }

    }

    this.render = function(pos) {
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
       
        ctx.drawImage(this.texture, pos.x - 150, pos.y - 100, 200, 200, 0, 0, 200, 200);
       
     
      
 
    }
 
}
 
