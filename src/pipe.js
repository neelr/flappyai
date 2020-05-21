class Pipe {
  // Define properties
  spacing = 200;
  top = random(height / 6, (3 / 4) * height);
  bottom = height - (this.top + this.spacing);
  x = width;
  w = 80;
  speed = 6;
  highlight = false;

  // Check if bird hits this pipe
  hits (bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        return true;
      }
    }
    return false;
  };

  // Render pipe
  show () {
	  if (this.highlight) {
		  fill("red")
	  } else {
    fill("green");
	  }
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  };

  // Update pipe location
  update () {
    this.x -= this.speed;
  };

  // Check if pipe is offscreen
  offscreen () {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  };
}
