function getHand(){
	return Math.floor(Math.random()*3);
}

var playerHistory = [];
var context = null;
var my_canvas = null;


window.onLoad=function(){ init();};
  function init() {
my_canvas = document.getElementById('myCanvas');
context = my_canvas.getContext('2d');


Game.init();



setInterval(Game.loop, 1000 / Game.frames);

};

var Hand = function (hand) {
  this.hand = hand;
};

Hand.prototype.getHand = function() {
  return this.hand;
}

function solveCompetition(hand1, hand2){

	if(hand1 === 0)
	{
		if(hand2 === 1)return hand2;	
		else if(hand2 === 2)return hand1;
		else{return -1;}
	}
	else if(hand1 === 1)
	{
		if(hand2 === 2)return hand2;	
		else if(hand2 === 0)return hand1;
		else{return -1;}
	}
	else if(hand1 === 2)
	{
		if(hand2 === 0)return hand2;	
		else if(hand2 === 1)return hand1;
		else{return -1;}
	}
};
var Game = { };
Game.frames = 60;
Game.init = function(){
this.entities = [];

//this.img_hud = new Image();

};
Game.addEntity = function(entity)
{
this.entities.push(entity);
};

Game.loop = function(){
	Game.update();
	Game.draw();
};

	
Game.getLevel = function(){
	return this.level;
};
var hand1 = -1;

//Global Button functions

var checkHistory = function(){
	if(playerHistory.length > 3) playerHistory.splice(2, playerHistory.length - 3);
}
function scissors() {


playerHistory.unshift(0);
checkHistory();

Game.fight(0);

}
function rock(){

playerHistory.unshift(1);
checkHistory();
Game.fight(1);
//Scissor Button is pressed {}
	
	//Request for new hand --->
}
function paper(){

playerHistory.unshift(2);
checkHistory();
Game.fight(2);
//Scissor Button is pressed {}
	
	//Request for new hand --->
}
var result = -1;
var resultInvoked = false;
var fightInvoked1 = false;
var fightInvoked2 = false;

var hand1 = 0;
var hand2 = getHand();
Game.fight = function(val){
	hand1 = val;
	fightInvoked1 = true;

	setTimeout(function(){ fightInvoked2 = true; hand2 = getHand();}, 1500);
	setTimeout(function(){
		var entL = Game.entities.length;
	
		for (var i=0; i < Game.entities.length; i++) {
		Game.entities[i].toggleRemove();
  	}
	
	}, 4500);
};
Game.resolveFight = function(val){
	result = Game.solveCompetition(val,getHand());
	resultInvoked = true;
};
Game.update = function(){
		
	for (var i=0; i < this.entities.length; i++) {
		this.entities[i].update();
  	}
  
};
var Hand = function(img,x_c,y_c){
	this.img = img;
	this.x_c = x_c;
	this.y_c = y_c;
	this.alpha = 0.0;
	this.remove = false;
	this.create = true;

	this.toggleRemove = function(){
		this.remove = true;
	}
	this.draw = function(){
		/// only image will have alpha affected:

		context.globalAlpha = this.alpha;

		context.drawImage(this.img,this.x_c,this.y_c);
		context.globalAlpha = 1.0;
	}

	this.update = function(){
		if(this.remove){
			if(this.alpha > 0.0){
				if(this.alpha - 0.05 < 0.0) this.alpha = 0;
				else{this.alpha -= 0.05;}
				}
			else{
				Game.entities = [];
				this.remove = false;
			}
		}
		else if(this.create){
			if(this.alpha < 1.0){this.alpha += 0.05;}
			else{this.alpha = 1.0; this.create = false;}
		}
		
	}


};


Game.draw = function(){


	if(!context)return;
   	context.clearRect(0, 0, my_canvas.width,my_canvas.height);
	//this.context.drawImage(this.img,0,0);

	if(fightInvoked1){
		fightInvoked1 = false;
		var img = null;
		img = new Image();
		img.src = "1hand" + hand1.toString() + ".png";
		this.entities.push(new Hand(img,my_canvas.width*0.15,my_canvas.height*0.5 - 128));
		
	}
	if(fightInvoked2){
		fightInvoked2 = false;
		var img = null;
		img = new Image();
		img.src = "2hand" + hand2.toString() + ".png";
		this.entities.push(new Hand(img,my_canvas.width*0.65,my_canvas.height*0.5 - 128));
	}
	var entL = this.entities.length;




	if(entL > 0){
		while(entL-- && this.entities.length>0) {
			if(this.entities[entL]) this.entities[entL].draw();
  		}
	}
	
	
	
	context.font = 'italic 32pt Calibri';

   // context.fillText("VS", 80, 40);
	
	
	
};
init();

