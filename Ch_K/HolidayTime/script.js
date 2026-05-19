document.addEventListener("DOMContentLoaded", init);

async function init() {
    await loadHeader();
    loadSavedTitle();
    loadFooter();
    loadCards(cards_data);
}

async function loadHeader() {
    const container = document.getElementById("header");
    if (!container) return;

    const response = await fetch("header.html");
    const html = await response.text();

    container.innerHTML = html;
    
    console.log("HEADER LOADED:", document.querySelector(".menu-list"));
}

function loadFooter() {
    const footer = document.getElementById("footer");
    if (!footer) return;
    footer.classList.add("dark");
    footer.innerHTML = `
        <p style="font-size:36px;"><i>© 2021 HolidayTime. All rights reserved.</i></p>
    `;
}

const cards_data = [
    {
        img: "resources/bakota.svg",
        title: "Незвідана Бакота",
        description: "У Хмельницькій області розташований загублений край - Бакота. Мальовничий каньйон з давньою історією захоплює своїми просторами та незвичною атмосферою. Бджільництво, свіжий мед із польових трав, дотик до природи."
    },
    {
        img: "resources/karpaty.svg",
        title:"Полонини Карпат",
        description: "Полонини Карпат, у селі Орів посеред гір розташувався затишний куточок для незабутніх вражень. Справжні українські гори, власноручне сироваріння на полонині, водоспади та вікові дерева чекають на Вас."
    },
    {
        img: "resources/kyiv.svg",
        title: "Автентична Київщина",
        description: "Неподалік центра Києва розташувалось автентичне українське село на території однойменного села Пирогово. Дерев’яні млини, запашний хліб, приготовлений своїми руками, українські пісні та багато іншого чекає на вас уже зараз."
    },
    {
        img: "resources/odessa.svg",
        title: "Нетипова Одещина",
        description: "В Одеській області знаходиться мальовниче містечко Вилкове. Його ще називають «українською Венецією». Вилкове - це містечко на воді, весь в каналах. Розташоване в місці, де зустрічаються річка Дунай і Чорне море. Люди пересуваються переважно човнами. Нетипове українське село не залишить Вас без вражень."
    }    
]

function createCard(card) {
    const cardEl = document.createElement("div");
    cardEl.classList.add("booking-card");

    cardEl.innerHTML = `
        <img src="${card.img}">

        <div class="booking-info">
            <h2 style="font-size: 36px"><i>${card.title}</i></h2>
            <hr>
            <div class="info-section">
                <p style="font-size: 22px; align-self: center;">${card.description}</p>
            </div>
        </div>

        <img id="star" src="resources/star-icon.svg" alt="star">
        <button class="dark">Детальніше</button>
    `;

    return cardEl;
}

async function clearContainer(container) {
    container.innerHTML = "";
}

async function loadCards(cards) {
    const container = document.querySelector(".booking-cards-section");
    if (!container) return;

    await clearContainer(container);

    cards.forEach(card => {
        const cardEl = createCard(card);
        container.appendChild(cardEl);
    });
}

function setPageTitle(title) {
    localStorage.setItem("pageTitle", title);
}

function loadSavedTitle() {
    const savedTitle = localStorage.getItem("pageTitle");
    if (!savedTitle) return;

    const container = document.getElementById("page-title");
    if (!container) return;

    const div = document.createElement("div");
    div.classList.add("page-title");

    const h3 = document.createElement("h3");
    h3.textContent = savedTitle;
    h3.style.fontStyle = "italic";
    
    div.appendChild(h3);
    container.appendChild(div);
}

async function goToHouse() {
    loadTitle('Бронювання будиночка в Карпатах');
    window.location.href = 'house.html';
}