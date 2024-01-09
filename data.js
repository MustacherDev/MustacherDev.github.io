var path = "Sounds/";



/// SOUND AND TEXTURES LOADER

// Loading Sounds
var soundsArr = [];
var soundsState = [];

var snd_Hit = new Audio(path + "Hit.mp3");
snd_Hit.volume = 0.5;
soundsArr.push(snd_Hit);




const SPR = Object.freeze(new Enum(
    "BOAT",
    "BALEA",
    "BALEAB",
    "DUST",
    "WAVE",
    "BIGCLOUD",
    "CLOUD",
    "BOMB",
    "SPLINTER",
    "PREMIER",
    "PREMIEROPEN",
    "GALOS",
    "JIRO",
    "NAI",
    "FRANGO",
    "XAROP",
    "SPEEDY",
    "BEANSTALK",
    "VINE",
    "HITBLOCK",
    "TOTAL"
));

var imgPaths = [  "Barco.png",
  "Baleadeira.png",
  "BaleadeiraBody.png",
  "Dust.png",
  "Wave.png",
  "NuvemGrande.png",
  "NuvemNormal.png",
  "Bomb.png",
  "splinterBall.png",
  "pokebola.png",
  "pokebolaaberta.png",
  "granjaFull3.png",
  "jiro.png",
  "Queen_Nai.png",
  "Frango.png",
  "Xarop.png",
  "Ligeirinho.png",
  "beanstalkHead.png",
  "vine.png",
  "hittedBlock.png"
];

var need2Load = imgPaths.length;
var dataLoaded = 0;
var allDataIsLoaded = false;
var spritesLoaded = false;

var sprites = [];
var images  = [];


function loadSprites() {
    if (!spritesLoaded) {
        for (var i = 0; i < images.length; i++) {
            sprites.push(createSprite(images[i]));
        }

        sprites[SPR.BALEAB].setSubimg(16, 16);
        sprites[SPR.DUST].setSubimg(16,16);
        sprites[SPR.GALOS].setSubimg(20, 16);
        sprites[SPR.BEANSTALK].setSubimg(16, 16);

        spritesLoaded = true;
    }
}

function checkImages() {
    for (var i = 0; i < images.length; i++) {
        if (!images[i].complete) {
            return false;
        }
    }
    return true;
}

function testLoad() {
    dataLoaded++;
    if (dataLoaded >= need2Load) {
        allDataIsLoaded = true;
        loadSprites();
    }
}


path = "Sprites/";

for(var i = 0 ; i < imgPaths.length; i++){
  images.push(new Image());
  images[i].onLoad = testLoad;

  images[i].src = path+imgPaths[i];
}
