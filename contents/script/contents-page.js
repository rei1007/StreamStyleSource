let colorForm = document.getElementById("color-form");
let iframe = document.getElementById("test");
let urlOutput = document.getElementById("url_output");
let cssOutput = document.getElementById("css_output");
let presetButtons = document.querySelectorAll(".preset-button");
let secDisplayToggle = document.getElementById("sec-display-toggle");

//cookie保存
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

//cookie取得
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

//プリセット
let presets = {};
fetch("json/material-clock.json")
    .then(response => response.json())
    .then(data => {
        presets = data;
        presetButtons.forEach(button => {
            button.addEventListener('click', function () {
                applyPreset(this.dataset.preset);
            });
        });
        // ページ読み込み時にクッキーから値を復元
        let savedColors = getCookie('color-form-values');
        if (savedColors) {
            try {
                let parsedColors = JSON.parse(savedColors);
                Object.keys(parsedColors).forEach(key => {
                    let inputElement = document.getElementById(key);
                    if (inputElement) {
                        inputElement.value = parsedColors[key];
                    }
                });
            } catch (error) {
                console.error("クッキーデータの解析に失敗しました", error);
            }
        } else {
             applyPreset('default');
         }
         updateOutput();
         updateIframeSrc();
    });

//変更があったら反映する
colorForm.addEventListener("input", function (event) {
    if (event.target.classList.contains("form-input")) {
        updateOutput();
        updateIframeSrc();
    }
});


//iframe
function updateIframeSrc() {
    let colors = {};
    let inputs = colorForm.querySelectorAll("input");
    inputs.forEach(input => {
        let key = input.id.replace("change-", "--");
        colors[key] = input.value;
    });
    if (secDisplayToggle.dataset.status === "on") {
        colors["--sec-display"] = "flex";
    } else {
        colors["--sec-display"] = "none";
    }
    let url = `https://sss-contents.pages.dev/material-clock.html#${encodeURIComponent(JSON.stringify(colors))}`;
    iframe.src = url;
    urlOutput.value = url;
}


//css書き出し
function updateOutput() {
    let cssVariables = ":root {\n";
    let inputs = colorForm.querySelectorAll("input");
    let colors = {};
    inputs.forEach(input => {
        let variableName = input.id.replace("change-", "--").replace(/-/g, "-");
        cssVariables += `    ${variableName}: ${input.value};\n`;
        colors[input.id] = input.value;
    });
    cssVariables += "}";
    cssOutput.value = cssVariables;
    setCookie('color-form-values', JSON.stringify(colors), 3); // クッキーに保存 (3日間)
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
        updateOutput(); // ★この行を追加
        updateIframeSrc();
    }
}

// 秒数表示切り替え
secDisplayToggle.addEventListener('click', function () {
    if (this.dataset.status === "on") {
        this.dataset.status = "off";
        this.textContent = "OFF";
    } else {
        this.dataset.status = "on";
        this.textContent = "ON";
    }
    updateIframeSrc();
});