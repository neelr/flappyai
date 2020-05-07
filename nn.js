class NN {
  input = {
    bias: [],
    weights: [],
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
    this.hidden.values = []
    this.output.values = []
    this.hidden.weights.map((v, i) => {
      let sum = 0
      v.map((d, i) => {
        sum += inputs[i] * d
      })
      sum += this.hidden.bias[i]
      this.hidden.values[i] = sum
    })
    this.output.weights.map((v, i) => {
      let sum = 0
      v.map((d, i) => {
        sum += this.hidden.values[i] * d
      })
      sum += this.output.bias[i]
      this.output.values[i] = sum
    })
    return this.output.values
  }
  mutate() {
    let newNN = new NN(this.input.nodes,this.hidden.nodes,this.output.nodes)
	newNN.hidden.weights = this.hidden.weights;
	newNN.output.weights = this.output.weights
	newNN.hidden.bias = this.hidden.bias;
	newNN.output.bias = this.output.bias
    if (Math.random() > 0.01) {
      newNN.hidden.weights = newNN.hidden.weights.map((v, i) => {
        return v.map((d, e) => {
          return d + randomGaussian()*0.5
        })
      })
      newNN.hidden.bias = newNN.hidden.bias.map(v => {
        return v + randomGaussian()*0.5
      })
      newNN.output.weights = newNN.output.weights.map((v, i) => {
        return v.map((d, e) => {
          return d + randomGaussian()*0.5
        })
      })
      newNN.output.bias = newNN.hidden.bias.map(v => {
        return v +randomGaussian()*0.5
      })
    }
    return newNN
  }
}
