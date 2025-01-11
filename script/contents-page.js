let colorForm = document.getElementById("color-form");
let output = document.getElementById("output");

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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
}
updateOutput();

colorForm.addEventListener("input", function (event) {
    if (event.target.classList.contains("form-input")) {
        updateOutput();
    }
});


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
    output.value = cssVariables;
    setCookie('color-form-values', JSON.stringify(colors), 3); // クッキーに保存 (3日間)
}