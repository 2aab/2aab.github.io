//Ai Voronoi Music Mixer
// (c) 2022 Andreas Reza Abbaszadeh

var essentia;

EssentiaWASM().then( function(EssentiaWasm) {
    essentia = new Essentia(EssentiaWasm);
    console.log(essentia.version);
    
});

var group = new Group();
var secondLayer = new Layer();

var numberOfCopies = 32;

var mainStrokeWidth = 10;

var reverbColor = "#8789C0";
var phaserColor = "#F84AA7";
var delayColor = "#086375"; // "#C2E812" 0077B6 086375 646536 379634 216869

var leftCircleColor = "darkgray"; //"#00c9c9"
var rightCircleColor = "darkgray";
var middleCircleColor = "#00c9c9";
var leftCircleColorObj = new Color (leftCircleColor);
var rightCircleColorObj = new Color (rightCircleColor);
var middleCircleColorObj = new Color (middleCircleColor);
var leftCircleEnterLightness = leftCircleColorObj.lightness - 0.1;
var middleCircleEnterLightness = middleCircleColorObj.lightness - 0.1;
var rightCircleEnterLightness = rightCircleColorObj.lightness - 0.1;

var leftUpload = document.getElementById("leftUpload");
var rightUpload = document.getElementById("rightUpload");

var isMobileDevice = false;

if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    isMobileDevice = true;
}

var vMinFontSize = parseFloat(window.getComputedStyle(document.getElementById("idInput")).fontSize)*0.75;
var horizontalTextFontSize = view.size.width / 75;

console.log(vMinFontSize);

console.log(globals.a);

for (var k = 0; k < globals.b; k++) {

    // Creates the Paths items from the Voronoi Data and puts all of them in a group

    var currentPathData = globals.a[k].d;
    group.addChild(new Path(currentPathData));
    group.children[k].strokeColor = "#4b0082";
    group.children[k].strokeWidth = mainStrokeWidth;
}

console.log(group);

function resizeMain() {

    // Keep Voronoi fullscreen and centered no matter what
    group.position = view.center;
    group.scaling = new Point(view.bounds.width/group.bounds.width, view.bounds.height/group.bounds.height); // Scale to Fit to Screen
}

function drawCopies() {

    resizeMain();

    for (var o = 0; o < globals.b; o++) {

        var currentGroup = secondLayer.addChild(new Group());

        // creates all the copies of Path, First "for" loop is for each path we have, Create a new group for each master path

        for (var p = 1; p < (numberOfCopies+1); p++) {

            var numberOfCopiesPlusOne = numberOfCopies+1; // for convenience sake

            //Second "for" loop is for each copy of the Path

            var newPoint = new Path({
                pathData: group.children[o].pathData,
                strokeColor: "darkgrey",
                strokeWidth: 0.5,
            }); // get path data from Path Choosen and create new path
            newPoint.scale(1 - p / numberOfCopiesPlusOne); // simple math for scaling down 1 relative to number
            currentGroup.addChild(newPoint); // put the Path in a new group
            secondLayer.addChild(currentGroup); //Put this new group in the parent group for each element elements

        }

    }

}

drawCopies();

console.log(project);

// Drawing 3 Circles for Controls as object literals

var middleCircle = new Shape.Circle({
        
    center: new Point(view.size.width*0.50, view.size.height*0.815),
    radius: view.size.height/24 + view.size.width/24,
    fillColor: middleCircleColor,
    // blendMode: "luminosity"

});

var middleSwirl = new Path.Star({

    center: new Point(view.size.width*0.50, view.size.height*0.815),
    points: 12,
    radius1: 25,
    radius2: 50,   
    fillColor: 'purple'

});

var leftCircle = new Shape.Circle({
        
    center: new Point(view.size.width/4, middleCircle.bounds.center.y),
    radius: middleCircle.radius*0.75,
    fillColor: leftCircleColor,
    
});

var leftCircleIndicator = new Shape.Circle({
    center: leftCircle.bounds.topCenter + new Point(0, -20),
    radius: 10,
    fillColor: "black",
});

var rightCircle = new Shape.Circle({
        
    center: new Point(middleCircle.bounds.center.x + 100, middleCircle.bounds.center.y),
    radius: middleCircle.radius*0.75,
    fillColor: rightCircleColor,
        
});

var rightCircleIndicator = new Shape.Circle({
    center: rightCircle.bounds.topCenter + new Point(0, -20),
    radius: 10,
    fillColor: "black",
});

//Adding them all to a separate new layer

var controlsLayer = new Layer({

    children: [leftCircle, leftCircleIndicator, middleSwirl, middleCircle, rightCircle, rightCircleIndicator],

});

// left circle

leftCircle.onClick = function(event) {

    audio.resume();

    if (leftSourceState == "none" || leftSourceState == "loaded" || leftSourceState == "ended") {

        this.tween({"fillColor.lightness": leftCircleColorObj.lightness}, {"fillColor.lightness": leftCircleEnterLightness},  200);
        document.getElementById("leftUpload").click();

    }
    else if(leftSourceState == "playing") {

        var currentSaturation = this.fillColor.saturation;
        this.tween({"fillColor.saturation": 0}, {"fillColor.saturation": leftCircleColorObj.saturation}, 400);
        
    }

};

leftCircle.onMouseEnter = function(event) {

    this.tweenTo({"fillColor.lightness": leftCircleEnterLightness}, 200);

};

leftCircle.onMouseLeave = function(event) {

    this.tweenTo({"fillColor.lightness": leftCircleColorObj.lightness}, 200);

};

// right circle

rightCircle.onClick = function(event) {

    audio.resume();

    if (rightSourceState == "none" || rightSourceState == "loaded" || rightSourceState == "ended") {

        this.tween({"fillColor.lightness": rightCircleColorObj.lightness}, {"fillColor.lightness": rightCircleEnterLightness},  200);
        document.getElementById("rightUpload").click();

    }
    else if (rightSourceStatus == "playing") {

        var currentSaturation = this.fillColor.saturation;
        this.tween({"fillColor.saturation": 0}, {"fillColor.saturation": rightCircleColorObj.saturation}, 400);

    }

};

rightCircle.onMouseEnter = function(event) {

    this.tweenTo({"fillColor.lightness": rightCircleEnterLightness}, 200);

};

