//cria as variaveis
var tRex, tRex_correndo,tRex_caindo;
var bordas;
var solo,imagem_solo,solo_invisivel;
var teste, sorteio;
var nuvem,imagem_nuvem,grupo_nuvens;
var cactos,cacto1,cacto2,cacto3,cacto4,cacto5,cacto6,grupo_cactos;
var placar;
var JOGAR, ENCERRAR, estadoJogo;
var game_over,reiniciar,game_img,reiniciar_img;
var som_salto,som_morte,som_placar;
//carrega as animações
function preload(){
  //animações
  tRex_correndo = loadAnimation("trex1.png","trex3.png","trex4.png");
  tRex_caindo = loadAnimation("trex_collided.png");
  //imagens 
  imagem_solo = loadImage("ground2.png");
  imagem_nuvem = loadImage("cloud.png");
  cacto1 = loadImage("obstacle1.png");
  cacto2 = loadImage("obstacle2.png");
  cacto3 = loadImage("obstacle3.png");
  cacto4 = loadImage("obstacle4.png");
  cacto5 = loadImage("obstacle5.png");
  cacto6 = loadImage("obstacle6.png");
  game_img = loadImage("gameOver.png");
  reiniciar_img = loadImage("restart.png");
  som_salto = loadSound("jump.mp3");
  som_morte = loadSound("die.mp3");
  som_placar = loadSound("checkPoint.mp3");
}

//configuração do jogo
function setup(){
  //cria a area do jogo
  createCanvas(600,200);
  
  //configuração do tRex
  tRex = createSprite(60,185,20,50);
  
  tRex.addAnimation("correndo",tRex_correndo);
  tRex.addAnimation("perdeu",tRex_caindo);
  
  //bordas
  bordas = createEdgeSprites();
  
  //solo
  solo = createSprite(200,180,600,20);
  solo.addImage("terra",imagem_solo);
  
   
  solo_invisivel = createSprite(200,190,400,10);
  solo_invisivel.visible = false;
  
  //sorteio = Math.round(random(1,100));
  tRex.setCollider("circle",0,0,30);
  //tRex.debug = true;
  
  //teste = "marco";
  //console.log("ola "+teste)
 
  placar = 0;
  
  JOGAR = 1;
  ENCERRAR = 0;
  estadoJogo = JOGAR;
  
  grupo_nuvens = new Group();
  grupo_cactos = new Group();
  
  game_over = createSprite(300,100,20,20);
  reiniciar = createSprite(300,150,20,20);
  game_over.addImage("fim de jogo",game_img);
  reiniciar.addImage("reiniciando",reiniciar_img);
  game_over.scale = 0.5;
  reiniciar.scale = 0.5;
  game_over.visible = false;
  reiniciar.visible = false;
}


function draw(){
  background("white");
  
  if(tRex.isTouching(grupo_cactos)){
    estadoJogo = ENCERRAR;
  }
  
  if(estadoJogo === JOGAR){
    //pulo do tRex
    if(keyDown("space")&&tRex.y >150){
      tRex.velocityY = -10;
      som_salto.play();
    }
    //pontuação
    placar+=Math.round(frameRate()/60);
    //velocidade do solo
    solo.velocityX = -(2+placar/100);
    //reinicio do solo
    if (solo.x <0){
     solo.x = solo.width/2;
    }
    if(placar>0 && placar%100===0){
      som_placar.play();
    }
    // criando nuvens
    gerarNuvens();
    // criando cactos
    cactosinhos();
    if(placar>800&&placar<1000){
      background("gray");
    }
    
  }else if(estadoJogo === ENCERRAR){
     Parar_tudo();
     //som_morte.play();
    
    if(mousePressedOver(reiniciar)){
    resetar();
  }
  }
  
  tRex.scale = 0.5;
  
  //gravidade
  tRex.velocityY += 0.5;
  
  //colidir com o chão
  tRex.collide(solo_invisivel);
  
  
  
  //console.log(tRex.y);
  //console.log(frameCount)
  //console.count()
  
  fill("black");
  text("Pontuação: "+placar,500,20);
   
  
  
  //functions
  
  
  drawSprites();
}

function gerarNuvens(){
  //comando para gerar as nuvens
  if(frameCount%160===0){
    nuvem = createSprite(600,100,20,20);
    nuvem.velocityX = -(2+placar/100);
    nuvem.addImage("nuvens",imagem_nuvem);
    nuvem.scale = 0.5;
    nuvem.y = Math.round(random(20,100));
    nuvem.depth = tRex.depth -1;
    
    nuvem.lifetime = 310;
    grupo_nuvens.add(nuvem);
    
  }
  
}

function cactosinhos(){
  //comando para gerar cactos
  if(frameCount%100===50){
   cactos = createSprite(600,165,20,20);            
   
   cactos.scale = 0.4;
   cactos.velocityX = -(3+placar/100);
   sorteio = Math.round(random(1,6));
   switch(sorteio){
     case 1:cactos.addImage("espeto",cacto1);
       break;
     case 2:cactos.addImage("espeto",cacto2);
       break;
     case 3:cactos.addImage("espeto",cacto3);
       break;
     case 4:cactos.addImage("espeto",cacto4);
       break;
     case 5:cactos.addImage("espeto",cacto5);
       break;
     case 6:cactos.addImage("espeto",cacto6);
       break;
       
   } 
    cactos.depth = tRex.depth;
    cactos.lifetime = 250;
    grupo_cactos.add(cactos);
 }
 
}
function Parar_tudo(){
  solo.velocityX = 0;
  grupo_cactos.setVelocityXEach(0);
  grupo_nuvens.setVelocityXEach(0);
  grupo_cactos.setLifetimeEach(-1);
    grupo_nuvens.setLifetimeEach(-1);
    game_over.visible = true;
    reiniciar.visible = true;
    tRex.changeAnimation("perdeu",tRex_caindo);
  
  
}
function resetar(){
  game_over.visible = false;
  reiniciar.visible = false;
  estadoJogo = JOGAR;
  tRex.changeAnimation("correndo",tRex_correndo);
  solo.velocityX = -2;
  grupo_cactos.destroyEach();
  grupo_nuvens.destroyEach();
  placar = 0;
  nuvem.lifetime = 310;
  cactos.lifetime = 250;
}