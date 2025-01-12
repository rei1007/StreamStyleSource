let colorForm = document.getElementById("color_form");
let iframe = document.getElementById("test");
let urlOutput = document.getElementById("url_output");
let cssOutput = document.getElementById("css_output");
let presetButtons = document.querySelectorAll(".preset-button");
let secDisplayToggle = document.getElementById("sec-display-toggle");
let dateDisplayToggle = document.getElementById("date-display-toggle");
let liveDisplayToggle = document.getElementById("live-display-toggle");

// cookie保存
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

// cookie取得
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// --------------------------------------------------------------------
// 表示切り替え処理
// --------------------------------------------------------------------

function initializeDisplayToggle() {
    // クッキーから表示設定を復元
    let savedSecDisplay = getCookie('sec-display');
    let savedDateDisplay = getCookie('date-display');
    let savedLiveDisplay = getCookie('live-display');

    if(savedSecDisplay === "on"){
        secDisplayToggle.checked = true;
    }else{
        secDisplayToggle.checked = false;
    }
    if(!savedSecDisplay){
        secDisplayToggle.checked = true;
        setCookie('sec-display', 'on', 3);
    }

    if(savedDateDisplay === "on"){
        dateDisplayToggle.checked = true;
    }else{
        dateDisplayToggle.checked = false;
    }
    if(!savedDateDisplay){
       dateDisplayToggle.checked = false;
       setCookie('date-display', 'off', 3);
    }

    if(savedLiveDisplay === "on"){
        liveDisplayToggle.checked = true;
    }else{
         liveDisplayToggle.checked = false;
    }
    if(!savedLiveDisplay){
         liveDisplayToggle.checked = true;
         setCookie('live-display', 'on', 3);
    }
    console.log("Initial Toggle States:", {
      "secDisplayToggle": secDisplayToggle.checked,
      "dateDisplayToggle": dateDisplayToggle.checked,
      "liveDisplayToggle": liveDisplayToggle.checked,
    });
     console.log("Initial Cookie States:", {
        "sec-display": getCookie('sec-display'),
        "date-display": getCookie('date-display'),
        "live-display": getCookie('live-display'),
    });
}
function handleDisplayToggleChange(event) {
    let toggle = event.target;
    let id = toggle.id;
    let value = toggle.checked ? 'on' : 'off';
    let cookieName = id.replace('-toggle', '');
    setCookie(cookieName, value, 3);
    updateOutput();
    updateIframeSrc();
}

// トグルスイッチのイベントリスナーを設定
secDisplayToggle.addEventListener('change', handleDisplayToggleChange);
dateDisplayToggle.addEventListener('change', handleDisplayToggleChange);
liveDisplayToggle.addEventListener('change', handleDisplayToggleChange);


// --------------------------------------------------------------------
// カラー切り替え処理
// --------------------------------------------------------------------

let presets = {};

function initializeColorPalette(){
    fetch("json/material-clock.json")
    .then(response => response.json())
    .then(data => {
        presets = data;
         let savedPreset = getCookie('selected-preset');
        let savedColors = getCookie('color-form-values');
        if(savedPreset === "custom" && savedColors){
                try{
                    let parsedColors = JSON.parse(savedColors);
                    Object.keys(parsedColors).forEach(key => {
                    let inputElement = document.getElementById(key);
                        if (inputElement) {
                            inputElement.value = parsedColors[key];
                        }
                    });
                    removeNowPreset();
                }catch(e){
                    console.error("クッキーデータの解析に失敗しました", e);
                    applyPreset('default');
                }
        }else if(savedPreset && presets[savedPreset]){
             applyPreset(savedPreset);
        }else{
            applyPreset('default');
        }
         updateOutput();
         updateIframeSrc();
    });
}

function applyPreset(presetName) {
    if (presets[presetName]) {
        const preset = presets[presetName];
        for (let key in preset) {
            let inputElement = document.getElementById(key.replace("--", "change-"));
            if (inputElement) {
                inputElement.value = preset[key];
            }
        }
        updatePresetButton(presetName)
        setCookie('selected-preset', presetName, 3);
    }
}

function handlePresetButtonClick(event) {
    let presetName = event.target.dataset.preset;
    applyPreset(presetName);
    updateOutput();
    updateIframeSrc();
}

function handleColorFormInput(event) {
    if (event.target.classList.contains("form-input")) {
        let colors = {};
        let inputs = colorForm.querySelectorAll("input");
        inputs.forEach(input => {
            colors[input.id] = input.value;
        });
        setCookie('color-form-values', JSON.stringify(colors), 3);
        setCookie('selected-preset', "custom", 3);
        removeNowPreset();
        updateOutput();
        updateIframeSrc();
    }
}
//プリセットボタンのイベントリスナー
presetButtons.forEach(button => {
    button.addEventListener('click', handlePresetButtonClick);
});
//カラーフォームのイベントリスナー
colorForm.addEventListener("input", handleColorFormInput);

// --------------------------------------------------------------------
// URLとCSSの出力
// --------------------------------------------------------------------
function updateIframeSrc() {
    let colors = {};
     let inputs = colorForm.querySelectorAll("input");
    inputs.forEach(input => {
        let key = input.id.replace("change-", "--");
        colors[key] = input.value;
    });
    if (liveDisplayToggle.checked) {
        colors["--live-display"] = "block";
    } else {
        colors["--live-display"] = "none";
    }
    if (secDisplayToggle.checked) {
        colors["--sec-display"] = "flex";
    } else {
        colors["--sec-display"] = "none";
    }
    if (dateDisplayToggle.checked) {
        colors["--top-display"] = "none";
    } else {
        colors["--top-display"] = "flex";
    }
    let url = `https://sss-contents.pages.dev/material-clock.html#${encodeURIComponent(JSON.stringify(colors))}`;
    iframe.src = url;
    urlOutput.value = url;
}

function updateOutput() {
    let cssVariables = ":root {\n";
    let inputs = colorForm.querySelectorAll("input");
    inputs.forEach(input => {
        let variableName = input.id.replace("change-", "--").replace(/-/g, "-");
        cssVariables += `    ${variableName}: ${input.value};\n`;
    });
     if (liveDisplayToggle.checked) {
        cssVariables += `    --live-display: block;\n`;
    } else {
        cssVariables += `    --live-display: none;\n`;
    }
    if (secDisplayToggle.checked) {
        cssVariables += `    --sec-display: flex;\n`;
    } else {
        cssVariables += `    --sec-display: none;\n`;
    }
    if (dateDisplayToggle.checked) {
        cssVariables += `    --top-display: none;\n`;
    } else {
        cssVariables += `    --top-display: flex;\n`;
    }
    cssVariables += "}";
    cssOutput.value = cssVariables;
}
// --------------------------------------------------------------------
//  その他
// --------------------------------------------------------------------
function updatePresetButton(presetName) {
    presetButtons.forEach(button => {
       button.classList.remove('now_preset');
       if (presetName && button.dataset.preset === presetName) {
          button.classList.add('now_preset');
         }
    });
}

function removeNowPreset(){
    presetButtons.forEach(button =>{
      button.classList.remove('now_preset');
    });
}

// 初期化処理
initializeDisplayToggle();
initializeColorPalette();