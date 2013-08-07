function Animation(spriteSet, duration) {
    this.frame = 0;

    this.duration = duration;
    this.durationBackup = duration;
    
    this.frames = spriteSet;

    this.resetDuration = function() {
        this.duration = this.durationBackup;
    }
}
