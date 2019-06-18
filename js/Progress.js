particle_no = 25;
var timer=null;
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     ||  
    function( callback ){
    window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas=document.getElementById('canvas');;
var ctx = canvas.getContext("2d");

var counter = 0;
var particles = [];
var w = 400, h = 200;
canvas.width = w;
canvas.height = h;

function reset(){
  ctx.fillStyle = "#272822";
  ctx.fillRect(0,0,w,h);
  
  ctx.fillStyle = "#171814";
  ctx.fillRect(25,80,350,25);
}

function progressbar(){
  this.widths = 0;
  this.hue = 0;
  
  this.draw = function(){
    ctx.fillStyle = 'hsla('+this.hue+', 100%, 40%, 1)';
    ctx.fillRect(25,80,this.widths,25);
    var grad = ctx.createLinearGradient(0,0,0,130);
    grad.addColorStop(0,"transparent");
    grad.addColorStop(1,"rgba(0,0,0,0.5)");
    ctx.fillStyle = grad;
    ctx.fillRect(25,80,this.widths,25);
  }
}

function particle(){
  this.x = 23 + bar.widths;
  this.y = 82;
  
  this.vx = 0.8 + Math.random()*1;
  this.v = Math.random()*5;
  this.g = 1 + Math.random()*3;
  this.down = false;
  
  this.draw = function(){
    ctx.fillStyle = 'hsla('+(bar.hue+0.3)+', 100%, 40%, 1)';;
    var size = Math.random()*2;
    ctx.fillRect(this.x, this.y, size, size);
  }
}

bar = new progressbar();



function draw(){
  reset();
  counter++
  
  bar.hue += 0.8;
  
  bar.widths += 2;
  if(bar.widths > 350){
    if(counter > 215){
		clearInterval(timer);
      /*reset();
      bar.hue = 0;
      bar.widths = 0;
      counter = 0;
      particles = [];*/
	  //ctx.clearRect(0,0,600,650);
	  new_element=document.createElement("script"); 
new_element.setAttribute("type","text/javascript"); 
new_element.setAttribute("src","js/Dinosaur Run - Race Master.js");// 在这里引入了a.js 
document.body.appendChild(new_element);
	 
    }
    else{
      bar.hue = 126;
      bar.widths = 351;
      bar.draw();
    }
  }
  else{
    bar.draw();
    for(var i=0;i<particle_no;i+=10){
      particles.push(new particle());
    }
  }
  update();
}

function update(){
  for(var i=0;i<particles.length;i++){
    var p = particles[i];
    p.x -= p.vx;
    if(p.down == true){
      p.g += 0.1;
      p.y += p.g;
    }
    else{
      if(p.g<0){
        p.down = true;
        p.g += 0.1;
        p.y += p.g;
      }
      else{
        p.y -= p.g;
        p.g -= 0.1;
      }
    }
    p.draw();
  }
}

function animloop() {
  draw();
  requestAnimFrame(animloop);
}

//animloop();
//setTimeout(draw,2000);
timer=setInterval(draw,30);

