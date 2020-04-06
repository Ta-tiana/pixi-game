// import * as PIXI from 'pixi.js';
import TWEEN from '@tweenjs/tween.js';
import * as PIXI from 'pixi.js-legacy';
import { alignCenter, setCoordinates, setScale, scaleCalculator } from './assets/scripts/helpers';

// Enable PixiJS devtools
window.PIXI = PIXI;

/*
 * Variables
 */

let assets;
let active;
let sickle;
let hay;
let milk;
let cows;
let barrels;
let smokes;
let finger;
let interval;
let activeTool;
let buttonsContainersArr = [];

/*
 * Application
 */

const app = new PIXI.Application({
  view: document.getElementById('canvas'),
  resolution: window.devicePixelRatio || 1,
  height: window.innerHeight,
  width: window.innerWidth,
  autoDensity: true,
  autoResize: true,
});

// App scale
const scale = scaleCalculator();

/*
 * Tween setup
 */

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
}

animate();

/*
 * Sounds
 */

const mainTheme = new Audio('src/assets/sounds/maintheme.mp3');
const endOfGame = new Audio('src/assets/sounds/end_card.mp3');
const fail = new Audio('src/assets/sounds/fail.mp3');
const success = new Audio('src/assets/sounds/success.mp3');

mainTheme.loop = true;
mainTheme.play();

/*
 * Stages
 */

const backgroundStage = new PIXI.Container();
const gardenStage = new PIXI.Container();
const toolbarStage = new PIXI.Container();
const milkHouseStage = new PIXI.Container();
const cowsStage = new PIXI.Container();
const endCardStage = new PIXI.Container();
const endCard = new PIXI.Container();
const advertisingStage = new PIXI.Container();
const crossStage = new PIXI.Container();
const barrelStage = new PIXI.Container();
const smokeStage = new PIXI.Container();
const fingerStage = new PIXI.Container();

// Move stages to the center
alignCenter(backgroundStage, app.screen);
alignCenter(gardenStage, app.screen);
alignCenter(milkHouseStage, app.screen);
alignCenter(cowsStage, app.screen);
alignCenter(endCardStage, app.screen);
alignCenter(crossStage, app.screen);
alignCenter(fingerStage, app.screen);

// Set scale
setScale(backgroundStage, scale);
setScale(gardenStage, scale);
setScale(milkHouseStage, scale);
setScale(cowsStage, scale);
setScale(toolbarStage, scale * 0.8);
setScale(endCardStage, 0);
setScale(crossStage, 0);
setScale(barrelStage, scale);
setScale(smokeStage, scale);
setScale(fingerStage, scale);

// Consider z-indexes
gardenStage.sortableChildren = true;
toolbarStage.sortableChildren = true;
app.stage.sortableChildren = true;
crossStage.sortableChildren = true;
barrelStage.sortableChildren = true;
smokeStage.sortableChildren = true;
fingerStage.sortableChildren = true;

gardenStage.zIndex = 1;
cowsStage.zIndex = 1;
endCardStage.zIndex = 12;
crossStage.zIndex = 14;
barrelStage.zIndex = 10;
smokeStage.zIndex = 10;
fingerStage.zIndex = 10;
barrelStage.alpha = 0;
smokeStage.alpha = 0;
fingerStage.alpha = 1;

// Append stages to the app
app.stage.addChild(backgroundStage);
app.stage.addChild(gardenStage);
app.stage.addChild(toolbarStage);
app.stage.addChild(milkHouseStage);
app.stage.addChild(cowsStage);
app.stage.addChild(advertisingStage);
app.stage.addChild(crossStage);
app.stage.addChild(fingerStage);

/*
 * Tool handlers
 */

function getStage({ name }) {
  let stage;

  switch (name) {
    case 'sickle': stage = gardenStage; break;
    case 'hay': stage = cowsStage; break;
    case 'milk': stage = milkHouseStage; break;
    default: stage = null; break;
  }

  return stage;
}

