//TODO For some reason - 100 doesn't centre x.
//EDIT yes it does :P 
function Minimap() {
    this.canvas = document.getElementById('minimap');
    var ctx = this.canvas.getContext('2d');
    this.texture = new Image();
    this.WIDTH;
    this.HEIGHT;
    this.startx = 0;
    this.starty = 0;
    
    this.init = function() {
        this.texture.src = "/res/dumped_map_image.png";
        
        this.texture.onload = function() {
            ctx.drawImage(this, 400, 600, this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height);
        }

    }

    this.render = function(pos) {

		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		   
		ctx.fillStyle = "#00FFFF";
		ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	
		var x = 0;
		var y = 0;
	
		var sx = pos.x - this.canvas.width/2;
		var sy = pos.y - this.canvas.height/2;
	
		var swidth = this.canvas.width;
		var sheight = this.canvas.height;
	
		var width = swidth;
		var height = sheight;
	
		if(sx < 0) {
			x = Math.abs(sx);
			swidth = this.canvas.width + sx;
			width = swidth;
			sx = 0;
		}if(sy < 0) {
			y = Math.abs(sy);
			sheight = this.canvas.height + sy;
			height = sheight;
			sy = 0;
		};
	
		if(sx > this.texture.width-this.canvas.width) {
			swidth = this.texture.width-sx;
			width = swidth;
		}if(sy > this.texture.height-this.canvas.height) {
			sheight = this.texture.height-sy;
			height = sheight;
		}
	
		//var swidth = 200;
		//var sheight = 200;
	
		//var width = 200;
		//var height = 200;
	
		ctx.drawImage(this.texture, sx, sy,swidth, sheight, x, y, width, height);
		
		//crosshair
		ctx.fillStyle = "#000000";
		ctx.fillRect((this.canvas.width/2)-4, (this.canvas.height/2)-1, 8, 2);
		ctx.fillRect((this.canvas.width/2)-1, (this.canvas.height/2)-4, 2, 8);
 
    }
 
}
 
