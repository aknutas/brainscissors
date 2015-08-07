var winner; //0 player, 1 AI
var action;
var numaction;
var aiaction;

function begin() {
    winner = 0;
    action = "Not started";
    aiaction = 99;
    document.getElementById("actionstat").innerHTML = action;
    draw_net();
    draw_stats();
    brain.visSelf(document.getElementById("braininfo"));
}

function press_r() {
    aiaction = dostuff([10, 0, 0]);
    action = "Rock";
    numaction = 0;
    process_winner();
}

function press_p() {
    aiaction = dostuff([0, 10, 0]);
    action = "Paper";
    numaction = 1;
    process_winner();
}

function press_s() {
    aiaction = dostuff([0, 0, 10]);
    action = "Scissors";
    numaction = 2;
    process_winner();
}

function process_winner() {
    document.getElementById("actionstat").innerHTML = "You chose " + action + " and the AI chose " + aiaction + ".";
    if (numaction == aiaction) {
        rewardfunction(0.25);
        winner = 3;
    } else if (numaction == 0) { // kivi
        if (aiaction == 1) { // paperi
            rewardfunction(1);
            winner = 1;
        } else {
            rewardfunction(-1);
            winner = 0;
        }
    } else if (numaction == 1) { // paperi
        if (aiaction == 2) { // sakset
            rewardfunction(1);
            winner = 1;
        } else {
            rewardfunction(-1);
            winner = 0;
        }
    } else if (numaction == 2) { // sakset
        if (aiaction == 0) { // kivi
            rewardfunction(1);
            winner = 1;
        } else {
            rewardfunction(-1);
            winner = 0;
        }
    }
    if (winner == 1) {
        document.getElementById("actionstat").innerHTML = document.getElementById("actionstat").innerHTML + " You lost!"
    } else if (winner == 0) {
        document.getElementById("actionstat").innerHTML = document.getElementById("actionstat").innerHTML + " You won!"
    }
    //Redraw stats
    draw_net();
    draw_stats();
    brain.visSelf(document.getElementById("braininfo"));
}