function checkToolTarget(stage, { x, y }) {
  const { left, right, top, bottom } = stage.getBounds();
  return x > left && x < right && y > top && y < bottom;
}

function addTool(containersArray, index, tool) {
  activeTool = tool;
  containersArray[index].addChild(tool);
}

function addActiveButton(containersButton, containerId, childrenId) {
  containersButton[containerId].children[childrenId].texture = active.texture;
  containersButton[containerId].children[1].alpha = 0;
}

function addMark(containersButton, id) {
  const mark = PIXI.Sprite.from(assets.tool_used);

  mark.anchor.set(0.5);
  containersButton[id].addChild(mark);
}

function endGame() {
  // TODO change texture for milkhouse
  // TODO endcard

  advertisingStage.alpha = 0;
  toolbarStage.alpha = 0;

  const shadowTop = PIXI.Sprite.from(assets.shadow);
  const shadowBottom = PIXI.Sprite.from(assets.shadow);
  const logo = PIXI.Sprite.from(assets.logo);
  const circle = PIXI.Sprite.from(assets.shape288);
  const cheese = PIXI.Sprite.from(assets.cheese);
  const cardBackground = PIXI.Sprite.from(assets.success_background);
  const button = PIXI.Sprite.from(assets.button_green);
  const buttonText = new PIXI.Text('Установить', {
    fontFamily: 'Times New Roman',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#000000'],
    stroke: '#ffffff',
    strokeThickness: 3,
  });

  const goodJobText = new PIXI.Text('Отличная работа!', {
    fontFamily: 'Times New Roman',
    fontSize: 32,
    fontWeight: 'bold',
    fill: ['#6f5c2d'],
  });

  const installText = new PIXI.Text('Установите,', {
    fontFamily: 'Times New Roman',
    fontSize: 28,
    fontWeight: 'normal',
    fill: ['#6f5c2d'],
  });

  const continueText = new PIXI.Text('чтобы продолжить!', {
    fontFamily: 'Times New Roman',
    fontSize: 28,
    fontWeight: 'normal',
    fill: ['#6f5c2d'],
  });

  button.addChild(buttonText);

  setCoordinates(logo, 0, 0);

  shadowTop.alpha = 0;
  shadowBottom.alpha = 0;

  cardBackground.anchor.set(0.5);
  shadowTop.anchor.set(0.5);
  shadowBottom.anchor.set(0.5);
  buttonText.anchor.set(0.5);
  goodJobText.anchor.set(0.5);
  installText.anchor.set(0.5);
  continueText.anchor.set(0.5);
  logo.anchor.set(0.5);
  circle.anchor.set(0.5);
  button.anchor.set(0.5);
  cheese.anchor.set(0.5);

  button.interactive = true;
  button.buttonMode = true;

  setScale(cheese, 0.8);
  setScale(button, 0.8);
  setScale(logo, 0.8);

  setScale(shadowTop, 100);
  setScale(shadowBottom, 100);
  setScale(cardBackground, 1.3);
  setScale(logo, 0.55);
  setScale(button, 0.8);

  logo.scale.x = 0.75;

  setCoordinates(cheese, 0, -15);
  setCoordinates(logo, 0, -152);
  setCoordinates(button, 0, 145);
  setCoordinates(goodJobText, 0, -95);
  setCoordinates(installText, 0, 65);
  setCoordinates(continueText, 0, 95);

  cardBackground.angle = 90;

  endCardStage.addChild(shadowTop);
  endCardStage.addChild(shadowBottom);
  endCard.addChild(circle, cardBackground, logo, cheese,
    button, goodJobText, installText, continueText);

  endCardStage.addChild(endCard);
  app.stage.addChild(endCardStage);

  const increaseShadowTop = new TWEEN.Tween(shadowTop)
    .to({ alpha: 1 }, 500)
    .easing(TWEEN.Easing.Linear.None);

  const increaseShadowBottom = new TWEEN.Tween(shadowBottom)
    .to({ alpha: 1 }, 500)
    .easing(TWEEN.Easing.Linear.None);

  const scaleEndCardStage = new TWEEN.Tween(endCardStage.scale)
    .to({ x: 1.5, y: 1.5 }, 1000)
    .easing(TWEEN.Easing.Linear.None);

  increaseShadowTop
    .chain(increaseShadowBottom)
    .onComplete(() => {
      scaleEndCardStage.start();
      buttonAnimation(button, 0.85, 0.85, 0.8, 0.8); // eslint-disable-line no-use-before-define
    });

  increaseShadowTop.start();
}