rightCircle.onMouseLeave = function(event) {

    this.tweenTo({"fillColor.lightness": rightCircleColorObj.lightness}, 200);

};

// middle circle

middleCircle.onDoubleClick = function(event) {

    // if (audio.state === "running") {

    //     this.tween({"fillColor.lightness": middleCircleColorObj.lightness}, {"fillColor.lightness": middleCircleEnterLightness},  200);

    //     audio.suspend();

    // }
    // else if (audio.state === "suspended") {

    //     this.tween({"fillColor.lightness": middleCircleColorObj.lightness}, {"fillColor.lightness": middleCircleEnterLightness},  200);

    //     audio.resume();

    //     // gainNode.gain.setTargetAtTime(1, audio.currentTime, 0.01);
    //     // source.playbackRate.value = 1;

    //     // isAudioPlaying = !isAudioPlaying;

    // }

};

middleCircle.onClick = function (event) {

    // console.log(leftGainNodeDestination);
    // console.log(rightGainNodeDestination);

    if (leftSourceState == "playing" && rightSourceState == "loaded") { // if right loaded and left playing

        isTransitionHappening = true;

        var leftNodePlayingTime = audio.currentTime - leftNodeStartTime; // is our current playing time

        for (var i = 0; i < leftSourceTicks.length; i++) {
            if(leftSourceTicks[i] > leftNodePlayingTime) {
                closestLeftNodeBeatTime = leftSourceTicks[i];
                break;
            }
        }
        
        var timeToTransition = closestLeftNodeBeatTime - leftNodePlayingTime; 

        setTimeout(function leftToRightTransition(){

            leftSource.playbackRate.setTargetAtTime(Math.round(rightNodeBPM) / Math.round(leftNodeBPM), audio.currentTime, 0);
            leftOrRight = false;

            rightGainNode.gain.value = 0;
            rightSource.start(0, rightBeatPosition[7]);
            delay.delayTime.value = 30 / Math.round(rightNodeBPM);
            rightSourceState = "playing";
            rightCircleIndicator.fillColor = "green";
            rightNodeStartTime = audio.currentTime;

            rightGainNode.gain.setTargetAtTime(1, audio.currentTime, (1/rightNodeBPM)*960 ); //(1/rightNodeBPM)*480
            leftGainNode.gain.setTargetAtTime(0, audio.currentTime, (1/rightNodeBPM)*960 ); 
        
            setTimeout(function stopLeftWhenFinishedTransition(){
                if (leftSourceState !== "ended") {
                    leftSource.stop();
                    leftSourceState = "ended";
                    leftCircleIndicator.fillColor = "grey";
                }
            }, (1/rightNodeBPM)*960000*4 ); //adjust in between 5 and 3

        }, timeToTransition*1000);

    }
    else if (rightSourceState == "playing" && leftSourceState == "loaded") {

        isTransitionHappening = true;

        var rightNodePlayingTime = audio.currentTime - rightNodeStartTime; // is our current playing time

        for (i = 0; i < rightSourceTicks.length; i++) { // get the 2nd closest higher sync point
            if(rightSourceTicks[i] > rightNodePlayingTime) {
                closestRightNodeBeatTime = rightSourceTicks[i];
                break;
            }
        }

        var timeToTransition = closestRightNodeBeatTime - rightNodePlayingTime;

        setTimeout(function rightToLeftTransition(){

            rightSource.playbackRate.setTargetAtTime(leftNodeBPM/rightNodeBPM, audio.currentTime, 0);
            leftOrRight = true;

            leftGainNode.gain.value = 0;
            leftSource.start(0, leftBeatPosition[7]);
            delay.delayTime.value = 30 / Math.round(leftNodeBPM);
            leftSourceState = "playing";
            leftCircleIndicator.fillColor = "green";
            leftNodeStartTime = audio.currentTime;

            leftGainNode.gain.setTargetAtTime(1, audio.currentTime, (1/leftNodeBPM)*960 );  //(1/leftNodeBPM)*480
            rightGainNode.gain.setTargetAtTime(0, audio.currentTime, (1/leftNodeBPM)*960 ); 
        
            setTimeout(function stopRightWhenFinishedTransition(){
                if (rightSourceState !== "ended") { // if track has not already ended
                    rightSource.stop();
                    rightSourceState = "ended";
                    rightCircleIndicator.fillColor = "grey";
                }
            }, (1/leftNodeBPM)*960000*4 ); // adjust between 5 and 3

        }, timeToTransition*1000);

    }

}

middleCircle.onMouseEnter = function(event) {

    this.tweenTo({"fillColor.lightness": middleCircleEnterLightness}, 200);

};

middleCircle.onMouseLeave = function(event) {

    this.tweenTo({"fillColor.lightness": middleCircleColorObj.lightness}, 200);

};

// create Help screen
//
//black Background
var helpBlackBackground = new Shape.Rectangle(view.size);
helpBlackBackground.fillColor = "black";

//Text for Middle background
var helpTextMiddle = new PointText(new Point(middleCircle.bounds.center.x, middleCircle.bounds.bottomCenter.y + 20));
helpTextMiddle.justification = "center";
helpTextMiddle.content = "SWITCH";
helpTextMiddle.fillColor = "white";
helpTextMiddle.fontFamily = "Microgramma";
helpTextMiddle.fontSize = vMinFontSize;

//Text for Left background
var helpTextLeft = new PointText(new Point(leftCircle.bounds.center.x, leftCircle.bounds.bottomCenter.y + 20));
helpTextLeft.justification = "center";
helpTextLeft.content = "TRACK 1";
helpTextLeft.fillColor = "white";
helpTextLeft.fontFamily = "Microgramma";
helpTextLeft.fontSize = vMinFontSize;

//text for left Indicator
var helpTextLeftIndicator = new PointText(new Point(leftCircle.bounds.center.x, leftCircle.bounds.topCenter.y - 50));
helpTextLeftIndicator.justification = "center";
helpTextLeftIndicator.content = "LEFT INDICATOR";
helpTextLeftIndicator.fillColor = "white";
helpTextLeftIndicator.fontFamily = "Microgramma";
helpTextLeftIndicator.fontSize = vMinFontSize;

