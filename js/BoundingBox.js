function BoundingBox(x, y, w, h) {
    //Bounding boxes do not need to be drawn (for the purposes of YRS), so don't need a separate position
    this.gamePosition = new Point(x, y);
    this.width = w;
    this.height = h;
}