/*
 * Animations
 */

function buttonAnimation(button, increaseX, increaseY, decreaseX, decreaseY) {
  const increaseScale = new TWEEN.Tween(button.scale)
    .to({ x: increaseX, y: increaseY }, 1000)
    .easing(TWEEN.Easing.Linear.None);

  const decreaseScale = new TWEEN.Tween(button.scale)
    .to({ x: decreaseX, y: decreaseY }, 2000)
    .easing(TWEEN.Easing.Linear.None);

  increaseScale.chain(decreaseScale);
  decreaseScale.chain(increaseScale);
  increaseScale.start();
}

function resourceAnimation(x1, y1, z1, currentId, nextId, tool) {
  let sprites = [];
  let nextTool;

  if (tool === 'sickle') {
    nextTool = hay;

    sprites = gardenStage.children
      .slice(-6)
      .reverse();
  }

  if (tool === 'hay') {
    nextTool = milk;

    sprites = cowsStage.children
      .filter((item, i) => i % 2)
      .map((item) => {
        item.alpha = 1;

        return item;
      });
  }

  addMark(buttonsContainersArr, currentId);

  sprites.map((item, i) => {
    setTimeout(() => {
      const { x, y } = item;

      if (tool === 'sickle') {
        item.texture = assets.resource_1;
      }

      const from = new TWEEN.Tween(item.position)
        .to({ x, y: y - 80, z: 0 }, 800)
        .easing(TWEEN.Easing.Quadratic.Out);

      const toButton = new TWEEN.Tween(item.position)
        .to({ x: x1, y: y1, z: z1 }, 800)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onComplete(() => {
          item.parent.removeChild(item);

          if (i === 1) {
            setTimeout(() => {
              addTool(buttonsContainersArr, nextId, nextTool);
            }, 300);
          }
        });

      from.chain(toButton);
      from.start();
    }, i * 50);

    return item;
  });

  addActiveButton(buttonsContainersArr, nextId, 0);
}

function milkHouseAnimation() {
  barrelStage.alpha = 1;
  smokeStage.alpha = 1;
  addMark(buttonsContainersArr, 2);

  setTimeout(() => {
    endGame();
  }, 1000);
}

function crossAnimation({ x, y }, tool, toolParent) {
  const crossBackground = PIXI.Sprite.from(assets.ellipse_1);
  const cross = PIXI.Sprite.from(assets.x);
  const { id } = tool;

  crossBackground.anchor.set(0.5);
  cross.anchor.set(0.5);
  tool.anchor.set(0.5);

  toolParent.zIndex = 0;
  toolbarStage.zIndex = 0;

  crossStage.addChild(crossBackground, cross);

  setCoordinates(crossStage, x, y);

  const scaleCross = new TWEEN.Tween(crossStage.scale)
    .to({ x: 1.5, y: 1.5 }, 500)
    .easing(TWEEN.Easing.Linear.None);

  const removeScaleCross = new TWEEN.Tween(crossStage.scale)
    .to({ x: 0, y: 0 }, 800)
    .easing(TWEEN.Easing.Linear.None);

  scaleCross
    .chain(removeScaleCross)
    .onComplete(() => {
      if (id === 0) {
        setCoordinates(tool, 0, 0);
      } else if (id === 1) {
        setCoordinates(tool, 0, 0);
      } else if (id === 2) {
        setCoordinates(tool, 0, 0);
      }

      app.stage.addChild(tool);

      tool.zIndex = 15;
      app.stage.zIndex = 0;
      crossStage.zIndex = 18;
      addTool(buttonsContainersArr, id, tool);
      buttonsContainersArr.forEach((container) => { container.children.zIndex = 0; });
    });


  scaleCross.start();
}