//Text for Right Background
var helpTextRight = new PointText(new Point(rightCircle.bounds.center.x, rightCircle.bounds.bottomCenter.y + 20));
helpTextRight.justification = "center";
helpTextRight.content = "TRACK 2";
helpTextRight.fillColor = "white";
helpTextRight.fontFamily = "Microgramma";
helpTextRight.fontSize = vMinFontSize;

//Text for Right Indicator
var helpTextRightIndicator = new PointText(new Point(rightCircle.bounds.center.x, rightCircle.bounds.topCenter.y - 50));
helpTextRightIndicator.justification = "center";
helpTextRightIndicator.content = "RIGHT INDICATOR";
helpTextRightIndicator.fillColor = "white";
helpTextRightIndicator.fontFamily = "Microgramma";
helpTextRightIndicator.fontSize = vMinFontSize;

//Text for Center background
var helpTextCenter = new PointText(new Point(view.center.x, view.center.y - view.bounds.height/4.5));
helpTextCenter.justification = "center";
helpTextCenter.content = " \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n INPUT A RANDOM SEED TO CHANGE THE SHAPE OF THE VORONOI \n \n \n \n \n \n TO START, SIMPLY CLICK ON A TRACK AND LOAD A SONG. \n \n LOAD UP THE SECOND TRACK WITH A DIFFERENT SONG AND THEN CLICK \n \n ON THE BUTTON IN THE MIDDLE TO MAKE A TRANSITION \n \n FROM ONE TO THE OTHER. \n \n \n \n GREEN INDICATOR = TRACK IS PLAYING \n \n YELLOW INDICATOR = TRACK IS LOADED \n \n GREY INDICATOR = TRACK HAS ENDED \n \n BLACK INDICATOR = TRACK IS EMPTY \n \n \n \n SWIPE UP ON YOUR LEFT VORONOI TO CONTROL REVERB, AND ON YOUR RIGHT TO CONTROL DELAY \n \n THE TOP VORONOI IS A PHASER THAN CAN BE ACTIVATED ON OR OFF BY TAPPING ON IT";
helpTextCenter.fillColor = "white";
helpTextCenter.fontFamily = "Microgramma";
helpTextCenter.fontSize = vMinFontSize;

//Text for current Random Center background
var helpTextCurrentRandom = new PointText(new Point(view.center.x, view.center.y - view.bounds.height/2.3));
helpTextCurrentRandom.justification = "center";
helpTextCurrentRandom.content = "CURRENT SEED : " + globals.c;
helpTextCurrentRandom.fillColor = "black";
helpTextCurrentRandom.strokeColor = "white";
helpTextCurrentRandom.strokeWidth = 0.5;
helpTextCurrentRandom.fontFamily = "Microgramma";
helpTextCurrentRandom.fontSize = vMinFontSize*1.75;

//Copyright Text
var helpTextCopyright = new PointText(new Point(view.center.x, view.center.y + view.bounds.height/2.15));
helpTextCopyright.justification = "center";
helpTextCopyright.content = "AI DJ MIXER BASED ON PAPER.JS & ESSENTIA.JS COPYRIGHT 2022 ANDREAS ABBASZADEH";
helpTextCopyright.fillColor = "red";
helpTextCopyright.fontFamily = "Microgramma";
helpTextCopyright.fontSize = horizontalTextFontSize;

// MUSIC VISUALISER BASED ON PAPER.JS \n \n © 2022 ANDREAS ABBASZADEH

//add all text in Group
var helpText = new Group (helpTextMiddle, helpTextLeft, helpTextLeftIndicator,  helpTextRight, helpTextRightIndicator, helpTextCenter, helpTextCurrentRandom, helpTextCopyright);

//Makes the background as a group with text group added
var helpBackground = new Group (helpBlackBackground, helpText);

//invisible for now
helpBlackBackground.opacity = 0;
helpText.opacity = 0;

//create black circle for help button
var helpCircle = new Shape.Circle({
    radius: leftCircle.radius*0.8,
});

var muteCircle = new Shape.Circle({
    radius: leftCircle.radius*0.8,
});

helpCircleVectorToEdge = view.bounds.topRight - new Point(view.size.width*0.95 - helpCircle.radius, 0);
muteCircleVectorToEdge = view.bounds.topLeft + new Point(view.size.width*0.05 + muteCircle.radius, 0);

helpCircle.position = new Point(view.size.width*0.95 - helpCircle.radius, helpCircleVectorToEdge.x);
helpCircle.fillColor = "black";

muteCircle.position = new Point(view.size.width*0.05 + muteCircle.radius, muteCircleVectorToEdge.x);
muteCircle.fillColor = "red";

//text for mute circle
var helpMuteCircle = new PointText(new Point(muteCircle.bounds.center.x, muteCircle.bounds.bottomCenter.y + 15));
helpMuteCircle.justification = "center";
helpMuteCircle.content = "MUTE";
helpMuteCircle.fillColor = "white";
helpMuteCircle.fontFamily = "Microgramma";
helpMuteCircle.fontSize = vMinFontSize;

helpText.addChild(helpMuteCircle);


// create ? with Svg microgamma font
var microgammaPathDataUpper = "M 3.8 -1.94 L 2.78 -1.94 L 2.78 -2.54 C 2.78 -2.9 2.96 -3.19 3.32 -3.41 C 3.68 -3.62 4.1 -3.73 4.58 -3.73 C 5.07 -3.73 5.42 -3.83 5.61 -4.03 C 5.8 -4.22 5.89 -4.55 5.89 -5.01 C 5.89 -5.48 5.76 -5.78 5.51 -5.91 C 5.26 -6.04 4.64 -6.11 3.66 -6.11 C 2.68 -6.11 2.06 -6.03 1.81 -5.87 C 1.56 -5.7 1.43 -5.3 1.43 -4.66 L 0.41 -4.66 C 0.41 -5.66 0.61 -6.31 1.02 -6.6 C 1.43 -6.89 2.31 -7.03 3.66 -7.03 C 4.93 -7.03 5.79 -6.9 6.24 -6.64 C 6.69 -6.37 6.91 -5.83 6.91 -5.01 C 6.91 -4.31 6.77 -3.78 6.48 -3.41 C 6.19 -3.04 5.79 -2.86 5.26 -2.86 C 4.89 -2.86 4.55 -2.79 4.25 -2.66 C 3.95 -2.53 3.8 -2.37 3.8 -2.2 L 3.8 -1.94 Z"
var microgammaPathDataDot = "M 2.64 -1.26 L 3.85 -1.26 L 3.85 0 L 2.64 0 L 2.64 -1.26 Z"

