let data; // loading external json
let model; // tensorflow sequential model
let info;
let labelEncoding = [
  'red-ish',
  'green-ish',
  'blue-ish',
  'orange-ish',
  'yellow-ish',
  'pink-ish',
  'purple-ish',
  'brown-ish',
  'grey-ish'
];

function preload(){
  data = loadJSON('colorData.json');
}

function setup() {
  let cnv = createCanvas(1200, 200);
  let x = (windowWidth - width) / 2;
  let y = 50;
  cnv.position(x, y);
  background('#FFEB3B');
  fill("#FBC02D");
  strokeWeight(0);
  textAlign("center");
  textSize(40);
  text("Epochs v/s Loss", width*.5, 50);
  info = createP("");


  let colors = []; // inputs
  let labels = []; // outputs
  for (let record of data.entries) {
    let col = [record.r/255, record.g/255, record.b/255];
    colors.push(col);
    labels.push(labelEncoding.indexOf(record.label));
  }

  let xs = tf.tensor2d(colors); //input tensor
  let ys = tf.oneHot(tf.tensor1d(labels, 'int32'), 9); // output oneHotEncoded tensor

  model = tf.sequential();

  let hidden = tf.layers.dense({
    units: 5,
    activation: 'sigmoid',
    inputDim: 3
  });
  model.add(hidden);

  let output = tf.layers.dense({
    units: 9,
    activation: 'softmax'
  });
  model.add(output);

  const lr = 0.5;
  const optimizer = tf.train.sgd(lr);
  model.compile({
    optimizer: optimizer,
    loss: 'categoricalCrossentropy'
  });

  let tic = new Date().getTime();
  const options = {
    epochs: 50,
    callbacks: {
      onEpochEnd: (num, logs) => {
        console.log(num, logs.loss);
        updateChart(num, logs.loss);
      },
      onTrainEnd: () => {
          // model.save('downloads://color-classifier-model').then(() => console.log("saved"));
      }
    }
  }
  model.fit(xs, ys, options).then(results => {
    let toc = new Date().getTime();
    console.log("time req: " + (toc-tic)/1000)
    console.log(results)
  });



}

function updateChart(num, loss) {
  rect(20 * (num+1), height - loss * 50, 10, loss * 50);
  info.html("epoch:" + num + "   loss:" + loss);
}

function draw() {
  // console.log("number of tensors: ", tf.memory().numTensors);


}