function startAnimation(tool) {
  const { name } = tool;

  tool.parent.removeChild(tool);

  switch (name) {
    case 'sickle': resourceAnimation(0, 263, 60, 0, 1, name); break;
    case 'hay': resourceAnimation(118, 239, 0, 1, 2, name); break;
    case 'milk': endOfGame.play(); milkHouseAnimation(); break;
    default: return null;
  }
}

function fingerAnimation(tool) {
  const { id } = tool;

  let coords = {};

  if (id === 0) {
    coords = { x: -60, y: 290, x1: -110, y1: 50 };

    finger.x = -60;
    finger.y = 290;
  }

  if (id === 1) {
    coords = { x: -55, y: 265, x1: 250, y1: 70 };

    finger.x = 55;
    finger.y = 265;
  }

  if (id === 2) {
    coords = { x: 175, y: 265, x1: 50, y1: -150 };

    finger.x = 175;
    finger.y = 265;
  }

  finger.alpha = 1;

  const fingerMoveFrom = new TWEEN.Tween(finger.position)
    .to({ x: coords.x, y: coords.y }, 1000)
    .easing(TWEEN.Easing.Linear.None);

  const fingerMoveTo = new TWEEN.Tween(finger.position)
    .to({ x: coords.x1, y: coords.y1 }, 1000)
    .repeat(2)
    .easing(TWEEN.Easing.Linear.None);

  const stopFinger = new TWEEN.Tween(finger)
    .to({ alpha: 0 }, 500)
    .easing(TWEEN.Easing.Linear.None);

  fingerMoveTo
    .chain(fingerMoveFrom)
    .chain(stopFinger);

  fingerMoveTo.start();
}

/*
 * Event handlers
 */

function autoHelp() {
  const delay = 4;

  let time = 0;

  interval = setInterval(() => {
    time += 1;

    if (time === delay) {
      fingerAnimation(activeTool);
      clearInterval(interval);
    }
  }, 1000);
}

// function isUserActive(toolType) {
//   const tool = toolType;
//   const delay = 4;
//
//   let notActiveTime = 0;
//
//   function setActive() {
//     notActiveTime = 0;
//   }
//
//   const interval = setInterval(() => {
//     notActiveTime += 1;
//
//     document.onmousemove = setActive;
//
//     if (notActiveTime >= delay) {
//       fingerAnimation(tool);
//       clearInterval(interval);
//     }
//     console.log(notActiveTime);
//   }, 1000);
// }

function onDragStart(event) {
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  this.parent.zIndex = 8;

  toolbarStage.zIndex = 2;

  clearInterval(interval);
}

function onDragEnd() {
  const stage = getStage(this);
  const { parent } = this;

  parent.zIndex = 0;

  if (checkToolTarget(stage, this.data.global)) {
    startAnimation(this);
    success.play();
  } else {
    crossAnimation(this.data.global, this, parent);
    parent.removeChild(this);
    fail.play();
  }

  this.alpha = 1;
  this.dragging = false;
  this.data = null;

  toolbarStage.zIndex = 0;

  autoHelp();
}

function onDragMove() {
  if (!this.dragging) return null;

  const newPosition = this.data.getLocalPosition(this.parent);

  this.x = newPosition.x;
  this.y = newPosition.y;
}

function eventAdder(object) {
  object
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
}

/*
 * Atlases, sprites
 */

