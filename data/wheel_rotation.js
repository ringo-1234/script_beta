export const imports = `
importPackage(Packages.org.lwjgl.opengl);
importPackage(Packages.jp.ngt.rtm.render);
importPackage(Packages.jp.ngt.ngtlib.math);`;

export const vardefs = ``;

export const inits = `
  wheel_F = renderer.registerParts(new Parts("車輪A"));
  wheel_R = renderer.registerParts(new Parts("車輪B"));
  frame = renderer.registerParts(new Parts("フレーム,ヨーダンパーなど"));`;

export const render_calls = `wheelRotation(entity);`;

export const functions = `
function wheelRotation(entity) {
  var wheelRotation = renderer.getWheelRotationR(entity);
  var y = -0.573;
  var z = 1.05;
  frame.render(renderer);
  GL11.glPushMatrix();
  renderer.rotate(wheelRotation, "X", 0, y, z);
  wheel_F.render(renderer);
  GL11.glPopMatrix();

  GL11.glPushMatrix();
  renderer.rotate(wheelRotation, "X", 0, y, -z);
  wheel_R.render(renderer);
  GL11.glPopMatrix();
}  
`;
