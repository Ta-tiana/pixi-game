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

// Move stages to the center
alignCenter(backgroundStage, app.screen);
alignCenter(gardenStage, app.screen);
alignCenter(milkHouseStage, app.screen);
alignCenter(cowsStage, app.screen);
alignCenter(endCardStage, app.screen);

// Set scale
setScale(backgroundStage, scale);
setScale(gardenStage, scale);
setScale(milkHouseStage, scale);
setScale(cowsStage, scale);
setScale(toolbarStage, scale * 0.8);
setScale(endCardStage, 0);

// Consider z-indexes
gardenStage.sortableChildren = true;
toolbarStage.sortableChildren = true;
app.stage.sortableChildren = true;

gardenStage.zIndex = 1;
cowsStage.zIndex = 1;
endCardStage.zIndex = 12;

// Append stages to the app
app.stage.addChild(backgroundStage);
app.stage.addChild(gardenStage);
app.stage.addChild(toolbarStage);
app.stage.addChild(milkHouseStage);
app.stage.addChild(cowsStage);
app.stage.addChild(advertisingStage);

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
  containersArray[index].addChild(tool);
}

function addActiveButton(containersButton, containerId, childrenId) {
  containersButton[containerId].children[childrenId].texture = active.texture;
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

  button.addChild(buttonText);

  setCoordinates(logo, 0, 0);

  shadowTop.alpha = 0;
  shadowBottom.alpha = 0;

  cardBackground.anchor.set(0.5);
  shadowTop.anchor.set(0.5);
  shadowBottom.anchor.set(0.5);
  buttonText.anchor.set(0.5);
  logo.anchor.set(0.5);
  circle.anchor.set(0.5);
  button.anchor.set(0.5);
  cheese.anchor.set(0.5);

  button.interactive = true;
  button.buttonMode = true;

  setScale(shadowTop, 100);
  setScale(shadowBottom, 100);

  endCardStage.addChild(shadowTop);
  endCardStage.addChild(shadowBottom);
  endCard.addChild(circle, cardBackground, logo, cheese, button);

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
      buttonAnimation(button); // eslint-disable-line no-use-before-define
    });

  increaseShadowTop.start();
}

/*
 * Animations
 */

function buttonAnimation(button) {
  const increaseScale = new TWEEN.Tween(button.scale)
    .to({ x: 1.05, y: 1.05 }, 1000)
    .easing(TWEEN.Easing.Linear.None);

  const decreaseScale = new TWEEN.Tween(button.scale)
    .to({ x: 1, y: 1 }, 2000)
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
        .to({ x, y: y - 20, z: 0 }, 1500)
        .easing(TWEEN.Easing.Quadratic.Out);

      const toButton = new TWEEN.Tween(item.position)
        .to({ x: x1, y: y1, z: z1 }, 1500)
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

function crossAnimation() {
  // const { name } = tool;
  // tool.parent.removeChild(tool);
}

function startAnimation(tool) {
  const { name } = tool;

  tool.parent.removeChild(tool);

  switch (name) {
    case 'sickle': resourceAnimation(0, 263, 60, 0, 1, name); break;
    case 'hay': resourceAnimation(118, 239, 0, 1, 2, name); break;
    case 'milk': endOfGame.play(); endGame(); break;
    default: return null;
  }
}


/*
 * Event handlers
 */

function onDragStart(event) {
  this.data = event.data;
  this.alpha = 0.5;
  this.dragging = true;
  this.parent.zIndex = 8;

  toolbarStage.zIndex = 2;
}

function onDragEnd() {
  const stage = getStage(this);

  this.parent.zIndex = 0;

  if (checkToolTarget(stage, this.data.global)) {
    startAnimation(this);
    success.play();
  } else {
    crossAnimation(this);
    fail.play();
  }

  this.alpha = 1;
  this.dragging = false;
  this.data = null;

  toolbarStage.zIndex = 0;
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
  const inactiveCoordinates = [
    { x: 152, y: 0 },
    { x: 0, y: 0 },
    { x: -152, y: 0 },
  ];

  const toolbarBackground = PIXI.Sprite.from(textures.tools_background);

  toolbarBackground.anchor.set(0.5);
  toolbarStage.x = app.screen.width * 0.5;
  toolbarStage.y = app.screen.height * 0.85;

  toolbarStage.addChild(toolbarBackground);

  active = PIXI.Sprite.from(textures.tool_active_base);
  active.anchor.set(0.5);

  inactiveCoordinates.forEach(({ x, y }) => {
    const buttonContainer = new PIXI.Container();
    const inactive = PIXI.Sprite.from(textures.tool_inactive_base);

    buttonsContainersArr.push(buttonContainer);
    buttonContainer.zIndex = 0;
    inactive.anchor.set(0.5);

    setCoordinates(buttonContainer, x, y);

    buttonContainer.addChild(inactive);
    toolbarStage.addChild(buttonContainer);
  });

  buttonsContainersArr = buttonsContainersArr.reverse();

  sickle = PIXI.Sprite.from(textures.tool_1);
  hay = PIXI.Sprite.from(assets.tool_2);
  milk = PIXI.Sprite.from(assets.tool_3);

  sickle.name = 'sickle';
  sickle.anchor.set(0.5);
  sickle.interactive = true;

  hay.name = 'hay';
  hay.anchor.set(0.5);
  hay.interactive = true;

  milk.anchor.set(0.5);
  milk.interactive = true;
  milk.name = 'milk';

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

function cowsSetup(textures, cowstextures) {
  const cowsCoordinates = [
    { x: 100, y: 65 },
    { x: 195, y: -15 },
    { x: 270, y: 60 },
  ];

  const { length } = Object.keys(cowstextures);
  const frames = [];

  for (let i = 0; i < length; i += 1) {
    frames.push(cowstextures[`cow${i}`]);
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

  buttonAnimation(button);
}

const appBackground = PIXI.Sprite.from('./src/assets/image/game_scene_background.png');

appBackground.anchor.set(0.5, 0.525);
backgroundStage.addChild(appBackground);

app.loader
  .add(
    [
      { name: 'assets', url: 'src/assets/spritesheets/assets.json' },
      { name: 'cows', url: 'src/assets/animations/cows.json' },
    ],
  )
  .load((loader) => {
    assets = loader.resources.assets.textures;
    cows = loader.resources.cows.textures;

    gardenSetup(assets);
    toolbarSetup(assets);
    milkHouseSetup(assets);
    cowsSetup(assets, cows);
    advertisingSetup(assets);

    // endGame();
  });