function gardenSetup(textures) {
  // Beds, wheat coordinates
  const gardenCoordinates = [
    { x: -140, y: 30 },
    { x: -80, y: 55 },
    { x: -200, y: 60 },
    { x: -140, y: 85 },
    { x: -260, y: 85 },
    { x: -200, y: 115 },
  ];

  // Garden beds and wheat  x6
  gardenCoordinates.forEach(({ x, y }) => {
    const gardenBed = PIXI.Sprite.from(textures.gardenbed);
    const wheat = PIXI.Sprite.from(textures.wheat_1);

    gardenBed.anchor.set(0.5);
    wheat.anchor.set(0.5, 0.75);

    gardenBed.zIndex = 0;
    wheat.zIndex = 1;

    setCoordinates(gardenBed, x, y);
    setCoordinates(wheat, x, y);

    gardenStage.addChild(gardenBed);
    gardenStage.addChild(wheat);
  });
}

function toolbarSetup(textures) {
  // Buttons, containers coordinates
  const toolbarBackground = PIXI.Sprite.from(textures.tools_background);
  const inactiveCoordinates = [
    { x: 152, y: 0 },
    { x: 0, y: 0 },
    { x: -152, y: 0 },
  ];

  toolbarBackground.anchor.set(0.5);
  toolbarStage.x = app.screen.width * 0.5;
  toolbarStage.y = app.screen.height * 0.85;

  toolbarStage.addChild(toolbarBackground);

  active = PIXI.Sprite.from(textures.tool_active_base);
  active.anchor.set(0.5);

  inactiveCoordinates.forEach(({ x, y }) => {
    const buttonContainer = new PIXI.Container();
    const inactive = PIXI.Sprite.from(textures.tool_inactive_base);
    const questionMark = PIXI.Sprite.from(textures.questionmark);

    buttonsContainersArr.push(buttonContainer);
    buttonContainer.zIndex = 0;

    inactive.anchor.set(0.5);
    questionMark.anchor.set(0.5);

    setCoordinates(buttonContainer, x, y);

    buttonContainer.addChild(inactive);
    buttonContainer.addChild(questionMark);
    toolbarStage.addChild(buttonContainer);
  });

  buttonsContainersArr = buttonsContainersArr.reverse();

  sickle = PIXI.Sprite.from(textures.tool_1);
  hay = PIXI.Sprite.from(assets.tool_2);
  milk = PIXI.Sprite.from(assets.tool_3);

  activeTool = sickle;

  sickle.name = 'sickle';
  sickle.anchor.set(0.5);
  sickle.interactive = true;
  sickle.id = 0;

  hay.name = 'hay';
  hay.anchor.set(0.5);
  hay.interactive = true;
  hay.id = 1;

  milk.anchor.set(0.5);
  milk.interactive = true;
  milk.name = 'milk';
  milk.id = 2;

  eventAdder(sickle);
  eventAdder(hay);
  eventAdder(milk);

  addActiveButton(buttonsContainersArr, 0, 0);
  addTool(buttonsContainersArr, 0, sickle);
}

function milkHouseSetup(textures) {
  const milkHouse = PIXI.Sprite.from(textures.milkman);

  milkHouse.name = 'milkHouse';
  milkHouse.anchor.set(0.5);

  setCoordinates(milkHouse, -10, -180);

  milkHouseStage.addChild(milkHouse);
}

function cowsSetup(textures, cowsTextures) {
  const cowsCoordinates = [
    { x: 100, y: 65 },
    { x: 195, y: -15 },
    { x: 270, y: 60 },
  ];

  const { length } = Object.keys(cowsTextures);
  const frames = [];

  for (let i = 0; i < length; i += 1) {
    frames.push(cowsTextures[`cow${i}`]);
  }

  cowsCoordinates.forEach(({ x, y }, i) => {
    const cow = new PIXI.AnimatedSprite(frames);
    const milkJug = PIXI.Sprite.from(textures.resource_2);

    setCoordinates(cow, x, y);
    setCoordinates(milkJug, x, y);

    milkJug.anchor.set(0.5);
    milkJug.alpha = 0;

    cow.name = `cow${i}`;
    cow.anchor.set(0.5);
    cow.animationSpeed = (i + 1) * 0.01;
    cow.play();

    if (cow.name !== 'cow0') cow.scale.x *= -1;

    cowsStage.addChild(cow);
    cowsStage.addChild(milkJug);
  });
}

