// Object Handlers
// Enumerator for Objects


const OBJECT = Object.freeze(new Enum(
    "GAMEOBJECT",
    "DRAW",
    "BLOCK",
    "BALL",
    "DUST",
    "WAVE",
    "CLOUD",
    "BEANSTALK",
    "TOTAL"
));


objectLists = [];

for (var i = 0; i < OBJECT.TOTAL; i++) {
    var arr = [];
    objectLists.push(arr);
}

// Object List Handler Functions

// These checkup functions clean inactive objects from the object classes lists
function checkUpList(type) {
    var _len = objectLists[type].length;
    for (var i = 0; i < _len; i++) {
        if (!objectLists[type][i].active) {
            objectLists[type].splice(i, 1);
            i--;
            _len--;
        }
    }
}

function checkUpLists() {
    for (var i = 2; i < objectLists.length; i++) {
        checkUpList(i);
    }
}

// Update all objects from the list
function updateList(type) {
    var _len = objectLists[type].length;
    for (var i = 0; i < _len; i++) {
        if (objectLists[type][i].active) {
            objectLists[type][i].update();
        } else {
            objectLists[type].splice(i, 1);
            i--;
            _len--;
        }
    }
}

// Draw all objects from the list
function drawList(type) {
    var _len = objectLists[type].length;
    for (var i = 0; i < _len; i++) {
        if (objectLists[type][i].active) {
            objectLists[type][i].show();
        } else {
            objectLists[type].splice(i, 1);
            i--;
            _len--;
        }
    }
}

function addList(obj, type) {
    objectLists[type].push(obj);
}

function sortDepth() {
    objectLists[OBJECT.DRAW].sort(function (a, b) {
        return b.depth - a.depth;
    });
}

function cleanList(type) {
    var _len = objectLists[type].length;
    for (var i = 0; i < _len; i++) {
        if (!objectLists[type][i].active) {
            objectLists[type].splice(i, 1);
            i--;
            _len--;
        }
    }
}

function cleanAllLists() {
    var _total = OBJECT.TOTAL;
    for (var j = 2; j < _total; j++) {
        cleanList(j);
    }
}
