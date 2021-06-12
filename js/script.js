let jsonData;
let playerLabel = [];
let model;
let xs, ys;
let posLabel = [];
let inputData;

async function preload() {
    console.log('Fetching Data');
    $.getJSON("./data/fifadata.json", async function (data) {
        await formatData(data)
    });
}
var loadFile = function(event) {
    var output = document.getElementById("image");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = function() {
      URL.revokeObjectURL(output.src) // free memory
    }
  };
async function formatData(data) {
    let playerRecord = [];
    let playerLabelTens = [];
    for (let i = 0; i < 3000; i++) {
        let players = [data[i].prefered_foot, data[i].ballskills_and_passing, data[i].defense_and_mental, data[i].physical, data[i].shooting, data[i].gk_ability];
        playerRecord.push(players);
        playerLabel.push({
            'name': data[i].name,
            'club': data[i].club,
            'age': data[i].age,
            'overall': data[i].overall,
            'potential': data[i].potential,
            'position': data[i].position,
            'pf': data[i]['pf']
        });
        //posLabel.push(data[i].Position);
        playerLabelTens.push(i)
    }
    //console.log(...new Set(posLabel));
    xs = tf.tensor2d(playerRecord);
    let labelTensor = tf.tensor1d(playerLabelTens, 'int32');
    ys = tf.oneHot(labelTensor, 3000);
    labelTensor.dispose();
    // xs.print();
    //ys.print();

    // model = tf.sequential();
    // let hidden = tf.layers.dense({
    //     units: 100,
    //     activation: 'relu',
    //     inputDim: 6
    // });
    // let hidden2 = tf.layers.dense({
    //     units: 200,
    //     useBias: true,
    //     activation: 'relu'
    // });
    // let output = tf.layers.dense({
    //     units: 3000,
    //     activation: 'softmax'
    // });

    // model.add(hidden);
    // model.add(hidden2);
    // model.add(output);

    // //create optimiser

    // const lr = 0.2;
    // const optimizer = tf.train.adam();

    // model.compile({
    //     optimizer: optimizer,
    //     loss: 'categoricalCrossentropy'
    // })

    train();
};

async function train() {
    // const options = {
    //     epochs: 30,
    //     validationSplit: 0.1,
    //     shuffle: true,
    //     callbacks: {
    //         onTrainBegin: () => document.getElementById("club").innerHTML = 'Finding player <div class="blink_me">...</div>',
    //         onTrainEnd: () => document.getElementById("club").innerHTML = 'Loading Player',
    //     }
    // }
    // await model.fit(xs, ys, options).then((result) => {
    //     console.log(">>>>", result.history.loss[29]);
    // }).catch((err) => {
    //     console.log("error=", err);
    // });

    test();

}

async function test() {
    console.log(inputData);
    let model = await tf.loadLayersModel('savemodel/model.json');//await tf.loadLayersModel('http:savemodel/model.json');
    let input = tf.tensor2d([inputData]);
    let result = await model.predict(input);
    let resIndex = result.argMax(1).dataSync();
    let image = ["https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/archer.png", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/giant.png", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/goblin.png", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/wizard.png", "https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/barbarian.png"];
    let randNuber = Math.floor(Math.random() * image.length);
    console.log(randNuber);
    document.getElementById("plyername").innerHTML = playerLabel[resIndex[0]].name;
    document.getElementById("age").innerHTML = playerLabel[resIndex[0]].age;
    document.getElementById("position").innerHTML = "<label style=`color:black`>Your attributes matches to</label> <br />"+ playerLabel[resIndex[0]].position;
    document.getElementById("club").innerHTML = playerLabel[resIndex[0]].club;
    document.getElementById("potential").innerHTML = playerLabel[resIndex[0]].potential;
    document.getElementById("overall").innerHTML = playerLabel[resIndex[0]].overall;
    // document.getElementById("pf").innerHTML = playerLabel[resIndex[0]].pf;
    //document.getElementById("image").src = image[randNuber];
    console.log(`The player matches the input ${inputData} is`, resIndex, playerLabel[resIndex[0]]);

}

async function process() {
    inputData = [parseInt(document.forms["football"]["pfin"].value), parseInt(document.forms["football"]["bsp"].value) / 100, parseInt(document.forms["football"]["dfm"].value) / 100, parseInt(document.forms["football"]["physical"].value) / 100, parseInt(document.forms["football"]["shooting"].value) / 100, parseInt(document.forms["football"]["gkability"].value) / 100]
    // // [parseInt(document.forms["football"]["pfin"].value),
    // //     parseInt(document.forms["football"]["crossing"].value),
    // //     parseInt(document.forms["football"]["finishing"].value),
    // //     parseInt(document.forms["football"]["headingaccuracy"].value),
    // //     parseInt(document.forms["football"]["shortpassing"].value),
    // //     parseInt(document.forms["football"]["volleys"].value),
    // //     parseInt(document.forms["football"]["dribbling"].value),
    // //     parseInt(document.forms["football"]["curve"].value),
    // //     parseInt(document.forms["football"]["fkaccuracy"].value),
    // //     parseInt(document.forms["football"]["longpassing"].value),
    // //     parseInt(document.forms["football"]["ballcontrol"].value),
    // //     parseInt(document.forms["football"]["acceleration"].value),
    // //     parseInt(document.forms["football"]["sprintspeed"].value),
    // //     parseInt(document.forms["football"]["agility"].value),
    // //     parseInt(document.forms["football"]["reactions"].value),
    // //     parseInt(document.forms["football"]["balance"].value),
    // //     parseInt(document.forms["football"]["shotpower"].value),
    // //     parseInt(document.forms["football"]["jumping"].value),
    // //     parseInt(document.forms["football"]["stamina"].value),
    // //     parseInt(document.forms["football"]["strength"].value),
    // //     parseInt(document.forms["football"]["longshots"].value),
    // //     parseInt(document.forms["football"]["aggression"].value),
    // //     parseInt(document.forms["football"]["interceptions"].value),
    // //     parseInt(document.forms["football"]["positioning"].value),
    // //     parseInt(document.forms["football"]["vision"].value),
    // //     parseInt(document.forms["football"]["penalties"].value),
    // //     parseInt(document.forms["football"]["composure"].value),
    // //     parseInt(document.forms["football"]["marking"].value),
    // //     parseInt(document.forms["football"]["standingtackle"].value),
    // //     parseInt(document.forms["football"]["slidingtackle"].value),
    // //     parseInt(document.forms["football"]["gkdiving"].value),
    // //     parseInt(document.forms["football"]["gkhandling"].value),
    // //     parseInt(document.forms["football"]["gkkicking"].value),
    // //     parseInt(document.forms["football"]["gkpositioning"].value),
    // //     parseInt(document.forms["football"]["gkreflexes"].value)
    // // ]
    document.getElementById("plyername").innerHTML = "";
    document.getElementById("age").innerHTML = "";
    document.getElementById("position").innerHTML = "";
    document.getElementById("club").innerHTML = "";
    document.getElementById("potential").innerHTML = "";
    document.getElementById("overall").innerHTML = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    await preload();
}