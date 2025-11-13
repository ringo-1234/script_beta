export const imports = `
importPackage(Packages.jp.ngt.ngtlib.util);
importPackage(Packages.jp.ngt.rtm.entity.train.util);
importPackage(Packages.org.lwjgl.input);`;

export const vardefs = ``;

export const inits = ``;

export const update_calls = `adnotch(entity);`;

export const functions = `
function adnotch(entity) {
  if (!entity) return;

  var dataMap = entity.getResourceState().getDataMap();
  var notch = entity.getNotch();

  var isPushA = dataMap.getBoolean("isPushA");
  var isPushD = dataMap.getBoolean("isPushD");

  if (isPushD && notch < 5) {
    entity.setNotch(notch + 1);
  }
  if (isPushA && notch > -8) {
    entity.setNotch(notch - 1);
  }
}`;
