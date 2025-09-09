let drones = [];    
let bgDrones = [];  
let words = ["Drone.  by KD. "];
let wordPoints = [];
let currentWordIndex = 0;
let showWords = false;
let sampleStep = 6; // fewer points, faster

let imgPointsTree = []; 
let imgPointsEthiopia = [], imgPointsOromia = [], imgPointsAfrica = [];

let fireColors, bgColors;

function setup() {
  createCanvas(1400, 700);
  frameRate(60);
  colorMode(HSB, 360, 100, 100, 255);
  textFont('Georgia');

  fireColors = [color(20,100,100,220), color(40,100,100,220), color(60,100,100,200), color(30,80,90,180)];
  bgColors = [color(120,70,80,200), color(100,60,70,200), color(30,80,90,200)];

  prepareTreeShape(imgPointsTree);
  prepareEthiopiaMap(imgPointsEthiopia);
  prepareOromiaFlag(imgPointsOromia);
  prepareAfricaMap(imgPointsAfrica);

  // Prepare word points
  for (let w of words) {
    let size = 200; 
    let gfx = createGraphics(width, height);
    gfx.background(255);
    gfx.fill(0);
    gfx.textSize(size);
    gfx.textAlign(CENTER, CENTER);
    gfx.text(w, width/2, height/2);
    gfx.loadPixels();

    let pts = [];
    for (let py=0; py<gfx.height; py+=sampleStep) {
      for (let px=0; px<gfx.width; px+=sampleStep) {
        let idx = 4*(py*gfx.width+px);
        let r = gfx.pixels[idx], g = gfx.pixels[idx+1], b = gfx.pixels[idx+2];
        if ((r+g+b)/3 < 200) pts.push({x:px, y:py});
      }
    }
    wordPoints.push(pts);
  }

 // Spawn word drones (increased numbers)
let wordColors = [color(0,0,0), color(4,1,10), color(2,100,100)];
for (let i=0; i<wordPoints[0].length; i++) {
  let target = wordPoints[0][i];
  let dronesPerPoint = 30; // spawn 3 drones per point for higher density
  for (let j = 0; j < dronesPerPoint; j++) {
    drones.push({
      x: random(width),
      y: random(height),
      targetX: target.x,
      targetY: target.y,
      speedFactor: random(0.02, 0.6),
      c: random(wordColors),
      size: random(3,2)
    });
  }
}


  // Background drones
  let centerX = 700, centerY=300, radius=150;
  for (let i=0; i<imgPointsTree.length*5; i++) {
    let target = imgPointsTree[i % imgPointsTree.length];
    let isCrest = dist(target.x,target.y,centerX,centerY)<radius;
    bgDrones.push({
      x: random(width), y: random(height),
      targetX: target.x, targetY: target.y,
      offsetX: random(5,20), offsetY: random(50,50),
      speedFactor: random(0.03,1),
      c: isCrest ? random(fireColors) : random(bgColors),
      size: isCrest ? random(5,2) : random(2,4),
      isCrest
    });
  }

  assignImageTargets(imgPointsEthiopia);
  setTimeout(()=>assignImageTargets(imgPointsOromia), 2000);
  setTimeout(()=>assignImageTargets(imgPointsAfrica), 4000);
  setTimeout(()=>{
    showWords=true;
    assignTargets(wordPoints[currentWordIndex]);
  },6000);
}

function draw() {
  background(0);

  // Background drones
  for (let d of bgDrones) {
    let swirlX = sin(frameCount*0.05 + d.x*0.02)*d.offsetX;
    let swirlY = cos(frameCount*0.05 + d.y*0.02)*d.offsetY;
    let dx = d.targetX+swirlX;
    let dy = d.targetY+swirlY;
    if(d.isCrest){
      dy -= noise(d.x*0.01, frameCount*0.02)*20;
      dx += sin(frameCount*0.1+d.y*0.05)*5;
      let h=(hue(d.c)+frameCount*1.2)%360;
      d.c=color(h,100,100,200);
    }
    d.x += (dx-d.x)*d.speedFactor;
    d.y += (dy-d.y)*d.speedFactor;
    fill(d.c); noStroke();
    ellipse(d.x,d.y,d.size,d.size);
  }

  // Word drones
  for (let d of drones) {
    let dx = d.targetX + random(-5,5);
    let dy = d.targetY + random(-5,5);
    d.x += (dx - d.x) * d.speedFactor;
    d.y += (dy - d.y) * d.speedFactor;
    fill(d.c); noStroke();
    ellipse(d.x,d.y,d.size,d.size);
  }
}

function assignTargets(points){
  for(let i=0;i<drones.length;i++){
    let p=points[i%points.length];
    drones[i].targetX=p.x;
    drones[i].targetY=p.y;
    drones[i].speedFactor=random(0.3,0.7);
  }
}

function assignImageTargets(pointsArray){
  for(let i=0;i<drones.length;i++){
    let p=pointsArray[i%pointsArray.length];
    drones[i].targetX=p.x;
    drones[i].targetY=p.y;
    drones[i].speedFactor=random(1,0.7);
  }
}

// Procedural shapes
function prepareTreeShape(pointsArray){
  for(let y=400;y<=600;y+=sampleStep) for(let x=650;x<=750;x+=sampleStep) pointsArray.push({x,y});
  let cx=700,cy=300,r=150;
  for(let y=cy-r;y<=cy+r;y+=sampleStep) for(let x=cx-r;x<=cx+r;x+=sampleStep) if(dist(x,y,cx,cy)<=r) pointsArray.push({x,y});
}
function prepareEthiopiaMap(pointsArray){
  let coords=[{x:50,y:100},{x:550,y:150},{x:580,y:200},{x:600,y:250},{x:580,y:300},{x:560,y:350},{x:520,y:380},{x:480,y:370},{x:450,y:350},{x:420,y:300},{x:430,y:250},{x:450,y:200},{x:480,y:150}];
  for(let y=100;y<=380;y+=sampleStep) for(let x=420;x<=600;x+=sampleStep) if(pointInPolygon({x,y},coords)) pointsArray.push({x,y});
}
function prepareOromiaFlag(pointsArray){for(let y=150;y<=350;y+=sampleStep) for(let x=650;x<=950;x+=sampleStep) pointsArray.push({x,y});}
function prepareAfricaMap(pointsArray){let coords=[{x:100,y:100},{x:300,y:120},{x:350,y:200},{x:320,y:350},{x:280,y:400},{x:200,y:380},{x:150,y:300},{x:120,y:200}];for(let y=100;y<=400;y+=sampleStep) for(let x=100;x<=350;x+=sampleStep) if(pointInPolygon({x,y},coords)) pointsArray.push({x,y});}
function pointInPolygon(point, vs){let x=point.x,y=point.y,inside=false;for(let i=0,j=vs.length-1;i<vs.length;j=i++){let xi=vs[i].x,yi=vs[i].y;xj=vs[j].x,yj=vs[j].y;let intersect=((yi>y)!=(yj>y))&&(x<(xj-xi)*(y-yi)/(yj-yi)+xi);if(intersect) inside=!inside;}return inside;}