var helpInterrogationMarkUpper = new Path(microgammaPathDataUpper);
var helpInterrogationMarkDot = new Path(microgammaPathDataDot);

//put interrogation dot and upper in group
var interrogationGroup = new Group(helpInterrogationMarkUpper, helpInterrogationMarkDot);

//set position of ? group to helpCircl center
interrogationGroup.position = helpCircle.position;

//set styling for ? mark
interrogationGroup.strokeColor = "white";
interrogationGroup.scale(middleCircle.radius/12);

//put them in reverse order cause of index stuff

var helpLayer = new Layer();

controlsLayer.insertChild(0, interrogationGroup);
controlsLayer.insertChild(0, helpCircle);
controlsLayer.insertChild(0, helpBackground);
helpBackground.remove();

console.log("DEBUG BELOW");
console.log(interrogationGroup);
console.log(helpCircle);
console.log(helpBackground);
console.log("DEBUG ABOVE");
console.log(controlsLayer.children);

var helpFunction = function(event) {

    if (helpBlackBackground.opacity < 0.75) {

        controlsLayer.insertChild(0, helpBackground);

        var input = document.getElementById("idInput");

        helpText.tweenTo({"opacity": 1}, 300);
        var tween = helpBlackBackground.tweenTo({"opacity": 0.75}, 300);
        input.style.display = "inline";
        input.className = "fadeIn"; //fade in

    }
    else {

        var input = document.getElementById("idInput");

        helpText.tweenTo({"opacity": 0}, 300);
        var tween = helpBlackBackground.tweenTo({"opacity": 0}, 300);
        input.value = ""; // optional, clear the input when closing the help screen
        input.className = "fadeOut"; // fade in
        setTimeout(function() {
            input.style.display = "none"; // put to none only after 300ms
            helpBackground.remove();
        }, 300);

    }
    
}

helpCircle.onClick = helpFunction;
interrogationGroup.onClick = helpFunction;
muteCircle.onClick = function() {

    var volume = merger.gain.value;

    if (volume == 0) {
        merger.gain.value = 1;
    }
    else if (volume !== 0) {
        merger.gain.value = 0;
    }

}

//get middle voronoi copies group 

var middleVoronoi = project.getItems({

    match: function(middleVoronoi) {

            return middleVoronoi.contains(view.center);

        }
    
        
})[4];

//get middle Voronoi blue Path

var middleVoronoiOther = project.getItems({

    match: function(middleVoronoiOther) {

            return middleVoronoiOther.contains(view.center);

        }

})[2];

// get other Voronoi

var leftVoronoi = project.getItems({

    match: function(leftVoronoi) {

            return leftVoronoi.contains(new Point(view.size.width*0.3, view.size.height*0.4));

        }

})[4];

var rightVoronoi = project.getItems({

    match: function(rightVoronoi) {

            return rightVoronoi.contains(new Point(view.size.width*0.7, view.size.height*0.4));

        }

})[4];

var topVoronoi = project.getItems({

    match: function(topVoronoi) {

            return topVoronoi.contains(new Point(view.size.width*0.5, view.size.height*0.3));

        }

})[4];

//make layer changes / style changes
secondLayer.sendToBack(); 
group.bringToFront();
// group.parent.blendMode = "multiply"; //multiply, xor

function initResizeCopies() {

    for (c = 0; c < globals.b; c++) {   

    secondLayer.children[c].position = group.children[c].position;
    secondLayer.children[c].scaling = new Point(
    (group.children[c].bounds.width - group.children[c].strokeWidth) /  secondLayer.children[c].bounds.width,
    (group.children[c].bounds.height - group.children[c].strokeWidth)  /  secondLayer.children[c].bounds.height);

    }

    initalCopiesSize = secondLayer.bounds;

}

initResizeCopies();
var initalCopiesSize = view.size;

function resizeCopies() {

    secondLayer.position = view.center;
    secondLayer.scaling = new Point(view.size.width / initalCopiesSize.width, view.size.height / initalCopiesSize.height);

    initalCopiesSize = view.size;

}

