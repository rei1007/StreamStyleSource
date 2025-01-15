function copyToClipboard(button) {
    // コピー対象の要素を取得
    let targetElement = button.parentElement.querySelector("input, textarea");
    // 元の値を保存
    let originalValue = targetElement.value;
    // クリップボードにコピー
    if (navigator.clipboard) {
        navigator.clipboard.writeText(targetElement.value)
            .then(() => {
                targetElement.value = "コピー完了";
                setTimeout(() => {
                    targetElement.value = originalValue;
                }, 1000);
                console.log("テキストをクリップボードにコピーしました:", targetElement.value);
            })
            .catch(error => {
                console.error("クリップボードへのコピーに失敗しました:", error);
            });
    } else {
        targetElement.select();
        document.execCommand("copy");
        targetElement.blur();
        targetElement.value = "コピー完了";
        setTimeout(() => {
            targetElement.value = originalValue;
        }, 1000);
        console.log("テキストをクリップボードにコピーしました:", targetElement.value);
    }
}