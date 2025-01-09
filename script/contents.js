function copyToClipboard(button) {
    let input = button.parentElement.querySelector("input");
    let originalValue = input.value;
    let url = input.value;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(url)
            .then(() => {
                 input.value = "コピー完了";
                 setTimeout(() => {
                    input.value = originalValue;
                }, 1000);
                console.log("URLをクリップボードにコピーしました:", url);
          })
            .catch(error => {
              console.error("クリップボードへのコピーに失敗しました:", error);
            });
    } else {
         input.select();
         document.execCommand("copy");
         input.blur();
          input.value = "コピー完了";
         setTimeout(() => {
             input.value = originalValue;
         }, 1000);
         console.log("URLをクリップボードにコピーしました:", url);
    }
}