view.onResize = function(event) {

    // Updates the view when Resizing

    resizeMain();
    resizeCopies();

    //updates text size

    if (view.size.width > view.size.height || !isMobileDevice) {vMinFontSize = parseFloat(window.getComputedStyle(document.getElementById("idInput")).fontSize)*0.45;} else if (isMobileDevice) {vMinFontSize = parseFloat(window.getComputedStyle(document.getElementById("idInput")).fontSize)*0.55;}
    if (view.size.width > view.size.height) {horizontalTextFontSize = view.size.width / 150;} else if (view.size.width < view.size.height) {horizontalTextFontSize =  view.size.width/60}
    helpTextMiddle.fontSize = vMinFontSize;
    helpTextLeft.fontSize = vMinFontSize;
    helpTextLeftIndicator.fontSize = vMinFontSize;
    helpTextRight.fontSize = vMinFontSize;
    helpTextRightIndicator.fontSize = vMinFontSize;
    helpTextCenter.fontSize = vMinFontSize;
    helpTextCurrentRandom.fontSize = vMinFontSize*1.75;
    helpTextCopyright.fontSize = horizontalTextFontSize;
    helpMuteCircle.fontSize = vMinFontSize;

    //update position of controls circles

    middleCircle.position = new Point(view.size.width*0.5, view.size.height*0.815);
    middleSwirl.position = new Point(view.size.width*0.5, view.size.height*0.815);
    leftCircle.position = new Point(view.size.width/4, middleCircle.bounds.center.y);
    rightCircle.position = new Point(view.size.width/(4/3), middleCircle.bounds.center.y);

    middleCircle.radius = view.size.height/24 + view.size.width/24;
    middleSwirl.scale(new Point(middleCircle.bounds.width / middleSwirl.bounds.width*0.8, middleCircle.bounds.height / middleSwirl.bounds.height*0.8));
    leftCircle.radius = middleCircle.radius*0.75;
    rightCircle.radius = middleCircle.radius*0.75;

    //Update the background help elements

    helpBlackBackground.position = view.center;
    helpBlackBackground.size = new Size(view.bounds.width, view.bounds.height);

    //Update position of text

    helpTextMiddle.position = new Point(middleCircle.bounds.center.x, middleCircle.bounds.bottomCenter.y + 20)
    helpTextLeft.position = new Point(leftCircle.bounds.center.x, leftCircle.bounds.bottomCenter.y + 20);
    helpTextLeftIndicator.position = new Point(leftCircle.bounds.center.x, leftCircle.bounds.topCenter.y - 50);
    helpTextRight.position = new Point(rightCircle.bounds.center.x, rightCircle.bounds.bottomCenter.y + 20);
    helpTextRightIndicator.position = new Point(rightCircle.bounds.center.x, rightCircle.bounds.topCenter.y - 50)
    helpTextCenter.position = new Point(view.center.x, view.center.y - view.bounds.height/4.5);
    helpTextCurrentRandom.position = new Point(view.center.x, view.center.y - view.bounds.height/2.325);
    helpTextCopyright.position = new Point(view.center.x, view.center.y + view.bounds.height/2.075);
    helpMuteCircle.position = new Point(muteCircle.bounds.center.x, muteCircle.bounds.bottomCenter.y + 15);

    //black circle and interrogation group

    helpCircle.radius = leftCircle.radius*0.8;
    helpCircleVectorToEdge = view.bounds.topRight - new Point(view.size.width*0.95 - helpCircle.radius, 0);
    helpCircle.position = new Point(view.size.width*0.95 - helpCircle.radius, helpCircleVectorToEdge.x);

    muteCircle.radius = leftCircle.radius*0.8;
    muteCircleVectorToEdge = view.bounds.topLeft + new Point(view.size.width*0.05 + muteCircle.radius, 0);
    muteCircle.position = new Point(view.size.width*0.05 + muteCircle.radius, muteCircleVectorToEdge.x);

    interrogationGroup.position = helpCircle.position;

    //status indicator for DJ decks

    leftCircleIndicator.position = leftCircle.bounds.topCenter + new Point(0, -20);
    rightCircleIndicator.position = rightCircle.bounds.topCenter + new Point(0, -20);

}

//web audio API context
var AudioContext = window.AudioContext || window.webkitAudioContext;

if (AudioContext) { 

    var audio = new AudioContext({
        sampleRate: 44100,
    });

    //Create Gain Node and set Gain to 1
    var leftGainNode = audio.createGain();
    leftGainNode.gain.value = 1;
    var rightGainNode = audio.createGain();
    rightGainNode.gain.value = 1;

    //Create Audio Merger
    var merger = audio.createGain();
    merger.gain.value = 1;

    //create effects
    var reverb = audio.createConvolver();
    loadAudioBuffer("./Bricasti_M7__6_Spaces_11_Tanglewood_44.1_16_2.0.wav", reverb);
    var reverbGain = audio.createGain();
    reverbGain.gain.value = 0;

    var delay = audio.createDelay();
    var delayGain = audio.createGain();
    delayGain.gain.value = 0;
    var feedback = audio.createGain();
    feedback.gain.value = 0.7;
    var delayFilter = audio.createBiquadFilter();
    delayFilter.type = "highpass";
    delayFilter.frequency = 3000;
    delayFilter.q = 5;

    //Phaser

    var phaser = audio.createBiquadFilter();
    phaser.type = "allpass";
    phaser.q = 2;
    var phaser2 = audio.createBiquadFilter();
    phaser2.type = "allpass";
    phaser2.q = 2;
    var phaser3 = audio.createBiquadFilter();
    phaser3.type = "allpass";
    phaser3.q = 2;

    var phaserGain = audio.createGain();
    phaserGain.gain.value = 0;

    var lfo = audio.createOscillator();
    lfo.frequency.value = 0.5;
    lfo.type = "sine";
    var lfo2 = audio.createOscillator();
    lfo2.frequency.value = 0.45;
    lfo2.type = "sine";
    var lfo3 = audio.createOscillator();
    lfo3.frequency.value = 0.55;
    lfo3.type = "sine";

    var offset = audio.createConstantSource();

    var lfoGain = audio.createGain();
    lfoGain.gain.value = 18000;
    var lfoGain2 = audio.createGain();
    lfoGain2.gain.value = 18000;
    var lfoGain3 = audio.createGain();
    lfoGain3.gain.value = 18000;

    //Create Analyser Node
    var analyser = audio.createAnalyser();
    analyser.minDecibels = -85;
    analyser.maxDecibels = -5;
    
    //analyser preferences
    analyser.fftSize = numberOfCopies*2;
    analyser.smoothingTimeConstant = 0.7;

    //buffer for Analyser
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);

    //setup up mp3 Streaming Node
    var leftSource = audio.createBufferSource();
    var rightSource = audio.createBufferSource();

    console.log(leftSource);
    console.log(rightSource);

    //connect everything
    leftSource.connect(leftGainNode);
    rightSource.connect(rightGainNode);
    leftGainNode.connect(merger);
    rightGainNode.connect(merger);
    merger.connect(reverbGain);
    merger.connect(delayGain);
    merger.connect(analyser);
    reverbGain.connect(reverb);
    reverb.connect(analyser);
    delayGain.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(delayFilter);
    delayFilter.connect(analyser);
    analyser.connect(audio.destination);

    merger.connect(phaserGain);
    phaserGain.connect(phaser);
    phaserGain.connect(phaser2);
    phaserGain.connect(phaser3);
    phaser.connect(analyser);
    phaser2.connect(analyser);
    phaser3.connect(analyser);
    lfo.connect(lfoGain);
    lfo2.connect(lfoGain2);
    lfo3.connect(lfoGain3);
    offset.connect(lfoGain);
    offset.connect(lfoGain2);
    offset.connect(lfoGain3);
    lfoGain.connect(phaser.frequency);
    lfoGain2.connect(phaser2.frequency);
    lfoGain3.connect(phaser3.frequency);

}

function onKeyDown(event) {

    console.log(event);

    if (event.key == "enter" && document.getElementById("idInput").value !== "") {

        globals.d(document.getElementById("idInput").value);

    }


}

//Calculate Useable bandwidth of MP3 freq

