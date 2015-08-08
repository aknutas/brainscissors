function getHand() {
    return dostuff(playerHistory);
}

var playerHistory = [];
var context = null;
var my_canvas = null;
var socket = null;

$(document).ready(function() {
    init();
});

function init() {
    my_canvas = document.getElementById('my_canvas');
    context = my_canvas.getContext('2d');

    //Init socket and game
    initSocketIO();
    Game.init();

    //Start other elements
    begin();

    setInterval(Game.loop, 1000 / Game.frames);

};

function initSocketIO() {
    // Init socket
    socket = io('http://localhost:3500');

    // Handlers
    socket.on('handshake', function(msg){
        console.log(msg.msg);
    });

    socket.emit('handshake', {msg: 'connected'});
}

function solveCompetition(hand1, hand2) {

    if (hand1 === 0) {
        if (hand2 === 1)return 0;
        else if (hand2 === 2)return 1;
        else {
            return 2;
        }
    }
    else if (hand1 === 1) {
        if (hand2 === 2)return 0;
        else if (hand2 === 0)return 1;
        else {
            return 2;
        }
    }
    else if (hand1 === 2) {
        if (hand2 === 0)return 0;
        else if (hand2 === 1)return 1;
        else {
            return 2;
        }
    }
};
var Game = {};
Game.frames = 60;
Game.init = function () {
    this.entities = [];

//this.img_hud = new Image();

};
Game.addEntity = function (entity) {
    this.entities.push(entity);
};

Game.loop = function () {
    Game.update();
    Game.draw();
};

var hand1 = -1;

//Global Button functions

var checkHistory = function () {
    if (playerHistory.length > 3) playerHistory.splice(2, playerHistory.length - 3);
}
function scissors() {


    playerHistory.unshift(0);
    checkHistory();
    $('.selectors').hide();
    Game.fight(0);

}
function rock() {

    playerHistory.unshift(1);
    checkHistory();
    $('.selectors').hide();
    Game.fight(1);
//Scissor Button is pressed {}

    //Request for new hand --->
}
function paper() {

    playerHistory.unshift(2);
    checkHistory();
    $('.selectors').hide();
    Game.fight(2);
//Scissor Button is pressed {}

    //Request for new hand --->
}
var result = -1;
var resultInvoked = false;
var fightInvoked1 = false;
var fightInvoked2 = false;
var resultInvoked1 = false;
var resultInvoked2 = false;
var hand1 = 0;
var hand2 = getHand();
Game.fight = function (val) {
    hand1 = val;
    fightInvoked1 = true;

    setTimeout(function () {
        fightInvoked2 = true;
        hand2 = getHand();


        result = solveCompetition(hand1, hand2);
    }, 500);
    setTimeout(function () {
        var entL = Game.entities.length;

        for (var i = 0; i < Game.entities.length; i++) {
            Game.entities[i].toggleRemove();
        }


    }, 1500);
};
Game.resolveFight = function (val) {
    result = Game.solveCompetition(val, getHand());
    resultInvoked = true;
};
Game.update = function () {

    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].update();
    }

};


var Entity = function (img, x_c, y_c, name) {
    this.img = img;
    this.x_c = x_c;
    this.y_c = y_c;
    this.alpha = 0.0;
    this.remove = false;
    this.create = true;
    this.name = name || "name";
    this.toggleRemove = function () {
        this.remove = true;
    }
    this.draw = function () {
        /// only image will have alpha affected:

        context.globalAlpha = this.alpha;

        context.drawImage(this.img, this.x_c, this.y_c);
        context.globalAlpha = 1.0;
    }

    this.update = function () {
        if (this.remove) {
            if (this.alpha > 0.0) {
                if (this.alpha - 0.05 < 0.0) this.alpha = 0;
                else {
                    this.alpha -= 0.05;
                }
            }
            else {
                Game.entities = [];
                this.remove = false;
                if (this.name === "name") {
                    resultInvoked2 = true;

                }
            }
        }
        else if (this.create) {
            if (this.alpha < 1.0) {
                this.alpha += 0.05;
            }
            else {
                this.alpha = 1.0;
                this.create = false;
            }
        }

    }


};


Game.draw = function () {


    if (!context)return;
    context.clearRect(0, 0, my_canvas.width, my_canvas.height);
    //this.context.drawImage(this.img,0,0);

    if (fightInvoked1) {
        fightInvoked1 = false;
        var img = null;
        img = new Image();
        img.src = "/images/" + "2hand" + hand1.toString() + ".png";
        this.entities.push(new Entity(img, my_canvas.width * 0.15, my_canvas.height * 0.5 - 128));

    }
    if (fightInvoked2) {
        fightInvoked2 = false;
        var img = null;
        img = new Image();
        img.src = "/images/" + "1hand" + hand2.toString() + ".png";
        this.entities.push(new Entity(img, my_canvas.width * 0.65, my_canvas.height * 0.5 - 128));
    }
    if (resultInvoked1) {
        resultInvoked1 = false;


    }


    var entL = this.entities.length;

    if (entL === 0 && resultInvoked2) {
        resultInvoked2 = false;
        var img = null;
        img = new Image();
        img.src = "/images/" + "result" + result.toString() + ".png";
        this.entities.push(new Entity(img, my_canvas.width * 0.5 - 128, my_canvas.height * 0.5 - 128, "result"));
        if (result === 0) {
            rewardfunction(1);
        }
        else if (result === 1) {
            rewardfunction(-1);
        }
        else if (result === 2) {
            rewardfunction(0);
        }
        setTimeout(function () {
            for (var i = 0; i < Game.entities.length; i++) {
                Game.entities[i].toggleRemove();


            }
            $('.selectors').show();
            draw_net();
            draw_stats();
            brain.visSelf(document.getElementById("braininfo"));
        }, 1500);
    }


    if (entL > 0) {
        while (entL-- && this.entities.length > 0) {
            if (this.entities[entL]) this.entities[entL].draw();
        }
    }


    context.font = 'italic 32pt Calibri';

    // context.fillText("VS", 80, 40);


};

