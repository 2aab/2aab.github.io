import {generateL1Voronoi} from "./vornoiScript.js";

const SquareRes = 500;

const pointsLocationX = [];
const pointsLocationY = [];

const PointsXY = [];

var voronoiPolygons = [];

var currentPolygonX;
var currentPolygonY;
var lastPolygonX;
var lastPolygonY;

var seed;

const myUrl = new URL(window.location.href);

var myParams = myUrl.searchParams.get("i");

if (myParams == null || myParams.length < 4 || Array.from(myUrl.searchParams).length > 1) {

    Array.from(myUrl.searchParams).forEach(element => myUrl.searchParams.delete(element[0])); // delete all current searchParams
    myUrl.searchParams.set("i", Math.random().toString(36).slice(2)) //generate random 11 long string and set as new searchParam
    window.location.replace(myUrl); //redirect to new URL with random searchParam

}
else {
    seed = myParams;
}

function reloadPageWithSeed(seed) {

    Array.from(myUrl.searchParams).forEach(element => myUrl.searchParams.delete(element[0]));
    myUrl.searchParams.set("i", seed);
    window.location.replace(myUrl);

}

var hash = xmur3(seed);
var rand = mulberry32(hash());

var cycleNumber = 0;

var numberOfPoints = 5;

for (let i = 0; i<numberOfPoints; i++) {
    
    if (cycleNumber == 0) { // cycles each point to one section of a pedal spawn

        pointsLocationX[i] = getRndInteger(SquareRes*0.5,SquareRes*0.5); //(250,250) CENTER SquareRes*0.5,SquareRes*0.5
        pointsLocationY[i] = getRndInteger(SquareRes*0.5,SquareRes*0.5); //(250,250) CENTER SquareRes*0.5,SquareRes*0.5
        cycleNumber++;

    }
    else if (cycleNumber == 1) {

        pointsLocationX[i] = getRndInteger(SquareRes*0.25, SquareRes*0.35); //125, 175 LEFT SquareRes*0.25, SquareRes*0.35
        pointsLocationY[i] = getRndInteger(SquareRes*0.35, SquareRes*0.45); //225, 275 MIDDLE SquareRes*0.45, SquareRes*0.55
        cycleNumber++;
    }
    else if (cycleNumber == 2){

        pointsLocationX[i] = getRndInteger(SquareRes*0.45, SquareRes*0.55); //225, 275 MIDDLE SquareRes*0.45, SquareRes*0.55
        pointsLocationY[i] = getRndInteger(SquareRes*0.65, SquareRes*0.75); //325, 375 BOTTOM SquareRes*0.65, SquareRes*0.75
        cycleNumber++;
    }
    else if (cycleNumber == 3){

        pointsLocationX[i] = getRndInteger(SquareRes*0.65, SquareRes*0.75); //325, 375 RIGHT SquareRes*0.65, SquareRes*0.75
        pointsLocationY[i] = getRndInteger(SquareRes*0.35, SquareRes*0.45); //225, 275 MIDDLE SquareRes*0.45, SquareRes*0.55
        cycleNumber++;
    }
    else if (cycleNumber == 4){

        pointsLocationX[i] = getRndInteger(SquareRes*0.45, SquareRes*0.55); //225, 275 MIDDLE SquareRes*0.45, SquareRes*0.55
        pointsLocationY[i] = getRndInteger(SquareRes*0.25, SquareRes*0.35); //125, 175 TOP SquareRes*0.25, SquareRes*0.35

        cycleNumber = Math.floor(Math.random() * (4 - 1) + 1); // try to randomize next point if more than 5
    }
    
    // console.log(pointsLocationX[i] + " x " + pointsLocationY[i] + " y ");    //debug only

    PointsXY[i] = [pointsLocationX[i],pointsLocationY[i]]; // create Array in [x,y] form from the individual x and y arrays

}

var L1Voronoi = generateL1Voronoi(PointsXY, SquareRes, SquareRes); //Generate the Object with Vornoi coordinates

console.log(L1Voronoi);

window.globals = { a:L1Voronoi, b:numberOfPoints, c:myParams, d:reloadPageWithSeed };

function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353),
        h = h << 13 | h >>> 19;
    return function() {
        h = Math.imul(h ^ h >>> 16, 2246822507);
        h = Math.imul(h ^ h >>> 13, 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

function getRndInteger(min, max) {

    return rand() * (max - min) + min; // Generate Random Floating Point

}

export {numberOfPoints, L1Voronoi, myParams};