// Documented heavily because this is main part of project

/**
 * A basic neural network class for the Core JS Library
 * @property {object} input - An object to hold the input nodes
 * @property {object} hidden - The hidden layer
 * @property {object} hidden.bias - The biases of the hidden layer (equal to # of hidden nodes)
 * @property {object} hidden.weights - The weights of each neuron in layer linked to the input layer
 * @property {object} hidden.values - The output values of the hidden layer
 * @property {object} output - The output layer
 * @property {function} mutateNumber - The function called when getting the random mutation number
 * 
 * @constructor
 * @param {number} inputNodes - The number of neurons for the input layer
 * @param {number} hiddenNodes - The number of neurons for the hidden layer
 * @param {number} outputNodes - The number of neurons for the output layer
 * 
 * @method run - Runs through the neural network
 * @param {object} inputs - The input array for the neural network
 * 
 * @method mutate - Mutates and returns a new neural network
 */
class NN {
	mutateConst = 0.5
	// Specifically Gaussian so mutations have a rate of mutation like in nature
    mutateNumber = () => randomGaussian() * this.mutateConst
    input = {
        nodes: 0,
    }
    hidden = {
        bias: [],
        weights: [],
        nodes: 0,
        values: [],
    }
    output = {
        bias: [],
        weights: [],
        nodes: 0,
        values: [],
    }
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.input.nodes = inputNodes
        this.hidden.nodes = hiddenNodes
        this.output.nodes = outputNodes

        // Randomize all the weights
        for (var i = 0; i < this.hidden.nodes; i++) {
            this.hidden.weights[i] = []
            this.hidden.bias[i] = Math.random()
            for (var v = 0; v < this.input.nodes; v++) {
                this.hidden.weights[i][v] = Math.random()
            }
        }

        for (var i = 0; i < this.output.nodes; i++) {
            this.output.weights[i] = []
            this.output.bias[i] = Math.random()
            for (var v = 0; v < this.hidden.nodes; v++) {
                this.output.weights[i][v] = Math.random()
            }
        }
    }
    run(inputs) {
        // Reset the values of layers
        this.hidden.values = []
        this.output.values = []

        // Dot product of inputs and hidden layer weights
        this.hidden.weights.map((v, i) => {
            let sum = 0
            v.map((d, i) => {
                sum += inputs[i] * d
            })
            sum += this.hidden.bias[i]
            this.hidden.values[i] = sum
        })

        // Dot product of hidden layer and output weights
        this.output.weights.map((v, i) => {
            let sum = 0
            v.map((d, i) => {
                sum += this.hidden.values[i] * d
            })
            sum += this.output.bias[i]
            this.output.values[i] = sum
        })

        // return values of output layer
        return this.output.values
    }
    mutate() {
        // generate new NN and deep copy
        let newNN = new NN(this.input.nodes, this.hidden.nodes, this.output.nodes)
        newNN.hidden.weights = this.hidden.weights;
        newNN.output.weights = this.output.weights
        newNN.hidden.bias = this.hidden.bias;
        newNN.output.bias = this.output.bias

        // Have a small chance of no mutation
        if (Math.random() > 0.01) {

            // All are mutated by mutation function

            // Mutate hidden weights
            newNN.hidden.weights = newNN.hidden.weights.map((v, i) => {
                return v.map((d, e) => {
                    return d + this.mutateNumber()
                })
            })

            // Mutate hidden biases
            newNN.hidden.bias = newNN.hidden.bias.map(v => {
                return v + this.mutateNumber()
            })

            // Mutate output weights
            newNN.output.weights = newNN.output.weights.map((v, i) => {
                return v.map((d, e) => {
                    return d + this.mutateNumber()
                })
            })

            // Mutes output biases
            newNN.output.bias = newNN.hidden.bias.map(v => {
                return v + this.mutateNumber()
            })
        }
        return newNN
    }
}
