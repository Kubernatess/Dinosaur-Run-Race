// JavaScript Document
var canvas=document.getElementById('canvas');
//设置2d绘图环境
canvas.width = 600;
canvas.height = 650;
var cxt=canvas.getContext('2d');
//创建图片对象
var img_horizontal=new Image();
img_horizontal.src="image/horizontal.jpg";
var img_clouds =new Image();
img_clouds.src="image/clouds.jpg";
var img_Cactus1=new Image();
img_Cactus1.src="image/Cactus1.jpg";
var img_Cactus2=new Image();
img_Cactus2.src="image/Cactus2.jpg";
var img_Cactus3=new Image();
img_Cactus3.src="image/Cactus3.jpg";
var img_cake=new Image();
img_cake.src="image/cake.jpg";
var imgs=[img_Cactus1,img_Cactus2,img_Cactus3,img_cake];
var x=0;
var horizontal=600;
var z=0;
var rand=Math.floor(Math.random()*4);
var img_dinasour=new Image();
img_dinasour.src="image/dinasour.jpg";
var img_dinasour2=new Image();
img_dinasour2.src="image/dinasour2.jpg";
var img_dinasour3=new Image();
img_dinasour3.src="image/dinasour3.jpg";
var imgs_dinasour=[img_dinasour2,img_dinasour3];
var vertical=440;
var tag=-1;
var trigger=false;
//var timer=null;
var score=0;
function draw(){
	//清除画布(清除之前的内容 重新画)
	cxt.clearRect(0,0,600,50);
	//设置文字 显示分数
	cxt.font="40px 宋体";
	cxt.fillStyle="red";
	cxt.fillText(score,300,40);
	//画云彩
	cxt.drawImage(img_clouds,x,50,650,240);
		x-=1;
		if(Math.abs(x)==650){
			x=550;
		}	
	//画水平线
	cxt.drawImage(img_horizontal,0,290,600,285);
	
	//画仙人掌、蛋糕
	switch(rand){
		case 0:{
			cxt.drawImage(imgs[0],horizontal,475,88,44);
			if((horizontal==100)&&((vertical+80)>=475)){
				alert("Game Over\n\nscore:"+score);
				score=-1;
			}
			break;
		}
		case 1:{
			cxt.drawImage(imgs[1],horizontal,475,27,44);
			if((horizontal==100)&&((vertical+80)>=490)){
				alert("Game Over\n\nscore:"+score);
				score=-1;
			}
			break;
		}
		case 2:{
			cxt.drawImage(imgs[2],horizontal,455,36,64);
			if((horizontal==100)&&((vertical+80)>=460)){
				alert("Game Over\n\nscore:"+score);
				score=-1;
			}
			break;
		}
		case 3:{
			cxt.drawImage(imgs[3],horizontal,450,84,67);
			if((horizontal==90)&&((vertical+80)>=450)){
				score+=3;	
			}
			break;
		}
	}
	horizontal-=5;
	if(Math.abs(horizontal)==0){
		horizontal=600;
		if(rand!=3)score+=1;
		rand=Math.floor(Math.random()*4);
	}
		
	//画恐龙
	if(trigger==false){
	cxt.drawImage(imgs_dinasour[z],20,440,80,80);
		if(z==0){
			z=1;
		}//来回切换恐龙脚步
		else z=0;
	}
		
	//恐龙跳跃
	if(trigger){
		cxt.drawImage(img_dinasour,20,vertical,80,80);
		vertical=vertical+5*tag;
		if(vertical==280){
			tag=1;
		}
		if(vertical==440){
			tag=-1;	
			trigger=false;
			cxt.drawImage(imgs_dinasour[z],20,440,80,80);
			if(z==0){
				z=1;
			}
			else z=0;		
		}
	}		
};
setInterval(draw,10);


window.onkeypress=function(event){
	var e = event || window.event || arguments.callee.caller.arguments[0];
	//当按下空格键时触发恐龙跳跃
	if(e && e.keyCode==32){
		trigger=true;
	}
}