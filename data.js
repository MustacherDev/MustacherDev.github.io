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
    "BIGCLOUD",
    "CLOUD",
    "BEANSTALK",
    "VINE",
    "HITBLOCK",
    "SITEICONS",
    "ROPEFRAME",
    "TOTAL"
));

var imgPaths = [  "Barco.png",
  "Baleadeira.png",
  "BaleadeiraBody.png",
  "Dust.png",
  "NuvemGrande.png",
  "NuvemNormal.png",
  "beanstalkHead.png",
  "vine.png",
  "hittedBlock.png",
  "siteIcons.png",
  "ropeFrame.png"
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
        sprites[SPR.BEANSTALK].setSubimg(16, 16);
        sprites[SPR.SITEICONS].setSubimg(64, 64);
        sprites[SPR.ROPEFRAME].setSubimg(16, 16);

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
