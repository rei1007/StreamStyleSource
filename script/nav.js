document.addEventListener("DOMContentLoaded", function() {
    // 現在のページ名を取得
    const path = window.location.pathname;
    const pathParts = path.split('/').filter(part => part !== "");
    let pageName = "index";
    if (pathParts.length >= 2) {
        const lastPart = pathParts[pathParts.length - 1].replace(".html", "");
        if (lastPart === pathParts[pathParts.length -1]){
            let contentsPage = pathParts[pathParts.length - 2] + "Page"
            pageName = contentsPage
        }else {
           let contentsPage = lastPart + "Page"
           pageName = contentsPage
        }
    } else if(pathParts.length === 1){
        pageName = pathParts[0].replace(".html","")
    }
    const navKey = pageName ? pageName + "NavItems" : "indexNavItems"; //PC用
    const mobileNavKey = pageName ? pageName + "MobileNavItems" : "indexMobileNavItems" //mobile用

    // ナビゲーション(PC)の読み込み
    fetch("https://streamstylesource.pages.dev/json/nav.json")
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
                                <a href="https://streamstylesource.pages.dev/${item.link}">
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
    fetch("https://streamstylesource.pages.dev/json/nav.json")
        .then(response => response.json())
        .then(navData => {
            const nav = document.getElementById("nav_mobile");
            let navHTML = "<ul>";
            if (navData[mobileNavKey]) {
                navData[mobileNavKey].forEach(item => {
                   if (item.type === "top") {
                      navHTML += `
                           <li id="page_up">
                                <a href="#">
                                  <span class="${item.icon}">${item.iconName}</span>
                                  <p>TOP</p>
                                </a>
                            </li>
                        `;
                    } else if (item.type === "current") {
                       navHTML += `
                            <li id="now_page_mobile">
                                <a href="#">
                                    <span class="${item.icon}">${item.iconName}</span><p>${item.text}</p>
                                </a>
                            </li>
                        `;
                    } else {
                       navHTML += `
                            <li>
                                <a href="https://streamstylesource.pages.dev/${item.link}">
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