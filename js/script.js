let jsonData;
let playerLabel = [];
let model;
let xs, ys;
let posLabel = [];
let inputData;
document.getElementById("validationMsg").style.display = "none";
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
    train();
};

async function train() {
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
    // document.getElementById("age").innerHTML = playerLabel[resIndex[0]].age;
    document.getElementById("positiontext").innerHTML = "<label style=`color:black`>Your attributes matches to</label> <br />";
    document.getElementById("position").innerHTML = playerLabel[resIndex[0]].position;
    document.getElementById("club").innerHTML = "<label style=`color:black`>when playing for </label> <b>"+playerLabel[resIndex[0]].club+"</b>";
    document.getElementById("potential").innerHTML = playerLabel[resIndex[0]].potential;
    document.getElementById("overall").innerHTML = playerLabel[resIndex[0]].overall;
    // document.getElementById("pf").innerHTML = playerLabel[resIndex[0]].pf;
    //document.getElementById("image").src = image[randNuber];
    console.log(`The player matches the input ${inputData} is`, resIndex, playerLabel[resIndex[0]]);

}

async function process() {
    inputData = [parseInt(document.forms["football"]["pfin"].value), parseInt(document.forms["football"]["bsp"].value) / 100, parseInt(document.forms["football"]["dfm"].value) / 100, parseInt(document.forms["football"]["physical"].value) / 100, parseInt(document.forms["football"]["shooting"].value) / 100, parseInt(document.forms["football"]["gkability"].value) / 100]
    document.getElementById("plyername").innerHTML = "";
    // document.getElementById("age").innerHTML = "";
    document.getElementById("position").innerHTML = "";
    document.getElementById("club").innerHTML = "";
    document.getElementById("potential").innerHTML = "";
    document.getElementById("overall").innerHTML = "";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    await preload();
}

function limit(element)
{
    var max_chars = 2;
    var min_chars = 0;

    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
    if(element.value.length == min_chars) {
        document.getElementById("generateBtn").disabled = true;
        document.getElementById("validationMsg").style.display = "block";
        document.getElementById("validationMsg").innerHTML = "Please fill all the Fields";
    }
    if(element.value.length > min_chars) {
        document.getElementById("generateBtn").disabled = false;
        document.getElementById("validationMsg").style.display = "none";
        document.getElementById("validationMsg").innerHTML =  "";
    }
}