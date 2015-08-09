function drawBarChart(context, data, startX, barWidth, chartHeight, markDataIncrementsIn) {
  // Draw the x and y axes
  context.lineWidth = "1.0";
  var startY = 380;
  drawLine(context, startX, startY, startX, 30); 
  drawLine(context, startX, startY, 570, startY);           
  context.lineWidth = "0.0";
  var maxValue = 0;
  for (var i=0; i < data.length; i++) {
    // Extract the data
    var values = data[i].split(",");
    var name = values[0];
    var height = parseInt(values[1]);
    if (parseInt(height) > parseInt(maxValue)) maxValue = height;
    
    // Write the data to the chart
    context.fillStyle = "#b90000";
    drawRectangle(context,startX + (i * barWidth) + i,(chartHeight - height)-78,barWidth,height,true);
    
    // Add the column title to the x-axis
    context.textAlign = "left";
    context.fillStyle = "#000";
    context.fillText(name, startX + (i * barWidth) + i, chartHeight -10, 200);     
  }
  // Add some data markers to the y-axis
  var numMarkers = Math.ceil(maxValue / markDataIncrementsIn);
  context.textAlign = "right";
  context.fillStyle = "#000";
  var markerValue = 0;
  for (var i=0; i < numMarkers; i++) {      
    context.fillText(markerValue, (startX - 5), (chartHeight - markerValue)-64, 50);
    markerValue += markDataIncrementsIn;
  }
}



// drawLine - draws a line on a canvas context from the start point to the end point 
function drawLine(contextO, startx, starty, endx, endy) {
  contextO.beginPath();
  contextO.moveTo(startx, starty);
  contextO.lineTo(endx, endy);
  contextO.closePath();
  contextO.stroke();
}

// drawRectangle - draws a rectangle on a canvas context using the dimensions specified
function drawRectangle(contextO, x, y, w, h, fill) {            
  contextO.beginPath();
  contextO.rect(x, y, w, h);
  contextO.closePath();
  contextO.stroke();
  if (fill) contextO.fill();
}











function getHand() {
    var retVal =  dostuff(cpuHistory.concat(playerHistory).concat(eegdata));
    cpuHistory.splice(0,0,(retVal+1)*100);
    checkHistory(cpuHistory);
    console.log(cpuHistory);
    return  retVal;
   
}

var playerHistory = [0,0,0];
var cpuHistory = [0,0,0];
var context = null;
var my_canvas = null;
var socket = null;
var eegdata = [0,0,0,0,0,0,0,0,0,0];

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
   // begin();

    setInterval(Game.loop, 1000 / Game.frames);

};

function initSocketIO() {
    // Init socket
    socket = io('http://localhost:3500');

    // Handlers
    socket.on('handshake', function(msg){
        console.log(msg.msg);
    });
    socket.on('eeg', function(msg){
        console.log("Got eeg " + msg.eeg);
        processEeg(msg.eeg);
    });

    socket.emit('handshake', {msg: 'connected'});
}
var bufferData = [];
function processEeg(eego){
    if(eego.eegPower){

        eegdata[0] = eego.eegPower.delta / 1000;
        eegdata[1] = eego.eegPower.theta / 1000;
        eegdata[2] = eego.eegPower.lowAlpha / 1000;
        eegdata[3] = eego.eegPower.highAlpha / 1000;
        eegdata[4] = eego.eegPower.lowBeta / 1000;
        eegdata[5] = eego.eegPower.highBeta / 1000;
        eegdata[6] = eego.eegPower.lowGamma / 1000;
        eegdata[7] = eego.eegPower.highGamma / 1000;
        eegdata[8] = eego.eSense.attention;
        eegdata[9] = eego.eSense.meditation;

        bufferData[0] = "delta,"+eegdata[0].toString();
        bufferData[1] =  "theta,"+eegdata[1].toString();;
        bufferData[2] =  "lowAlpha,"+eegdata[2].toString();;
        bufferData[3] =  "highAlpha,"+eegdata[3].toString();;
        bufferData[4] = "lowBeta,"+ eegdata[4].toString();;

        bufferData[5] =  "highBeta,"+eegdata[5].toString();;
        bufferData[6] =  "lowGamma,"+eegdata[6].toString();;
        bufferData[7] =  "highGamma,"+eegdata[7].toString();;
        bufferData[8] =  "attention,"+eegdata[8].toString();;
        bufferData[9] =  "meditation,"+eegdata[9].toString();;
        console.log("Parsed eeg: " + eegdata);
    } else {
        console.log("Invalid object");
    }




}

function solveCompetition(hand1, hand2) {

//scissors 0, rock 1, paper 2
console.log("Hand 1 " + hand1 + " Hand 2 " + hand2);

    if (hand1 === 0) {
        if (hand2 === 1)return 1;
        else if (hand2 === 2)return 0;
        else {
            return 2;
        }
    }
    else if (hand1 === 1) {
        if (hand2 === 2)return 1;
        else if (hand2 === 0)return 0;
        else {
            return 2;
        }
    }
    else if (hand1 === 2) {
        if (hand2 === 0)return 1;
        else if (hand2 === 1)return 0;
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

var checkHistory = function (val) {
   val.splice(val.length-1, 1);
}
function scissors() {
 Game.entities = [];
 context.clearRect(0, 0, my_canvas.width, my_canvas.height);
    playerHistory.splice(0,0,100);
    checkHistory(playerHistory);
   
    Game.fight(0);

}
function rock() {
     Game.entities = [];
 context.clearRect(0, 0, my_canvas.width, my_canvas.height);
    playerHistory.splice(0,0,200);
    checkHistory(playerHistory);
 
    Game.fight(1);
//Scissor Button is pressed {}

    //Request for new hand --->
}
function paper() {
     Game.entities = [];
 context.clearRect(0, 0, my_canvas.width, my_canvas.height);
    playerHistory.splice(0,0,300);
    checkHistory(playerHistory);
  
    Game.fight(2);
//Scissor Button is pressed {}

    //Request for new hand --->
}
var result = -1;

var fightInvoked1 = false;
var fightInvoked2 = false;

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
        resultInvoked2 = true;
      
    }, 100);
   
};
Game.resolveFight = function (val) {
    result = Game.solveCompetition(val, getHand());


   
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
               
                this.remove = false;
                if (this.name === "name") {
                   

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
    // Draw the bar chart
     context.globalAlpha = 0.25;
  drawBarChart(context, bufferData, 50, 100, (my_canvas.height - 20), 50);
   context.globalAlpha = 1.0;
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
   

    var entL = this.entities.length;

    if ( resultInvoked2) {
        resultInvoked2 = false;
        var img = null;
        img = new Image();
        img.src = "/images/" + "result" + result.toString() + ".png";
        this.entities.push(new Entity(img, my_canvas.width * 0.5 + 64 , my_canvas.height * 0.5 -256, "result"));
        if (result === 0) {
            rewardfunction(-1);
        }
        else if (result === 1) {
            rewardfunction(1);
        }
        else if (result === 2) {
            rewardfunction(0);
        }
        draw_net();
        draw_stats();
        brain.visSelf(document.getElementById("braininfo"));
        
    }


    if (entL > 0) {
        while (entL-- && this.entities.length > 0) {
            if (this.entities[entL]) this.entities[entL].draw();
        }
    }


 
 
    // context.fillText("VS", 80, 40);


};