function advertisingSetup(textures) {
  const logo = PIXI.Sprite.from(textures.logo);
  const button = PIXI.Sprite.from(assets.button_green);
  const buttonText = new PIXI.Text('Установить', {
    fontFamily: 'Times New Roman',
    fontSize: 36,
    fontWeight: 'bold',
    fill: ['#000000'],
    stroke: '#ffffff',
    strokeThickness: 3,
  });

  buttonText.anchor.set(0.5);
  button.addChild(buttonText);

  setCoordinates(logo, 0, 0);
  setCoordinates(button, 0, app.screen.height - 75);
  setCoordinates(buttonText, button.width / 2, button.height / 2);

  advertisingStage.addChild(logo);
  advertisingStage.addChild(button);

  buttonAnimation(button, 1.05, 1.05, 1, 1);
}

function barrelSetup(barrelTextures) {
  const barrelCoordinates = [
    { x: -3, y: -132 },
  ];

  const { length } = Object.keys(barrelTextures);
  const frames = [];

  for (let i = 0; i < length; i += 1) {
    frames.push(barrelTextures[`barrel${i}`]);
  }

  barrelCoordinates.forEach(({ x, y }, i) => {
    const barrel = new PIXI.AnimatedSprite(frames);

    setCoordinates(barrel, x, y);

    barrel.name = `barrel${i}`;
    barrel.anchor.set(0.5);
    barrel.animationSpeed = 0.2;
    barrel.play();

    barrelStage.addChild(barrel);
    milkHouseStage.addChild(barrelStage);
  });
}

function smokeSetup(smokeTextures) {
  const smokeCoordinates = [
    { x: 22, y: -278 },
  ];

  const { length } = Object.keys(smokeTextures);
  const frames = [];

  for (let i = 0; i < length; i += 1) {
    frames.push(smokeTextures[`smoke${i}`]);
  }

  smokeCoordinates.forEach(({ x, y }, index) => {
    const smoke = new PIXI.AnimatedSprite(frames);

    setCoordinates(smoke, x, y);

    smoke.anchor.set(0.5);
    smoke.name = `barrel${index}`;
    smoke.animationSpeed = 0.2;
    smoke.play();

    smokeStage.addChild(smoke);
    milkHouseStage.addChild(smokeStage);
  });
}

function fingerSetup(textures) {
  finger = PIXI.Sprite.from(textures.finger);
  finger.name = 'finger';
  finger.anchor.set(0.5);
  finger.alpha = 0;

  fingerStage.addChild(finger);
}

const appBackground = PIXI.Sprite.from('./src/assets/image/game_scene_background.png');

appBackground.anchor.set(0.5, 0.525);
backgroundStage.addChild(appBackground);

app.loader
  .add(
    [
      { name: 'assets', url: 'src/assets/spritesheets/assets.json' },
      { name: 'cows', url: 'src/assets/animations/cows.json' },
      { name: 'barrel', url: 'src/assets/animations/barrel.json' },
      { name: 'smoke', url: 'src/assets/animations/smoke.json' },
    ],
  )
  .load((loader) => {
    assets = loader.resources.assets.textures;
    cows = loader.resources.cows.textures;
    barrels = loader.resources.barrel.textures;
    smokes = loader.resources.smoke.textures;

    gardenSetup(assets);
    toolbarSetup(assets);
    milkHouseSetup(assets);
    cowsSetup(assets, cows);
    advertisingSetup(assets);
    barrelSetup(barrels);
    smokeSetup(smokes);
    fingerSetup(assets);
  });

autoHelp();
