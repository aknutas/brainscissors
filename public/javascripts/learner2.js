var num_inputs = 6;
var num_actions = 3; // 3 possible outputs
var temporal_window = 1; // amount of temporal memory. 0 = agent lives in-the-moment :)
var network_size = num_inputs*temporal_window + num_actions*temporal_window + num_inputs;
var iteration = 1;

// the value function network computes a value of taking any of the possible actions
// given an input state. Here we specify one explicitly the hard way
// but user could also equivalently instead use opt.hidden_layer_sizes = [20,20]
// to just insert simple relu hidden layers.
var layer_defs = [];
layer_defs.push({type:'input', out_sx:1, out_sy:1, out_depth:network_size});
layer_defs.push({type:'fc', num_neurons: 25, activation:'relu'});
layer_defs.push({type:'fc', num_neurons: 25, activation:'relu'});
layer_defs.push({type:'regression', num_neurons:num_actions});

// options for the Temporal Difference learner that trains the above net
// by backpropping the temporal difference learning rule.
var tdtrainer_options = {learning_rate:0.001, momentum:0.0, batch_size:64, l2_decay:0.01};

var opt = {};
opt.temporal_window = temporal_window;
opt.experience_size = 1000;
opt.start_learn_threshold = 4;
opt.gamma = 0.7;
opt.learning_steps_total = 200;
opt.learning_steps_burnin = 50;
opt.epsilon_min = 0.05;
opt.epsilon_test_time = 0.05;
opt.layer_defs = layer_defs;
// opt.hidden_layer_sizes = [20,20]
opt.tdtrainer_options = tdtrainer_options;


var brain = new deepqlearn.Brain(num_inputs, num_actions, opt); // braaaaaains

function dostuff(inputArray) {
    var action = brain.forward(inputArray);
    // action is a number in [0, num_actions) telling index of the action the agent chooses
    // here, apply the action on environment and observe some reward. Finally, communicate it:

    // Return the action
    return action;
}

function rewardfunction(reward) {
    //Calculate outcome and give reward
    brain.backward(reward); // <-- learning magic happens here
}

function draw_net() {
    var canvas = document.getElementById("net_canvas");
    var ctx = canvas.getContext("2d");
    var W = canvas.width;
    var H = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var L = brain.value_net.layers;
    var dx = (W - 50)/L.length;
    var x = 10;
    var y = 40;
    ctx.font="12px Verdana";
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText("Value Function Approximating Neural Network:", 10, 14);
    for(var k=0;k<L.length;k++) {
        if(typeof(L[k].out_act)==='undefined') continue; // maybe not yet ready
        var kw = L[k].out_act.w;
        var n = kw.length;
        var dy = (H-50)/n;
        ctx.fillStyle = "rgb(0,0,0)";
        ctx.fillText(L[k].layer_type + "(" + n + ")", x, 35);
        for(var q=0;q<n;q++) {
            var v = Math.floor(kw[q]*100);
            if(v >= 0) ctx.fillStyle = "rgb(0,0," + v + ")";
            if(v < 0) ctx.fillStyle = "rgb(" + (-v) + ",0,0)";
            ctx.fillRect(x,y,10,10);
            y += 12;
            if(y>H-25) { y = 40; x += 12};
        }
        x += 50;
        y = 40;
    }
}

var reward_graph = new cnnvis.Graph();
function draw_stats() {
    var canvas = document.getElementById("vis_canvas");
    var ctx = canvas.getContext("2d");
    var W = canvas.width;
    var H = canvas.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var b = brain;
    var netin = b.last_input_array;
    ctx.strokeStyle = "rgb(0,0,0)";
    //ctx.font="12px Verdana";
    //ctx.fillText("Current state:",10,10);
    ctx.lineWidth = 10;
    ctx.beginPath();
    for(var k=0,n=netin.length;k<n;k++) {
        ctx.moveTo(10+k*12, 120);
        ctx.lineTo(10+k*12, 120 - netin[k] * 100);
    }
    ctx.stroke();

    reward_graph.add(iteration, b.average_reward_window.get_average());
    var gcanvas = document.getElementById("graph_canvas");
    reward_graph.drawSelf(gcanvas);
    iteration = iteration + 1;
}


