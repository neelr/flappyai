class Bird {
  // Initial properties
  y = height / 2;
  x = 64;
  brain = new NN(5,8,2)
  
  gravity = 0.7;
  lift = -12;
  velocity = 0;
  reward = 0
  color = "yellow"
  
  // To render bird
  show () {
    fill(this.color);
    ellipse(this.x, this.y, 32, 32);
  };

  // Add to birds velocity to simulate a jump
  up () {
    this.velocity = this.lift;
  };

  // Update properties of bird
  update () {
	// Gets a reward for being alive another frame
	this.reward ++
    this.velocity += this.gravity;
    this.y += this.velocity;
    
	// Stop if bird is touching ground (specifically for User)
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
