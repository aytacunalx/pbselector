document.addEventListener('DOMContentLoaded', () => {
    // Ürün listesi ve olasılık ağırlıkları
    const items = [
        { name: 'Fang Blade', rarity: 'common', image: 'fang.png' },
        { name: 'R.B SS8M+S2', rarity: 'common', image: 'RB.png' },
        { name: 'Kalkan', rarity: 'common', image: 'sh.png' },
        { name: 'Saiga-12', rarity: 'common', image: 'saiga.png' },
        { name: 'Tactilite T2', rarity: 'uncommon', image: 't2.png' },
        { name: 'Cheytac M200', rarity: 'uncommon', image: 'Cheytac.png' },
        { name: 'C.Machete', rarity: 'uncommon', image: 'Combat.png' },
        { name: 'Bone Knife', rarity: 'rare', image: 'Bone.png' },
        { name: 'AUG A3', rarity: 'rare', image: 'AUG.png' },
        { name: 'APC9', rarity: 'mythical', image: 'apc.png' },
        { name: 'Honey Badger', rarity: 'mythical', image: 'HoneyBadger.png' },
        { name: 'SS3 Silence', rarity: 'mythical', image: 'hydra.png' },
        { name: 'T77', rarity: 'legendary', image: 'T77.png' },
        { name: 'T77 Deadly Hydra', rarity: 'legendary', image: 'deadly.png' },
        { name: 'XM7', rarity: 'legendary', image: 'xm7.png' },
        { name: 'SS3', rarity: 'legendary', image: 'ss3.png' },
        { name: 'Medical Kit', rarity: 'legendary', image: 'medic.png' },
        { name: 'Compound Bow', rarity: 'covert', image: 'Compound.png' },
        { name: 'Gökyüzü Ejderi', rarity: 'covert', image: 'Azure.png' },
        { name: 'Barrett M82A1', rarity: 'covert', image: 'Barret.png' },
        { name: 'Pembe Ejderha', rarity: 'covert', image: 'PinkDragon.png' },
        { name: 'Wiaxo Makrosu', rarity: 'covert', image: 'wiaxo.png' }
    ];
     const weights = {
        common: 50, uncommon: 16, rare: 3.2, mythical: 0.64, legendary: 0.26, covert: 0.1
    };

    // HTML elementleri
    const roller = document.getElementById('roller');
    const openCaseBtn = document.getElementById('openCaseBtn');
    const winningOverlay = document.getElementById('winning-overlay');
    const winningItemCard = document.getElementById('winning-item-card');
    const continueBtn = document.getElementById('continueBtn');
    const imagePath = 'images/';

    function getWeightedRandomItem() {
        const weightedItems = [];
        items.forEach(item => {
            const weight = weights[item.rarity];
            for (let i = 0; i < weight * 100; i++) {
                weightedItems.push(item);
            }
        });
        const randomIndex = Math.floor(Math.random() * weightedItems.length);
        return weightedItems[randomIndex];
    }
    
    function createItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item', item.rarity);
        // Kazananı daha sonra bulabilmek için özel bir data-attribute
        itemDiv.setAttribute('data-item-name', item.name);
        const itemImg = document.createElement('img');
        itemImg.src = imagePath + item.image;
        itemImg.alt = item.name;
        const itemName = document.createElement('p');
        itemName.textContent = item.name;
        itemDiv.appendChild(itemImg);
        itemDiv.appendChild(itemName);
        return itemDiv;
    }

    function showWinningScreen(item) {
        const rarityColors = {
            common: '#b0c3d9', uncommon: '#5e98d9', rare: '#4b69ff',
            mythical: '#8847ff', legendary: '#d32ce6', ancient: '#eb4b4b', covert: '#ffd700'
        };
        winningItemCard.innerHTML = `
            <img src="${imagePath}${item.image}" alt="${item.name}">
            <p class="${item.rarity}">${item.name}</p>
        `;
        const winningImage = winningItemCard.querySelector('img');
        winningImage.style.setProperty('--rarity-color', rarityColors[item.rarity]);
        winningOverlay.classList.remove('hidden');
    }

    function openCase() {
        openCaseBtn.disabled = true;
        const winningItem = getWeightedRandomItem();
        roller.innerHTML = '';
        const reelLength = 150;
        const winningIndex = 125;
        let lastItemName = '';

        for (let i = 0; i < reelLength; i++) {
            let currentItem;
            if (i === winningIndex) {
                currentItem = winningItem;
            } else {
                do {
                    currentItem = items[Math.floor(Math.random() * items.length)];
                } while (currentItem.name === lastItemName);
            }
            const itemElement = createItemElement(currentItem);
            // Kazanan elemente özel bir id atayarak onu kolayca bulacağız.
            if (i === winningIndex) {
                itemElement.id = 'winner';
            }
            roller.appendChild(itemElement);
            lastItemName = currentItem.name;
        }

        // --- YENİ VE GARANTİLİ HESAPLAMA YÖNTEMİ ---

        // Animasyon başlamadan önce, şeridi başlangıç pozisyonuna zorla.
        roller.style.transition = 'none';
        roller.style.transform = 'translateX(0)';

        // Gerekli elementleri ve DOM bilgilerini al.
        const winnerElement = document.getElementById('winner');
        const caseContainer = roller.parentElement;

        // Tarayıcıdan elemanların GERÇEK, RENDER EDİLMİŞ pozisyonlarını ve boyutlarını al.
        const containerRect = caseContainer.getBoundingClientRect();
        const winnerRect = winnerElement.getBoundingClientRect();

        // Konteynerin ve kazanan ürünün merkez noktalarını hesapla.
        const containerCenter = containerRect.left + (containerRect.width / 2);
        const winnerCenter = winnerRect.left + (winnerRect.width / 2);

        // Hedef pozisyonu, iki merkez arasındaki PİKSEL FARKINA göre hesapla.
        // Bu, varsayımları ortadan kaldırır ve gerçek değere göre hareket eder.
        const targetPosition = winnerCenter - containerCenter;

        // Animasyonu başlat
        setTimeout(() => {
            roller.classList.add('rolling');
            roller.style.transition = 'transform 7s cubic-bezier(0.1, 0.8, 0.2, 1)';
            // Şeridi, mevcut konumundan PİKSEL FARK KADAR kaydır.
            roller.style.transform = `translateX(-${targetPosition}px)`;
        }, 100);

        // Animasyon bitince
        setTimeout(() => {
            roller.classList.remove('rolling');
            showWinningScreen(winningItem);
        }, 7500);
    }
    
    continueBtn.addEventListener('click', () => {
        winningOverlay.classList.add('hidden');
        winningItemCard.style.animation = 'none';
        void winningItemCard.offsetWidth;
        winningItemCard.style.animation = null; 
        openCaseBtn.disabled = false;
    });

    openCaseBtn.addEventListener('click', openCase);
});
