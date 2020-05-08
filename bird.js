// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

function Bird() {
  this.y = height / 2;
  this.x = 64;
  this.brain = new NN(5,8,2)
  this.gravity = 0.7;
  this.lift = -12;
  this.velocity = 0;
  this.reward = 0
this.color = "yellow"
  this.show = function() {
    fill(this.color);
    ellipse(this.x, this.y, 32, 32);
  };

  this.up = function() {
	
    this.velocity = this.lift;
  };

  this.update = function() {
	  this.reward ++
    this.velocity += this.gravity;
    // this.velocity *= 0.9;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  };
}
