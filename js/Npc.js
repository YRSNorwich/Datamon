function Npc(x, y, texfront) {
	this.position;
	//this.npcposition = new Point (x, y);
	this.anchor.x = 0.5;
        this.anchor.y = 0.5;
        this.gamePosition = new Point(x, y);
	var dudeTexFront = PIXI.Texture.fromImage(texfront);
}
