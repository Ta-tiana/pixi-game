import CONSTANTS from './constants';

function alignCenter(child, parent) {
  child.x = parent.width / 2;
  child.y = parent.height / 2;
}

function setCoordinates(object, x, y) {
  object.x = x;
  object.y = y;
}

function setScale(object, scale) {
  object.scale.x = scale;
  object.scale.y = scale;
}

function scaleCalculator() {
  // Width and height scale ratio
  const wScale = window.innerWidth / CONSTANTS.MIN_WIDTH;
  const hScale = window.innerHeight / CONSTANTS.MIN_HEIGHT;

  return Math.min(wScale, hScale);
}

export {
  alignCenter, setCoordinates, setScale, scaleCalculator,
};
