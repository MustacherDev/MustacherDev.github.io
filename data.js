var path = "Sounds/";



/// SOUND AND TEXTURES LOADER

// Loading Sounds
var soundsArr = [];
var soundsState = [];

var snd_Hit = new Audio(path + "Hit.mp3");
snd_Hit.volume = 0.5;
soundsArr.push(snd_Hit);



path = "Sprites/";

// Sprite Importing
// Sprite(Image, Sprite Width and Height, Sprite Sheet Width and Height)

var barcoImg = new Image();
barcoImg.src = path + "Barco.png";
var spr_Barco = new Sprite(barcoImg, 225, 150, 225, 150);

var baleaImg = new Image();
baleaImg.src = path + "Baleadeira.png";
var spr_Balea = new Sprite(baleaImg, 16, 32, 16, 32);

var baleaBImg = new Image();
baleaBImg.src = path + "BaleadeiraBody.png";
var spr_BaleaBody = new Sprite(baleaBImg, 16, 16, 16, 64);

var dustBImg = new Image();
dustBImg.src = path + "Dust.png";
var spr_Dust = new Sprite(dustBImg, 16, 16, 16, 16);

var waveBImg = new Image();
waveBImg.src = path + "Wave.png";
var spr_Wave = new Sprite(waveBImg, 32, 16, 32, 16);

var bigCloudImg = new Image();
bigCloudImg.src = path + "NuvemGrande.png";
var spr_BigCloud = new Sprite(bigCloudImg, 48, 24, 48, 24);

var cloudImg = new Image();
cloudImg.src = path + "NuvemNormal.png";
var spr_Cloud = new Sprite(cloudImg, 32, 24, 32, 24);

var bombImg = new Image();
bombImg.src = path + "Bomb.png";
var spr_Bomb = new Sprite(bombImg, 90, 100, 90, 100);

var splinterImg = new Image();
splinterImg.src = path + "splinterBall.png";
var spr_Splinter = new Sprite(splinterImg, 604, 604, 604, 604);

var premierImg = new Image();
premierImg.src = path + "pokebola.png";
var spr_PremierBall = new Sprite(premierImg, 112, 112, 112, 112);

var premierOpenImg = new Image();
premierOpenImg.src = path + "pokebolaaberta.png";
var spr_OpenPremierBall = new Sprite(premierOpenImg, 112, 112, 112, 112);

var galosImg = new Image();
galosImg.src = path + "granjaFull3.png";
var spr_Galos = new Sprite(galosImg, 20, 16, 20, 432);


var jiroImg = new Image();
jiroImg.src = path + "jiro.png";
var spr_Jiro = new Sprite(jiroImg, 708, 1280, 708, 1280);

var naiImg = new Image();
naiImg.src = path + "Queen_Nai.png";
var spr_Nai = new Sprite(naiImg, 1138, 1280, 1138, 1280);

var frangoImg = new Image();
frangoImg.src = path + "Frango.png";
var spr_Frango = new Sprite(frangoImg, 473, 795, 473, 795);

var xaropImg = new Image();
xaropImg.src = path + "Xarop.png";
var spr_Xarop = new Sprite(xaropImg, 298, 418, 298, 418);

var speedyImg = new Image();
speedyImg.src = path + "Ligeirinho.png";
var spr_Speedy = new Sprite(speedyImg, 534, 694, 534, 694);


var beanstalkHeadImg = new Image();
beanstalkHeadImg.src = path + "beanstalkHead.png";
var spr_BeanstalkHead = new Sprite(beanstalkHeadImg, 16, 16, 32, 16);

var vineImg = new Image();
vineImg.src = path + "vine.png";
var spr_Vine = new Sprite(vineImg, 16, 16, 16, 16);

var hittedBlockImg = new Image();
hittedBlockImg.src = path + "hittedBlock.png";
var spr_HittedBlock = new Sprite(hittedBlockImg, 16, 16, 16, 16);


