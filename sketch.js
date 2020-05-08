// Flappy bird game from Daniel Shiffman
// AI by Neel Redkar @neelr
var godAI = JSON.parse(
"{\"mutateConst\":0.5,\"input\":{\"nodes\":5},\"hidden\":{\"bias\":[0.6731017099849466,1.0340974216794878,0.9734348127905984,1.738880985165797,0.9917662280985864,0.14107933023337949,0.36986471144092953,1.032550520833247],\"weights\":[[0.42783127910164975,-1.7934119641862836,-1.4357999279911233,-1.3787366384138608,-0.1605543358512826],[1.5706227573480118,0.7952662937897639,-0.9153437329805749,0.2634239159843137,2.3277300827534173],[-0.024191472389958724,-1.9550341971501863,2.770068644622021,0.39743989001921187,-0.6398987673866996],[1.1972944299977186,-1.276030476119911,-0.4404705703952725,0.662593550068693,-1.975454494878246],[-0.24391021012044267,2.9877511882899546,-1.2581973839091822,0.5800363826865778,0.6184725981053812],[2.7537653079348723,-0.17206149187384367,-0.04527866493840599,2.529619640373805,2.5800195154914354],[3.08520237556909,-1.573975353612447,-1.1670843994976434,-0.03592570862042754,-3.1925267985693937],[-2.6093137753189866,-0.1407151182887017,0.19287940914324442,-0.7660593834627818,2.222645666127843]],\"nodes\":8,\"values\":[-0.9111728732409494,2.061307280337269,1.5633410912663104,-0.11523786999692964,1.6595422883973256,1.4318953846792257,-2.708487538460792,2.369446253682432]},\"output\":{\"bias\":[0.7512790176021931,0.15385535104597958,1.052011192633422,1.5876583841706258,0.9356891658243324,0.6692408278680427,1.053077693200543,0.9926645589715191],\"weights\":[[-2.374584020790922,0.24335159906659182,-2.4795631486528587,-0.8199238845831115,0.8724647199838701,-0.9268962384991194,0.7962316780250032,1.8573532864099895],[1.0029450415971173,2.31938049846693,1.4076153511476044,-0.13971125186741706,0.5447886189801023,-2.1055120527404934,0.18899752852795992,2.2264238325831505]],\"nodes\":2,\"values\":[1.9996301693112593,8.890358808514474]}}"
)
var slider = document.getElementById("slider");

var a = 0; //variable to be controlled


//function is called when slider value changes
slider.addEventListener("change", function () {
	a = slider.value;
})

var NUM_BIRDS = 500;
var GEN = 0
var HIGH_SCORE = 0
var GEN_SCORE = 0
var birds = [];
var myBird;
var topBirdie;
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
	for (let s = 0; s <= a; s++) {
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
					topBirdie = birds[n]
				}
			}
			let killed = false
			var closePipe;
			var closeD = Infinity;
			for (var i = pipes.length - 1; i >= 0; i--) {
				if (birds[n]) {
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
			if (!killed) {
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
			document.getElementById("highyou").innerHTML = myBird.reward
			myBird.update()
			myBird.show()
		}
		for (var i = pipes.length - 1; i >= 0; i--) {
			if (myBird) {
				if (pipes[i].hits(myBird) || myBird.y == 0 || myBird.y == height) {
					myBird.reward = 0
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
		if (frameCount % 75 == 0) {
			pipes.push(new Pipe());
		}
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