var sourceSampleRate = leftSource.context.sampleRate;
var HzPerBand = sourceSampleRate / (bufferLength*2);
var bandwidthCount = 0;

for (ä = 0; ä < bufferLength; ä++) {

    if(bandwidthCount*HzPerBand < 17500) {

        bandwidthCount++;

    }

}

console.log(bandwidthCount);

var copiesNumber = numberOfCopies;

var mousePoint;

function onMouseMove(event) {

    mousePoint = event.point;
    
}

view.onFrame = function (event) {

    //Fancy code to keep Tempo marker always correct during transitions

    if (leftSource.playbackRate.value == 1) {
        leftTimeOfTransition = audio.currentTime - leftNodeStartTime;
    }
    else if (leftSource.playbackRate.value !== 1 && !leftTransitionFlag) {
        leftTimeOfTransition = audio.currentTime - leftNodeStartTime;
        leftTransitionFlag = true;
    }
    if (rightSource.playbackRate.value == 1) {
        rightTimeOfTransition = audio.currentTime - rightNodeStartTime;
    }
    else if (rightSource.playbackRate.value !== 1 && !rightTransitionFlag) {
        rightTimeOfTransition = audio.currentTime - rightNodeStartTime;
        rightTransitionFlag = true;
    }

    if (leftSourceState == "playing" && rightSourceState == "playing") {
        isTransitionHappening = true;
    }
    else {
        isTransitionHappening = false;
    }

    if (isTransitionHappening) {
        middleSwirl.rotate(3); 
    }

    //code for the on tempo indicators

    if (leftSourceState == "playing" && leftSourceTicks[leftCount] < (audio.currentTime - leftNodeStartTime)*leftSource.playbackRate.value + (leftTimeOfTransition - leftTimeOfTransition*leftSource.playbackRate.value) ) {
        // console.log(" TICK ");
        // console.log(leftCount);
        leftCircleIndicator.fillColor.alpha = leftCount % 2;
        leftCount++;
        if (leftOrRight && (leftCount%2 == 0)) {
            middleVoronoi.children.forEach(function (element) {
                element.strokeColor.hue += 60;
            });
        }
    }
    if (rightSourceState == "playing" && rightSourceTicks[rightCount] < (audio.currentTime - rightNodeStartTime)*rightSource.playbackRate.value + (rightTimeOfTransition - rightTimeOfTransition*rightSource.playbackRate.value) ) {
        // console.log(" TICK ");
        // console.log(rightCount);
        rightCircleIndicator.fillColor.alpha = rightCount % 2;
        rightCount++;
        if (!leftOrRight && (rightCount%2 == 0)) {
            middleVoronoi.children.forEach(function (element) {
                element.strokeColor.hue += 60;
            });
        }
    }

    //self explanatory, get voronoi copies that are outside the view

    var copiesOutside = middleVoronoi.getItems({

        recursive: false,
        match: function(copiesOutside) {

                return copiesOutside.contains(view.bounds.topLeft) && copiesOutside.contains(view.bounds.bottomLeft) && copiesOutside.contains(view.bounds.topRight) && copiesOutside.contains(view.bounds.bottomRight);

        }

    });

    for (j = 0; j<copiesOutside.length; j++) {

        scalePath(copiesOutside[j]);
        // copiesOutside[j].insertAbove(middleVoronoi.lastChild); // different effect of visualiser

    }

    function scalePath (pathToScale) {

        //scale function to 1 - 31/32*1.25 or wtv number of copies to make it shrink by same amount each time
        pathToScale.scale(middleVoronoiOther.bounds.width*(1 - copiesNumber / (copiesNumber*1.25)) / pathToScale.bounds.width);

    }

    analyser.getByteFrequencyData(dataArray);

    if ((audio.state == "running") && (leftSourceState == "playing" || rightSourceState == "playing" )) {

        //The border blue voronoi animation
        group.children[0].strokeWidth = (dataArray[1]*dataArray[1]*0.001 + mainStrokeWidth);
        group.children[1].strokeWidth = (dataArray[1]*dataArray[1]*0.001 + mainStrokeWidth);
        group.children[2].strokeWidth = (dataArray[1]*dataArray[1]*0.001 + mainStrokeWidth);
        group.children[3].strokeWidth = (dataArray[1]*dataArray[1]*0.001 + mainStrokeWidth);
        group.children[4].strokeWidth = (dataArray[1]*dataArray[1]*0.001 + mainStrokeWidth);

        for (var q = 0; q < bandwidthCount; q++) {

            //reactive to audio loop for all clones that have valid audio
            middleVoronoi.children[(bufferLength-1) - q].scale((dataArray[q]/255)*0.05+1.005);
            middleVoronoi.children[(bufferLength-1) - q].strokeColor.saturation = (dataArray[q]/255);
            middleVoronoi.children[(bufferLength-1) - q].strokeColor.brightness = (dataArray[q]/255);
            middleVoronoi.children[(bufferLength-1) - q].strokeWidth = (dataArray[q]*0.1 + 0.5);

        }

        for (var t = bandwidthCount+1; t < bufferLength; t++) {

            //bands that are out of the normal mp3 audio range reuse data from high-end freq spectrum
            middleVoronoi.children[bufferLength - t].scale( (dataArray[t-(bufferLength-bandwidthCount)]/255)*0.05+1.005);
            middleVoronoi.children[bufferLength - t].strokeWidth = (dataArray[t-(bufferLength-bandwidthCount)]*0.1 + 0.5);
            middleVoronoi.children[bufferLength - t].strokeColor.saturation = (dataArray[t-(bufferLength-bandwidthCount)]/255);
            middleVoronoi.children[bufferLength - t].strokeColor.brightness = (dataArray[t-(bufferLength-bandwidthCount)]/255);

        }

    }

}

