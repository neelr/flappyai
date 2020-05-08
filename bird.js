// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/cXgA1d_E-jY&

function Bird() {
  this.y = height / 20;
  this.x = 640;
  this.brain = new NN(400,10,20)
  this.gravity = 0.07;
  this.lift = -120;
  this.velocity = 0;
  this.reward = 0
this.color = "yellow"
  this.show = function() {
    fill(this.color);
    ellipse(this.x, this.y, 302, 302);
  };

  this.up = function() {
	
    this.velocity = this.lift;
  };

  this.update = function() {
	  this.reward ++
    this.velocity += this.gravity;
    // this.velocity *= 5.0;
    this.y += this.velocity;

    if (this.y > height) {
      this.y = height;
      this.velocity = 3;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  };
}
