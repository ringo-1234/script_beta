// 共通テンプレート
const COMMON = {
  render: {
    header: `var renderClass = "jp.ngt.rtm.render.VehiclePartsRenderer";\n`,
    import: `importPackage(Packages.jp.ngt.rtm.entity.train.util);\nimportPackage(Packages.jp.ngt.ngtlib.util);\nimportPackage(Packages.jp.ngt.ngtlib.renderer);`,
    init_base: ``,
  },
  server: {
    header: ``,
    import: ``,
  },
};

const FEATURES = {};
const SERVER_FEATURES = {};

// ペア定義
const FILE_PAIRS = {
  ad_notch: "data/server/ad_server.js",
};

// render用 読み込み
async function loadRenderFeatures() {
  const featureNames = ["ad_notch", "mascon", "wheel_rotation"];
  for (const name of featureNames) {
    try {
      const module = await import(`./data/${name}.js`);
      FEATURES[name] = {
        imports: module.imports || "",
        vardefs: module.vardefs || "",
        inits: module.inits || "",
        render_calls: module.render_calls || "",
        functions: module.functions || "",
      };
    } catch (e) {
      console.error(`Failed to load render ${name}.js`, e);
    }
  }
}

// server用 読み込み（ペアがあれば）
async function loadServerFeatures() {
  for (const [renderName, serverPath] of Object.entries(FILE_PAIRS)) {
    if (!serverPath) continue;
    try {
      const module = await import(`./${serverPath}`);
      SERVER_FEATURES[renderName] = {
        imports: module.imports || "",
        vardefs: module.vardefs || "",
        inits: module.inits || "",
        update_calls: module.update_calls || "",
        functions: module.functions || "",
      };
    } catch (e) {
      console.error(`Failed to load server ${serverPath}`, e);
    }
  }
}

