export const renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";
export const imports = `
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);`;
export const vardefs = `
var pitchA = -35; //マスコン動作の手前の角度
var pitchB = 85; //マスコン動作の奥の角度
var MSCN = {
  X: 81.7, //マスコンの回転軸の座標
  Y: 89.5,
  Z: 915,
};
function mx() {
  return MSCN.X / 100;
}
function my() {
  return MSCN.Y / 100;
}
function mz() {
  return MSCN.Z / 100;
}`;
export const inits = `mscn = renderer.registerParts(new Parts("マスコンのパーツ名"));`;
export const render_calls = `render_mscn(entity);`;
export const functions = `
function render_mscn(entity) {
  if (!entity) return;

  var notch = entity.getNotch() || 0;
  var X = mx(),
    Y = my(),
    Z = mz();
  var angle = 0;
  if (notch > 0) {
    angle = (notch / 5) * pitchA;
  } else if (notch < 0) {
    angle = (-notch / 8) * pitchB;
  } else {
    angle = 0;
  }
  GL11.glPushMatrix();
  renderer.rotate(angle, "X", X, Y, Z);
  mscn.render(renderer);
  GL11.glPopMatrix();
}`;
