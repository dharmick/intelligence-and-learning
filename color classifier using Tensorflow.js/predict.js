let model;
let rSlider, gSlider, bSlider;
let prediction;

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

async function setup() {
  createCanvas(200, 200);
  rSlider = createSlider(0, 255, 100);
  gSlider = createSlider(0, 255, 100);
  bSlider = createSlider(0, 255, 100);
  prediction = createP();

  model = await tf.loadModel('https://dharmice.bitbucket.io/color-classifier/color-classifier-model.json');
  model.summary()
}

function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);

  tf.tidy(() => {
    const xs = tf.tensor2d([
      [r/255, g/255, b/255]
    ]);
    if(model){
      let result = model.predict(xs);
      let index = result.argMax(1).dataSync();
      let label = labelEncoding[index];
      prediction.html(label);
      // console.log(tf.memory().numTensors);
    }
  });

}
