export const imports = `importPackage(Packages.org.lwjgl.input);`;

export const vardefs = ``;

export const inits = ``;

export const render_calls = `sendKey(entity);`;

export const functions = `
function sendKey(entity) {
  if (!entity || !entity.isControlCar()) return;

  var player = NGTUtil.getClientPlayer();
  if (entity.getFirstPassenger() !== player) return;

  var dataMap = entity.getResourceState().getDataMap();

  var nowA = Keyboard.isKeyDown(Keyboard.KEY_A);
  var nowD = Keyboard.isKeyDown(Keyboard.KEY_D);

  dataMap.setBoolean("isPushA", nowA, 1);
  dataMap.setBoolean("isPushD", nowD, 1);
}`;
