// Flappy bird game from Daniel Shiffman
// AI by Neel Redkar @neelr
var godAI = JSON.parse(
"{\"input\":{\"bias\":[],\"weights\":[],\"nodes\":4},\"hidden\":{\"bias\":[-0.002999245491121405,0.8080384927306962,0.8002570400306587,0.30719457120830196,-0.04043004502951629,1.22402020625583,0.9155249193595487,1.026404641095085,-0.23114955030200257,0.6493541645744106],\"weights\":[[0.49108090017252937,0.2859753511685382,-0.010505872320748288,0.7189989179048695],[1.1712840604965562,0.1735213143410862,0.9229572477593347,0.46603650021893894],[0.606168961037787,0.13985341343352084,0.9061269932482959,-0.3940968335919032],[0.7342354169159441,1.0254525827333967,1.3968662075110512,0.49338096278073545],[0.991561043718527,0.5126042728116832,0.4701185991931931,0.7302383391692295],[0.22148719229869213,0.2916960280983022,-0.20302160173602601,0.6494182594210316],[-0.2112585949983798,0.35975996694552226,0.36082121744277695,-0.1423242480309015],[0.18763454801373744,0.13584506668603025,0.8651975900381174,0.21927068125829632],[0.6553233556530764,1.0215274564143897,1.0753358950553158,0.7240983290292424],[1.2877309980307108,0.5049722801146012,0.5634381580186387,-0.049040685190804706]],\"nodes\":10,\"values\":[0.9716636209041093,2.514356584452739,1.4608967565322795,1.9964740352404402,1.6346254506648377,1.8467042366152664,0.8374397874213382,1.5888140866139167,1.424587934982807,2.219327359884415]},\"output\":{\"bias\":[0.524423622542693,0.35648036741666544,0.6795390643219426,-0.2740493925866119,-0.296136904477093,1.0537626781775948,1.2973456883661962,2.273090285595904,-0.855685066649494,0.08110421883235541],\"weights\":[[-0.4780235926624329,1.4704412635464545,0.9270487236285845,0.09615069318892905,0.7125541768850583,0.13317635004897185,0.7271200010158849,0.6349616232860026,-0.5342152566238385,0.5489170682894651],[-0.1534763224215865,0.5241859828864435,-0.13845415193523658,0.6007773144916505,1.4574714451275952,0.366072255809333,0.021200722190077292,1.4748952356259168,0.015817817017959396,0.42542997795610393]],\"nodes\":2,\"values\":[8.78908576826133,8.908750593185298]}}"
)
var input = document.querySelector("input")
var cycles = 1;
var NUM_BIRDS = 500;
var GEN = 0
var HIGH_SCORE = 0
var GEN_SCORE = 0
var birds = [];
var myBird;
var pipes = [];
var savedBirds = []
function setup() {
	  var canvas = createCanvas(500, 500);
	canvas.parent('game');
	myBird = new Bird()
	myBird.color = "red"
	createCanvas(640, 480);
	for (let i = 0; i < NUM_BIRDS; i++) {
		birds.push(new Bird())
	}
	pipes.push(new Pipe());
}

function draw() {
		background("blue");
		if (birds.length == 0) {
			GEN_SCORE = 0
			GEN += 1
			document.getElementById("gen").innerHTML = GEN
			pipes = []
			let top;
			let topScore = 0;
			savedBirds.map(v => {
				if (v.reward > topScore) {
					top = v
				}
			})
			for (let i = 0; i < NUM_BIRDS; i++) {
				let newBird = new Bird()
				newBird.brain = top.brain.mutate()
				birds.push(newBird)
			}
		}
		for (var n = birds.length - 1; n >= 0; n--) {
			if (birds[n].reward > GEN_SCORE) {
				document.getElementById("score").innerHTML = GEN_SCORE
				GEN_SCORE = birds[n].reward
				if (GEN_SCORE > HIGH_SCORE) {
					document.getElementById("highscore").innerHTML = GEN_SCORE
					HIGH_SCORE = GEN_SCORE
				}
			}
			let killed = false
			for (var i = pipes.length - 1; i >= 0; i--) {
				if (birds[n]) {
					if (pipes[i].hits(birds[n])) {
						savedBirds.push(birds.splice(n, 1)[0])
						killed = true
					}
				}
			}
			if (!killed) {
				closePipe = pipes[pipes.length - 1]
				closePipe ? null : closePipe = { top: 100, bottom: 100, x: 10000 }
				let out = birds[n].brain.run([birds[n].y / height, closePipe.top / height, closePipe.bottom / height, closePipe.x / width])
				if (out[0] > out[1]) {
					birds[n].up()
				}
				birds[n].update();
				birds[n].show();
			}
		}
		if (myBird) {
			document.getElementById("highyou").innerHTML = myBird.reward
			myBird.update()
			myBird.show()
		}
		for (var i = pipes.length - 1; i >= 0; i--) {
			if (myBird) {
				if (pipes[i].hits(myBird)) {
					myBird.reward = 0
				}
			}
			pipes[i].show();
			pipes[i].update();
			if (pipes[i].offscreen()) {
				pipes.splice(i, 1);
			}
		}
		if (frameCount % 75 == 0) {
			pipes.push(new Pipe());
		}
	
}

document.addEventListener('keypress', () => {
	myBird.up()
});

document.getElementById("god").onclick = () => {
	let godBird = new Bird()
	godBird.brain.hidden = godAI.hidden
	godBird.brain.output = godAI.output
	birds.push(godBird)
}