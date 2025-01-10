document.addEventListener("DOMContentLoaded", function() {
    // 現在のページ名を取得
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part !== "");
    let pageName = "index";
    if (pathParts.length >= 2) {
        const lastPart = pathParts[pathParts.length - 1].replace(".html", "");
        if (lastPart === pathParts[pathParts.length -1]){
            pageName = pathParts[pathParts.length - 2]
        }else {
           pageName = lastPart;
        }
    } else if(pathParts.length === 1){
        pageName = pathParts[0].replace(".html","")
    }
    console.log(pageName);
    const navKey = pageName ? pageName + "NavItems" : "indexNavItems"; //PC用
    const mobileNavKey = pageName ? pageName + "MobileNavItems" : "indexMobileNavItems" //mobile用

    // ナビゲーション(PC)の読み込み
    fetch("../json/nav.json")
        .then(response => response.json())
        .then(navData => {
            const nav = document.getElementById("nav_PC");
            let navHTML = "<ul>";
            if (navData[navKey]) {
                navData[navKey].forEach(item => {
                    if (item.type === "current") {
                       navHTML += `
                            <li>
                                <div id="now_page">
                                    <span class="${item.icon}">${item.iconName}</span><p>${item.text}</p>
                                </div>
                            </li>
                        `;
                    } else {
                       navHTML += `
                            <li>
                                <a href="${item.link}">
                                    <span class="${item.icon}">${item.iconName}</span><p>${item.text}</p>
                                </a>
                            </li>
                        `;
                    }
                });
            } else {
                console.error("JSONファイルに'" + navKey + "'というキーが存在しません。");
            }
            navHTML += "</ul>";
            nav.innerHTML = navHTML;
        })
      .catch(error => console.error("nav.jsonファイルの読み込みエラー:", error));

    // ナビゲーション(mobile)の読み込み
    fetch("../json/nav.json")
        .then(response => response.json())
        .then(navData => {
            const nav = document.getElementById("nav_mobile");
            let navHTML = "<ul>";
            if (navData[mobileNavKey]) {
                let topButton = "";
                navData[mobileNavKey].forEach(item => {
                    if (item.type === "top") {
                        topButton = `
                            <li id="page_up">
                                <a href="${item.link}">
                                  <span class="${item.icon}">${item.iconName}</span>
                                  <p>TOP</p>
                                </a>
                            </li>
                        `;
                    } else if (item.type === "current") {
                       navHTML += topButton;
                       navHTML += `
                            <li id="now_page_mobile">
                                <div>
                                    <span class="${item.icon}">${item.iconName}</span><p>${item.text}</p>
                                </div>
                            </li>
                        `;
                    } else {
                       navHTML += `
                            <li>
                                <a href="${item.link}">
                                    <span class="${item.icon}">${item.iconName}</span><p>${item.text}</p>
                                </a>
                            </li>
                        `;
                    }
                });
            } else {
                console.error("JSONファイルに'" + mobileNavKey + "'というキーが存在しません。");
            }
            navHTML += "</ul>";
            nav.innerHTML = navHTML;
        })
        .catch(error => console.error("nav.jsonファイルの読み込みエラー:", error));
});