//ロード画面
window.onload = function () {
	const loader = document.getElementById("load");
	setTimeout(() => {
		loader.style.opacity = '0';
	}, 800);
	loader.addEventListener("transitionend", () => {
		loader.style.display = "none";
	});
};

//フッター
document.addEventListener("DOMContentLoaded", function () {
	fetch("https://streamstylesource.pages.dev/json/footer.json")
		.then(response => response.json())
		.then(footerData => {
			const footer = document.getElementById("footer");
			footer.innerHTML = `
			<div id="contact">
				<div id="profile">
					<div id="profile_title">
						<img id="xicon" src="https://streamstylesource.pages.dev/${footerData.profile.xicon}" alt="Xプロフィールアイコン">
						<div>
							<p>制作者</p>
							<h3>${footerData.profile.name}</h3>
						</div>
					</div>
					<hr>
					<div id="link">
						${footerData.profile.links.map(link => `
							<button><a href="${link.href}" aria-label="${link.alabel}"></a><img src="https://streamstylesource.pages.dev/${link.logo}" alt="${link.alt}">${link.text}</button>
							`).join("")}
					</div>
				</div>
				<div id="contact_text">
					<div id="contact_text_title">
						<span class="${footerData.contact.emailIcon}">${footerData.contact.emailIconText}</span>
						<h3>${footerData.contact.title}</h3>
					</div>
					<p>${footerData.contact.text}</p>
				</div>
			</div>
			
			<p id="copy_right">${footerData.copyright}</p>
		`;
		})
		.catch(error => console.error("footer.jsonファイルの読み込みエラー:", error));
});