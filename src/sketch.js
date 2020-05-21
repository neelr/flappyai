// AI by Neel Redkar @neelr

// Trained AI JSON stringified
var godAI = JSON.parse(
"{\"mutateConst\":0.5,\"input\":{\"nodes\":5},\"hidden\":{\"bias\":[0.2888936285399329,0.5495149903472034,1.6318169761113281,1.3014699717808949,1.424315256130267,0.931463717799293,0.8280049613314577,0.7738590247409556],\"weights\":[[0.7245873090500355,-2.1574744589402792,-0.4911289803915262,-1.671656769329241,-0.6546653802088412],[1.6270788463778203,0.632638674713115,-1.2602708744367361,0.233496376087662,2.485183475163145],[-0.7163985941742261,-2.316593424700234,2.8699707561620955,0.07642394035369676,-0.0715479830431417],[1.2367134913001667,-1.7522807194868142,-0.5757308107876017,0.4565064371310854,-1.9271895822783955],[-0.26479235193211015,4.180248393778812,-1.2430539601475448,0.521199951232222,1.0298161691435523],[1.710788124219137,-0.5274932350663324,0.3665637364546512,2.074863787350048,2.18394363295904],[3.1758862169634874,-1.395256986124091,-0.9326314462333953,0.5965438440627124,-3.0464302394428175],[-2.786170399497178,-0.501713823338827,-0.07756048463096665,-2.2717557033573215,2.1108300996631444]],\"nodes\":8,\"values\":[-1.5516336561587731,-0.08754390575833726,1.8319660197984096,-0.09662540312971624,3.1826849867321636,0.7102081260084767,-1.2039209915727052,1.0171521069215712]},\"output\":{\"bias\":[0.2774799956603331,0.5114572732513011,2.2054301640179705,1.3939186765565728,1.108725938042383,0.8806001747731027,0.12774672844931034,0.24677054778362495],\"weights\":[[-3.0353514709189104,0.25820431121822185,-2.987766890155608,-1.5422952914025956,0.36695464339216155,-1.3319562715482942,0.6528370634861624,1.8643942428325764],[0.6763620613829047,2.45747695144401,1.0986949776295025,-0.010861456029851224,0.5366006366443131,-2.6739602156073867,-0.15206727715315055,2.0071334213084038]],\"nodes\":2,\"values\":[0.9725099229707304,3.2940748539516007]}}"
)
var slider = document.getElementById("slider");

var a = 0; //variable to be controlled


//function is called when slider value changes
slider.addEventListener("change", function () {
	a = slider.value;
})

// Configuration Vairables
var NUM_BIRDS = 500;
var GEN = 0
var HIGH_SCORE = 0
var GEN_SCORE = 0

// Initialize Global Variables
var birds = [];
var myBird;
var topBirdie;
var pipes = [];
var savedBirds = []


function setup() {
	var canvas = createCanvas(500, 500);
	canvas.parent('game');
	// Create bird user can control
	myBird = new Bird()
	myBird.color = "red"
	createCanvas(640, 480);

	// Create all AI birds
	for (let i = 0; i < NUM_BIRDS; i++) {
		birds.push(new Bird())
	}
	pipes.push(new Pipe());
}

function draw() {
	// Loop through "speed" variable. This allows for training faster than the render
	for (let s = 0; s <= a; s++) {
		background("blue");
		// Case for if all birds are dead
		if (birds.length == 0) {
			GEN_SCORE = 0
			GEN += 1
			document.getElementById("gen").innerHTML = GEN
			pipes = []
			let top;
			let topScore = 0;
			// Save top bird
			savedBirds.map(v => {
				if (v.reward > topScore) {
					top = v
				}
			})
			// Mutate the top bird into the next Generation
			for (let i = 0; i < NUM_BIRDS; i++) {
				let newBird = new Bird()
				newBird.brain = top.brain.mutate()
				birds.push(newBird)
			}
		}
		for (var n = birds.length - 1; n >= 0; n--) {
			// Check for High Scores
			if (birds[n].reward > GEN_SCORE) {
				document.getElementById("score").innerHTML = GEN_SCORE
				GEN_SCORE = birds[n].reward
				// Set High score from Generation
				if (GEN_SCORE > HIGH_SCORE) {
					document.getElementById("highscore").innerHTML = GEN_SCORE
					HIGH_SCORE = GEN_SCORE
					topBirdie = birds[n]
				}
			}
			// To store closest pipe later for efficiency
			let killed = false
			var closePipe;
			var closeD = Infinity;
			for (var i = pipes.length - 1; i >= 0; i--) {
				if (birds[n]) {
					// Check kill conditions (if bird hit pipe or hit top and bottom)
					let d = (pipes[i].x + pipes[i].w) - birds[n].x
					if (d <closeD && d >0) {
						closeD = d
						closePipe = pipes[i]
					}
					if (pipes[i].hits(birds[n]) || birds[n].y == 0 || birds[n].y == height) {
						savedBirds.push(birds.splice(n, 1)[0])
						killed = true
					}
				}
			}
			// If bird not dead, run the neural network for decisions
			if (!killed) {
				/*
					Main part of the project!

					Here the bird thinks and uses the neural network (which is 5,8,2)
					The 5 inputs are
					 - velocity
					 - height
					 - pipe x value
					 - pipe top y value
					 - pipe bottom y value
					and there are 2 outputs, which are checked, and if the first is greater than the other, then it jumps.
				*/
				// Get closest pipe, if not, make random input
				closePipe ? null : closePipe = { top: 100, bottom: 100, x: 10000 }
				let out = birds[n].brain.run([birds[n].velocity/18,birds[n].y / height, closePipe.top / height, closePipe.bottom / height, closePipe.x / width])
				if (out[0] > out[1]) {
					birds[n].up()
				}
				birds[n].update();
				birds[n].show();
			}
		}
		if (myBird) {
			// Check user bird for their high score
			document.getElementById("highyou").innerHTML = myBird.reward
			myBird.update()
			myBird.show()
		}
		// Loop through pipes to check if user is hit
		for (var i = pipes.length - 1; i >= 0; i--) {
			if (myBird) {
				if (pipes[i].hits(myBird) || myBird.y == 0 || myBird.y == height) {
					myBird.reward = 0
					// If hit, then make pipe red
					if (pipes[i].hits(myBird)) {
						pipes[i].highlight = true
					}
				}
			}
			pipes[i].show();
			pipes[i].update();
			if (pipes[i].offscreen()) {
				pipes.splice(i, 1);
			}
		}
		// If 75 frames pass, make new pipe
		if (frameCount % 75 == 0) {
			pipes.push(new Pipe());
		}
	}

}
// Keypress for user bird
document.addEventListener('keypress', () => {
	myBird.up()
});

// "God" bird spawn into birds array, and treated like a training bird, but with best weights
document.getElementById("god").onclick = () => {
	let godBird = new Bird()
	godBird.brain.hidden = godAI.hidden
	godBird.brain.output = godAI.output
	birds.push(godBird)
}