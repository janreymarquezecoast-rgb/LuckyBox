const openButton = document.getElementById("openButton");
const result = document.getElementById("result");
const resetButton = document.getElementById("resetButton");

let boxesOpened = Number(localStorage.getItem("boxesOpened")) || 0;

let rarityCounts = JSON.parse(localStorage.getItem("rarityCounts")) || {
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0
};

let collectedItems = JSON.parse(localStorage.getItem("collectedItems")) || [];

const rewards = [
    { name: "Rock", rarity: "Common", chance: 29 },
    { name: "Wooden Sword", rarity: "Common", chance: 18 },
    { name: "Iron Dagger", rarity: "Common", chance: 12 },

    { name: "Magical Wand", rarity: "Uncommon", chance: 10 },
    { name: "Hunter's Bow", rarity: "Uncommon", chance: 8 },
    { name: "Steel Axe", rarity: "Uncommon", chance: 6 },

    { name: "Battle Scythe", rarity: "Rare", chance: 5 },
    { name: "Flame Sword", rarity: "Rare", chance: 4 },
    { name: "Moon Staff", rarity: "Rare", chance: 3 },

    { name: "Dark Katana", rarity: "Epic", chance: 2 },
    { name: "Thunder Hammer", rarity: "Epic", chance: 1.5 },

    { name: "Dragon Slayer", rarity: "Legendary", chance: 0.8 },
    { name: "Celestial Bow", rarity: "Legendary", chance: 0.4 },
    { name: "Excalibur", rarity: "Legendary", chance: 0.2 },
    { name: "Void Blade", rarity: "Legendary", chance: 0.1 }
];

openButton.addEventListener("click", function() {
    openButton.disabled = true;
    result.innerHTML = "Opening... ✨";

    const box = document.querySelector(".box");
    box.classList.add("opening");

    setTimeout(function() {
        const randomNumber = Math.random() * 100;
        let totalChance = 0;

        for (let reward of rewards) {
            totalChance += reward.chance;

            if (randomNumber <= totalChance) {
                boxesOpened++;
                rarityCounts[reward.rarity]++;

                localStorage.setItem("boxesOpened", boxesOpened);
                localStorage.setItem(
                    "rarityCounts",
                    JSON.stringify(rarityCounts)
                );

                if (!collectedItems.includes(reward.name)) {
                    collectedItems.push(reward.name);

                    localStorage.setItem(
                        "collectedItems",
                        JSON.stringify(collectedItems)
                    );
                }

                result.innerHTML = `
                    <div class="rarity ${reward.rarity.toLowerCase()}">
                        <strong>${reward.rarity}!</strong>
                        <br>
                        You received: ${reward.name}
                    </div>
                `;

                updateStats();
                updateCollection();

                break;
            }
        }

        box.classList.remove("opening");
        openButton.disabled = false;
    }, 1500);
});

function updateStats() {
    document.getElementById("boxesOpened").textContent = boxesOpened;
    document.getElementById("commonCount").textContent = rarityCounts.Common;
    document.getElementById("uncommonCount").textContent = rarityCounts.Uncommon;
    document.getElementById("rareCount").textContent = rarityCounts.Rare;
    document.getElementById("epicCount").textContent = rarityCounts.Epic;
    document.getElementById("legendaryCount").textContent = rarityCounts.Legendary;
}

function updateCollection() {
    const collectionList = document.getElementById("collectionList");

    collectionList.innerHTML = "";

    for (let reward of rewards) {
        const item = document.createElement("div");

        if (collectedItems.includes(reward.name)) {
            item.innerHTML = `
                <strong>${reward.name}</strong>
                <span class="${reward.rarity.toLowerCase()}">
                    ${reward.rarity} ✓
                </span>
            `;
        } else {
            item.innerHTML = `
                <strong>???</strong>
                <span>🔒 Locked</span>
            `;
        }

        item.classList.add("collection-item");
        collectionList.appendChild(item);
    }
}

updateCollection();
updateStats();
resetButton.addEventListener("click", function() {
    const confirmReset = confirm("Are you sure you want to reset your progress?");

    if (confirmReset) {
        localStorage.clear();

        boxesOpened = 0;

        rarityCounts = {
            Common: 0,
            Uncommon: 0,
            Rare: 0,
            Epic: 0,
            Legendary: 0
        };

        collectedItems = [];

        result.innerHTML = "Your reward will appear here.";

        updateStats();
        updateCollection();
    }
});