var lfoStarted = false;
var lfoOn = false;
function onMouseDown(event) {

    var itemClicked = project.getItems({

        match: function(itemClicked) {

            return itemClicked.contains(event.downPoint);

        }

    });

    if (itemClicked[2] == topVoronoi && itemClicked[itemClicked.length-1].type !== "circle") {

        
        if (!lfoStarted) {
            lfo.start();
            lfo2.start(audio.currentTime + 0.1);
            lfo3.start(audio.currentTime + 0.2)
            offset.start();
            lfoStarted = true;
            console.log("PHASER STARTED");
        }
        

        if (!lfoOn) {

            topVoronoi.children[0].fillColor = phaserColor;

            phaserGain.gain.value = 0.5;
            merger.gain.value = 0.5;
            console.log("PHASER GAIN ON");
            lfoOn = true;

        }
        else if (lfoOn) {

            topVoronoi.children[0].fillColor = null;

            phaserGain.gain.value = 0;
            merger.gain.value = 1;
            console.log("PHASER GAIN OFF");
            lfoOn = false;
        }

        

    }
    

}

var leftIndex = leftVoronoi.children.length - 1;
var rightIndex = rightVoronoi.children.length - 1;

function onMouseDrag (event) {

    var delta = event.downPoint - event.point;

    var itemClicked = project.getItems({

        match: function(itemClicked) {

            return itemClicked.contains(event.downPoint);

        }

    });

    // EFFECTS CONTROLS
    
    var leftGain = 0;
    var leftCurrentColored = leftVoronoi.getItems({
        match: function(item) {
            return item.fillColor == reverbColor;
        }
    });
    if (leftCurrentColored.length > 0) {leftGain = leftVoronoi.children.length - leftCurrentColored[0].index - 1;}
        
    reverbGain.gain.exponentialRampToValueAtTime(leftGain/(leftVoronoi.children.length-1) + 0.001, 0.1); //Math.log10(leftGain + 3.42) - 0.534

    var rightGain = 0;
    var rightCurrentColored = rightVoronoi.getItems({
        match: function(item) {
            return item.fillColor == delayColor;
        }
    });
    if  (rightCurrentColored.length > 0) {rightGain = rightVoronoi.children.length - rightCurrentColored[0].index - 1}

    delayGain.gain.exponentialRampToValueAtTime(rightGain/(leftVoronoi.children.length-1) + 0.001, 0.1) // Math.log10(rightGain + 3.42) - 0.534

    

    //LEFT MOUSE DRAG

    if (itemClicked[2] == leftVoronoi && itemClicked[itemClicked.length-1].type !== "circle" && delta.y > 0) {

        var leftVoronoiIndex = Math.round(leftIndex - delta.y/15);
        if (leftVoronoiIndex < 0) {leftVoronoiIndex = 0;} // security
        for (i = leftVoronoiIndex; i <= leftVoronoi.children.length-1; i++) {
            leftVoronoi.children[i].fillColor = reverbColor;
        }
            

        
        
    }
    if (itemClicked[2] == leftVoronoi && itemClicked[itemClicked.length-1].type !== "circle" && delta.y < 0) {

        var leftVoronoiIndex = Math.round(leftIndex - delta.y/15);
        if (leftVoronoiIndex < 0) {leftVoronoiIndex = 0;} else if (leftVoronoiIndex > leftVoronoi.children.length-1) {leftVoronoiIndex = leftVoronoi.children.length-1;} // security
        for (var i = leftIndex; i <= leftVoronoiIndex; i++) {
            leftVoronoi.children[i].fillColor = null;
        }
        
    }

    //RIGHT MOUSE DRAG

    if (itemClicked[2] == rightVoronoi && itemClicked[itemClicked.length-1].type !== "circle" && delta.y > 0) {

        var rightVoronoiIndex = Math.round(rightIndex - delta.y/15);
        if (rightVoronoiIndex < 0) {rightVoronoiIndex = 0;} // security
        for (var i = rightVoronoiIndex; i <= rightVoronoi.children.length-1; i++) {
            rightVoronoi.children[i].fillColor = delayColor;
        }

    }
    if (itemClicked[2] == rightVoronoi && itemClicked[itemClicked.length-1].type !== "circle" && delta.y < 0) {

        var rightVoronoiIndex = Math.round(rightIndex - delta.y/15);
        if (rightVoronoiIndex < 0) {rightVoronoiIndex = 0;} else if (rightVoronoiIndex > rightVoronoi.children.length-1) {rightVoronoiIndex = rightVoronoi.children.length-1;} // security
        for (var i = rightIndex; i <= rightVoronoiIndex; i++) {
            rightVoronoi.children[i].fillColor = null;
        }
    }

}

function onMouseUp (event) {

    var itemClicked = project.getItems({

        match: function(itemClicked) {

            return itemClicked.contains(event.downPoint);

        }

    });

    //LEFT MOUSE UP

    if (itemClicked[2] == leftVoronoi && itemClicked[itemClicked.length-1].type !== "circle") {

        var leftCurrentColored = leftVoronoi.getItems({
            match: function(item) {
                return item.fillColor == reverbColor;
            }
        });

        if (leftCurrentColored.length > 0) {

            leftIndex = leftCurrentColored[0].index;
            console.log("INDEX IS SET TO " + leftIndex);

        }
        else {
            leftIndex = leftVoronoi.children.length - 1;
            console.log("INDEX IS SET TO " + leftIndex);
        }

    }

    //RIGHT MOUSE UP

    if (itemClicked[2] == rightVoronoi && itemClicked[itemClicked.length-1].type !== "circle") {

        var rightCurrentColored = rightVoronoi.getItems({
            match: function(item) {
                return item.fillColor == delayColor;
            }
        });

        if (rightCurrentColored.length > 0) {

            rightIndex = rightCurrentColored[0].index;
            console.log("INDEX IS SET TO " + rightIndex);

        }
        else {
            rightIndex = rightVoronoi.children.length - 1;
            console.log("INDEX IS SET TO " + rightIndex);
        }

    }

}

document.addEventListener("drop", onDocumentDrop, false);
document.addEventListener("dragover", onDocumentDrag, false);
document.addEventListener("dragleave", onDocumentDrag, false);
leftUpload.addEventListener("change", leftFileUpload);
rightUpload.addEventListener("change", rightFileUpload);

var leftGainNodeDestination;
var rightGainNodeDestination;
var leftNodeBPM;
var rightNodeBPM;
var leftBeatPosition = [];
var rightBeatPosition = [];
var leftNodeStartTime;
var rightNodeStartTime;
var leftTransitionStartTime;
var rightTransitionStartTime;
var closestLeftNodeBeatTime;
var closestRightNodeBeatTime;
var closestLeftNodeBeatTimeB;
var closestRightNodeBeatTimeB;
var leftSourceState = "none";
var rightSourceState = "none";
var leftSourceTicks;
var rightSourceTicks;
var leftCount = 0;
var rightCount = 0;
var leftOrRight;
var leftTimeOfTransition;
var rightTimeOfTransition;
var leftTransitionFlag;
var rightTransitionFlag;
var isTransitionHappening = false;

