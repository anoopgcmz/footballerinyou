let jsonData;
let playerLabel = [];
let model;
let xs, ys;
let posLabel = [];
let inputData;

async function preload() {
    console.log('Fetching Data');
    $.getJSON("./data.json", async function (data) {
        await formatData(data.results)
    });
}

async function formatData(data) {
    let playerRecord = [];
    let playerLabelTens = [];
    for (let i = 0; i < 3000; i++) {
        let preferedFoot = data[i]['Preferred Foot'] == 'Right' ? 1 : 0;
        let players = [preferedFoot, data[i].Crossing, data[i].Finishing, data[i].HeadingAccuracy, data[i].ShortPassing, data[i].Volleys, data[i].Dribbling, data[i].Curve, data[i].FKAccuracy, data[i].LongPassing, data[i].BallControl, data[i].Acceleration, data[i].SprintSpeed, data[i].Reactions, data[i].Balance, data[i].ShotPower, data[i].Jumping, data[i].Stamina, data[i].Strength, data[i].Agility, data[i].LongShots, data[i].Aggression, data[i].Interceptions, data[i].Positioning, data[i].Vision, data[i].Penalties, data[i].Composure, data[i].Marking, data[i].StandingTackle, data[i].SlidingTackle, data[i].GKDiving, data[i].GKHandling, data[i].GKKicking, data[i].GKPositioning, data[i].GKReflexes];
        playerRecord.push(players);
        playerLabel.push({
            'name': data[i].Name,
            'club': data[i].Club,
            'age': data[i].Age,
            'overall': data[i].Overall,
            'potential': data[i].Potential,
            'position': data[i].Position,
            'pf': data[i]['Preferred Foot']
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
    // ys.print();

    model = tf.sequential();
    let hidden = tf.layers.dense({
        units: 10,
        activation: 'sigmoid',
        inputDim: 35
    });
    let hidden2 = tf.layers.dense({
        units: 20,
        useBias: true,
        activation: 'relu'
    });
    let output = tf.layers.dense({
        units: 3000,
        activation: 'softmax'
    });

    model.add(hidden);
    model.add(hidden2);
    model.add(output);

    //create optimiser

    const lr = 0.2;
    const optimizer = tf.train.sgd(lr)

    model.compile({
        optimizer: optimizer,
        loss: 'categoricalCrossentropy'
    })

    train();
};

async function train() {
    const options = {
        epochs: 30,
        validationSplit: 0.1,
        shuffle: true,
        callbacks: {
            onTrainBegin: () => document.getElementById("club").innerHTML = 'Finding player <div class="blink_me">...</div>',
            onTrainEnd: () => document.getElementById("club").innerHTML = 'Loading Player',
        }
    }
    await model.fit(xs, ys, options).then((result) => {
        console.log(">>>>", result.history.loss[29]);
    }).catch((err) => {
        console.log("error=", err);
    });

    test();

}

async function test() {
    console.log(inputData);
    let input = tf.tensor2d([inputData]);
    let result = model.predict(input);
    let resIndex = result.argMax(1).dataSync();
    let image= ["https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/archer.png","https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/giant.png","https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/goblin.png","https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/wizard.png","https://s3-us-west-2.amazonaws.com/s.cdpn.io/195612/barbarian.png"];
    let randNuber = Math.floor(Math.random() * image.length);
    console.log(randNuber);
    document.getElementById("plyername").innerHTML = playerLabel[resIndex[0]].name;
    document.getElementById("age").innerHTML = playerLabel[resIndex[0]].age;
    document.getElementById("position").innerHTML = playerLabel[resIndex[0]].position;
    document.getElementById("club").innerHTML = playerLabel[resIndex[0]].club;
    document.getElementById("potential").innerHTML = playerLabel[resIndex[0]].potential;
    document.getElementById("overall").innerHTML = playerLabel[resIndex[0]].overall;
    // document.getElementById("pf").innerHTML = playerLabel[resIndex[0]].pf;
    document.getElementById("image").src = image[randNuber];
    console.log(`The player matches the input ${inputData} is`, resIndex, playerLabel[resIndex[0]]);

}

async function process() {
    inputData = [parseInt(document.forms["football"]["pfin"].value),
        parseInt(document.forms["football"]["crossing"].value),
        parseInt(document.forms["football"]["finishing"].value),
        parseInt(document.forms["football"]["headingaccuracy"].value),
        parseInt(document.forms["football"]["shortpassing"].value),
        parseInt(document.forms["football"]["volleys"].value),
        parseInt(document.forms["football"]["dribbling"].value),
        parseInt(document.forms["football"]["curve"].value),
        parseInt(document.forms["football"]["fkaccuracy"].value),
        parseInt(document.forms["football"]["longpassing"].value),
        parseInt(document.forms["football"]["ballcontrol"].value),
        parseInt(document.forms["football"]["acceleration"].value),
        parseInt(document.forms["football"]["sprintspeed"].value),
        parseInt(document.forms["football"]["agility"].value),
        parseInt(document.forms["football"]["reactions"].value),
        parseInt(document.forms["football"]["balance"].value),
        parseInt(document.forms["football"]["shotpower"].value),
        parseInt(document.forms["football"]["jumping"].value),
        parseInt(document.forms["football"]["stamina"].value),
        parseInt(document.forms["football"]["strength"].value),
        parseInt(document.forms["football"]["longshots"].value),
        parseInt(document.forms["football"]["aggression"].value),
        parseInt(document.forms["football"]["interceptions"].value),
        parseInt(document.forms["football"]["positioning"].value),
        parseInt(document.forms["football"]["vision"].value),
        parseInt(document.forms["football"]["penalties"].value),
        parseInt(document.forms["football"]["composure"].value),
        parseInt(document.forms["football"]["marking"].value),
        parseInt(document.forms["football"]["standingtackle"].value),
        parseInt(document.forms["football"]["slidingtackle"].value),
        parseInt(document.forms["football"]["gkdiving"].value),
        parseInt(document.forms["football"]["gkhandling"].value),
        parseInt(document.forms["football"]["gkkicking"].value),
        parseInt(document.forms["football"]["gkpositioning"].value),
        parseInt(document.forms["football"]["gkreflexes"].value)
    ]
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