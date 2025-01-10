document.addEventListener("DOMContentLoaded", function() {
    fetch("https://streamstylesource.pages.dev/json/news.json")
        .then(response => response.json())
        .then(data => {
            const newsList = document.getElementById("news_list");
            data.news.forEach(item => {
                const newsCard = document.createElement("div");
                newsCard.classList.add("news_card");

                let titleLink = "";
                if (item.link) {
                  titleLink = `<a href="${item.link}">CHECK NOW!</a>`;
                }

                newsCard.innerHTML = `
                    <div class="news_title">
                        <h4>${item.title}</h4>
                         ${titleLink}
                    </div>
                    <p>${item.content}</p>
                    <hr>
                    <div class="chip_box">
                       ${item.chips.map(chip => `<div class="chip ${chip.type}">${chip.text}</div>`).join("")}
                    </div>
                `;
                newsList.appendChild(newsCard);
            });
        })
        .catch(error => console.error("JSONファイルの読み込みエラー:", error));
});