function leftFileUpload(event) {

    if (leftUpload.files.length > 0) { // if file is uploaded and state is correct

        console.log(leftUpload.files[0]);
        var reader = new FileReader();

        reader.readAsArrayBuffer(leftUpload.files[0]);
        reader.onload = function () {

            audio.decodeAudioData(
                reader.result, 
                function(buffer) {
                        leftCount = 0;
                        leftSourceState = "loaded";
                        leftCircleIndicator.fillColor = "orange";
                        leftSource = audio.createBufferSource(); // create new
                        leftSource.connect(leftGainNode);
                        leftSource.buffer = buffer;
                        console.log(buffer);
                        leftSource.loop = false; //maybe?
                        leftSource.onended = function() {
                            leftSourceState = "ended";
                            leftCircleIndicator.fillColor.alpha = 1;
                            leftCircleIndicator.fillColor = "grey";
                            leftSource.stop();
                            console.log("oneEnded ran");
                        }
                        estimateBPM(leftSource);
                        if (rightSourceState == "none" || rightSourceState == "ended") {
                            leftGainNode.gain.value = 1;
                            rightGainNode.gain.value = 0;
                            leftSource.start();
                            delay.delayTime.value = 30 / Math.round(leftNodeBPM);
                            leftSourceState = "playing";
                            leftCircleIndicator.fillColor = "green";
                            leftOrRight = true;
                            leftNodeStartTime = audio.currentTime;
                            console.log(leftNodeStartTime + " left node start time");
                        }

                },
                function() {
                    alert("Error loading MP3");
                });
    
            console.log(reader.result);

        }

    }

}

function rightFileUpload(event) {

    if (rightUpload.files.length > 0) {

        console.log(rightUpload.files[0]);
        var reader = new FileReader();

        reader.readAsArrayBuffer(rightUpload.files[0]);
        reader.onload = function () {

            audio.decodeAudioData(
                reader.result, 
                function(buffer) {
                        rightCount = 0;
                        rightSourceState = "loaded";
                        rightCircleIndicator.fillColor = "orange";
                        rightSource = audio.createBufferSource();
                        rightSource.connect(rightGainNode);
                        rightSource.buffer = buffer;
                        console.log(buffer);
                        rightSource.loop = false; //maybe?
                        rightSource.onended = function() {
                            rightSourceState = "ended";
                            leftCircleIndicator.fillColor.alpha = 1;
                            rightCircleIndicator.fillColor = "grey";
                            rightSource.stop();
                            console.log("oneEnded ran");
                        }
                        estimateBPM(rightSource);
                        if (leftSourceState == "none" || leftSourceState == "ended") {
                            rightGainNode.gain.value = 1;
                            leftGainNode.gain.value = 0;
                            rightSource.start();

                            delay.delayTime.value = 30 / Math.round(rightNodeBPM);
                            rightSourceState = "playing";
                            rightCircleIndicator.fillColor = "green";
                            leftOrRight = false;
                            rightNodeStartTime = audio.currentTime;
                            console.log(rightNodeStartTime + " right node start time");
                        }

                },
                function() {
                    alert("Error loading MP3");
                });

            console.log(reader.result);
        }

    }

}

function onDocumentDrag(event) {

	event.preventDefault();

}

function onDocumentDrop(event) {

    event.preventDefault();

}

function estimateBPM(source) {

    var sourceFullEssentiaVector = essentia.arrayToVector(source.buffer.getChannelData(0));
    var rhythmVector = essentia.RhythmExtractor2013(sourceFullEssentiaVector, 208, "degara", 50);
    var ticksArray = essentia.vectorToArray(rhythmVector.ticks);
    var estimatesArray = essentia.vectorToArray(rhythmVector.estimates);
    var bpmIntervalsArray = essentia.vectorToArray(rhythmVector.bpmIntervals);
    console.log(ticksArray);
    console.log(estimatesArray);
    console.log(bpmIntervalsArray);
    console.log(rhythmVector.bpm);
    console.log(rhythmVector.confidence);

    if (source === leftSource) { //source.buffer == leftSource.buffer
        for (i = 3; i < ticksArray.length; i += 4) {
            leftBeatPosition[(i-3)/4] = ticksArray[i];
        }
        console.log(leftBeatPosition);
        if (rhythmVector.bpm > 90) {leftNodeBPM = rhythmVector.bpm;} else if (rhythmVector.bpm < 90) {leftNodeBPM = 2*rhythmVector.bpm;}
        leftSourceTicks = ticksArray;
    }
    else if (source === rightSource) {
        for (i = 3; i < ticksArray.length; i += 4) {
            rightBeatPosition[(i-3)/4] = ticksArray[i];
        }
        console.log(rightBeatPosition);
        if (rhythmVector.bpm > 90) {rightNodeBPM = rhythmVector.bpm;} else if (rhythmVector.bpm < 90) {rightNodeBPM = 2*rhythmVector.bpm;}
        rightSourceTicks = ticksArray;
    }
}

function loopBasedTransition(source, from, to) {
    console.log(from + " / " + to);
    console.log(source.buffer.getChannelData(0).slice(from*44100, to*44100));
    var vector = essentia.arrayToVector(source.buffer.getChannelData(0).slice(from*44100, to*44100));
    var loopBPM = essentia.RhythmExtractor2013(vector, 200, "multifeature", 65);
    console.log(loopBPM);
    return loopBPM;

}

function loadAudioBuffer(url, source) {
    // Load asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() { 
        audio.decodeAudioData(
            request.response,
            function(buffer) {
                source.buffer = buffer;
            },
            
            function(buffer) {
                alert("Error loading audio buffer");
            }
        );
    };
    request.send();
}

rightVoronoi.sendToBack();
topVoronoi.sendToBack();


var blackBackground = new Shape.Rectangle(view.bounds.topLeft, view.bounds.bottomRight);
blackBackground.fillColor = "white";

secondLayer.insertChild(0, blackBackground);