// render.js 生成
async function generateRender() {
  let code = COMMON.render.header + "\n";
  let importLines = [COMMON.render.import];
  let vardefLines = [];
  let initLines = [COMMON.render.init_base];
  let renderCallLines = [];
  let functionLines = [];

  const selected = [];
  if (document.getElementById("ad_notch")?.checked) selected.push("ad_notch");
  if (document.getElementById("mascon")?.checked) selected.push("mascon");
  if (document.getElementById("wheel_rotation")?.checked)
    selected.push("wheel_rotation");

  selected.forEach((name) => {
    const f = FEATURES[name];
    if (!f) return;
    if (f.imports) importLines.push(f.imports);
    if (f.vardefs) vardefLines.push(f.vardefs);
    if (f.inits) initLines.push(f.inits);
    if (f.render_calls) renderCallLines.push(f.render_calls.trim());
    if (f.functions) functionLines.push(f.functions);
  });

  const allImports = importLines
    .filter(Boolean)
    .join("\n")
    .split("\n")
    .filter(Boolean);
  code += [...new Set(allImports)].join("\n") + "\n\n";

  if (vardefLines.some((v) => v.trim()))
    code += vardefLines.filter(Boolean).join("\n\n") + "\n\n";
  if (initLines.some((i) => i.trim())) {
    code += `function init(par1, par2) {\n`;
    code += initLines.filter(Boolean).join("\n") + "\n";
    code += `}\n\n`;
  }

  code += `function render(entity, pass, par3) {\n`;
  code += `  if (pass != 0 || !entity) return;\n`;
  code += `  GL11.glPushMatrix();\n`;
  code += `  body.render(renderer);\n`;
  renderCallLines.forEach((call) => (code += `  ${call}\n`));
  code += `  GL11.glPopMatrix();\n`;
  code += `}\n\n`;

  code += functionLines.filter(Boolean).join("\n\n");

  return code;
}
// server.js 生成
async function generateServer() {
  let code = COMMON.server.header + "\n";
  let importLines = [COMMON.server.import];
  let vardefLines = [];
  let initLines = [];
  let updateCallLines = [];
  let functionLines = [];

  // 選択された機能
  const selected = [];
  if (document.getElementById("ad_notch")?.checked) selected.push("ad_notch");
  if (document.getElementById("mascon")?.checked) selected.push("mascon");
  if (document.getElementById("wheel_rotation")?.checked)
    selected.push("wheel_rotation");
  // 他の機能も追加可能

  selected.forEach((name) => {
    const f = SERVER_FEATURES[name];
    if (!f) return;
    if (f.imports) importLines.push(f.imports);
    if (f.vardefs) vardefLines.push(f.vardefs);
    if (f.inits) initLines.push(f.inits);
    if (f.update_calls) updateCallLines.push(f.update_calls.trim());
    if (f.functions) functionLines.push(f.functions);
  });

  // import 処理（重複排除）
  const allImports = importLines
    .filter(Boolean)
    .join("\n")
    .split("\n")
    .filter(Boolean);
  if (allImports.length > 0) {
    code += [...new Set(allImports)].join("\n") + "\n\n";
  }

  // vardefs
  if (vardefLines.some((v) => v.trim())) {
    code += vardefLines.filter(Boolean).join("\n\n") + "\n\n";
  }

  // init 関数
  if (initLines.some((i) => i.trim())) {
    code += `function init(entity) {\n`;
    code += initLines.filter(Boolean).join("\n") + "\n";
    code += `}\n\n`;
  }

  // onUpdate 関数
  const hasUpdateCalls = updateCallLines.length > 0;
  const hasInit = initLines.some((i) => i.trim());
  const hasFunctions = functionLines.length > 0;

  // 完全に空なら何も出力しない
  if (!hasUpdateCalls && !hasInit && !hasFunctions) {
    return "";
  }

  code += `function onUpdate(entity, scriptExecuter) {\n`;
  if (hasUpdateCalls) {
    updateCallLines.forEach((call) => {
      code += `  ${call}\n`;
    });
  } else {
    code += `  // ここに処理を追加\n`;
  }
  code += `}\n\n`;

  // 固有関数
  if (hasFunctions) {
    code += functionLines.filter(Boolean).join("\n\n");
  }

  return code.trim(); // 末尾の余分な改行を削除
}
function copyToClipboard(button) {
  const textareaId = button.getAttribute("data-target");
  const textarea = document.getElementById(textareaId);
  if (!textarea) return;

  textarea.select();
  textarea.setSelectionRange(0, 99999);

  const originalText = button.textContent;

  // コピー中表示
  button.textContent = "コピー中...";
  button.classList.add("copying");

  navigator.clipboard
    .writeText(textarea.value)
    .then(() => {
      button.textContent = "コピーする";
      button.style.backgroundColor = "#4CAF50";
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copying");
        button.style.backgroundColor = "";
      }, 1500);
    })
    .catch(() => {
      button.textContent = "コピー失敗";
      button.style.backgroundColor = "#f44336";
      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove("copying");
        button.style.backgroundColor = "";
      }, 2000);
    });
}

// ここに追加！！
window.copyToClipboard = copyToClipboard;

// ボタン処理
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("generate-btn");
  const renderDiv = document.getElementById("render-output");
  const serverDiv = document.getElementById("server-output");
  const renderText = document.getElementById("render-text");
  const serverText = document.getElementById("server-text");

  if (btn) {
    btn.addEventListener("click", async () => {
      const renderCode = await generateRender();
      const serverCode = await generateServer();

      renderText.value = renderCode;
      renderDiv.classList.add("active");

      if (serverCode.trim()) {
        serverText.value = serverCode;
        serverDiv.classList.add("active");
      } else {
        serverDiv.classList.remove("active");
      }
    });
  }
});

// 起動
Promise.all([loadRenderFeatures(), loadServerFeatures()]).then(() => {
  console.log("All JS loaded!");
});
