document.getElementById('pay-button').addEventListener('click', function() {
    const itemPrice = parseInt(document.getElementById('item-price').textContent, 10);
    const selectedCoins = document.querySelectorAll('.coin.selected'); // Get all selected coins
    let totalPayment = 0;

    selectedCoins.forEach(coin => {
        totalPayment += parseInt(coin.dataset.value, 10);
    });

    const resultMessage = document.getElementById('result-message');

    if (totalPayment === 0) {
        resultMessage.textContent = 'おかねをえらんで。';
        resultMessage.style.color = 'red';
        return;
    }

    if (totalPayment < itemPrice) {
        resultMessage.textContent = 'おかねが足りないよ。';
        resultMessage.style.color = 'red';
    } else if (totalPayment >= itemPrice) {
        const change = totalPayment - itemPrice;
        const changeContainer = document.createElement('div');
        changeContainer.id = 'change-container';
        changeContainer.style.marginTop = '20px';
        changeContainer.dataset.change = change; // 追加: おつりの金額をデータ属性に保存

        if (change > 0) {
            const coins = [500, 100, 50, 10, 5, 1];
            let remainingChange = change;

            for (const coin of coins) {
                const count = Math.floor(remainingChange / coin);
                if (count > 0) {
                    for (let i = 0; i < count; i++) {
                        const coinImage = document.createElement('img');
                        coinImage.src = `images/money_${coin}.png`;
                        coinImage.alt = `${coin}えん`;
                        coinImage.classList.add('coin');
                        changeContainer.appendChild(coinImage);
                    }
                    remainingChange %= coin;
                }
            }

            resultMessage.textContent = `ビンゴ！おかいものせいこう！ おつりは ${change} えんです。`;
        } else {
            resultMessage.textContent = 'ビンゴ！おかいものせいこう！';
        }

        const gameContainer = document.querySelector('.game-container');
        const existingChangeContainer = document.getElementById('change-container');
        if (existingChangeContainer) {
            gameContainer.removeChild(existingChangeContainer);
        }
        gameContainer.appendChild(changeContainer);

        resultMessage.style.color = 'green';
    }
});

const items = [
    { name: 'りんご', price: 100, image: 'images/fruit_apple.png' },
    { name: 'バナナ', price: 150, image: 'images/fruit_banana.png' },
    { name: 'オレンジ', price: 200, image: 'images/fruit_orange.png' }
];

function applyCoinClickBehavior(coinImage) {
    coinImage.addEventListener('click', function () {
        // Toggle the selected state of the clicked coin
        this.classList.toggle('selected');
    });
}

function initializeWallet() {
    const walletContainer = document.getElementById('payment-options');
    const coinImages = walletContainer.querySelectorAll('img');

    coinImages.forEach(coinImage => {
        coinImage.classList.add('coin'); // Ensure all initial coins have the coin class
        applyCoinClickBehavior(coinImage, walletContainer);
    });
}

function addChangeToWallet(change) {
    const walletContainer = document.getElementById('payment-options');
    const coins = [500, 100, 50, 10, 5, 1];
    let remainingChange = change;

    for (const coin of coins) {
        const count = Math.floor(remainingChange / coin);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                // Create coin image
                const coinImage = document.createElement('img');
                coinImage.src = `images/money_${coin}.png`;
                coinImage.alt = `${coin}えん`;
                coinImage.classList.add('coin'); // Apply coin class
                coinImage.dataset.value = coin; // Store coin value in dataset

                // Apply click behavior
                applyCoinClickBehavior(coinImage, walletContainer);

                // Append image to wallet container
                walletContainer.appendChild(coinImage);
            }
            remainingChange %= coin;
        }
    }
}

function removePaidCoins() {
    const walletContainer = document.getElementById('payment-options');
    const selectedCoins = walletContainer.querySelectorAll('.coin.selected'); // Get all selected coins

    selectedCoins.forEach(coin => {
        walletContainer.removeChild(coin);
        console.log(`Removed coin: ${coin.alt}`);
    });

    if (selectedCoins.length === 0) {
        console.warn('No coins selected to remove.');
    }
}

function resetGame() {
    console.log('resetGame called');
    removePaidCoins();
    console.log('removePaidCoins executed');
    const randomItem = items[Math.floor(Math.random() * items.length)];
    console.log('Random item selected:', randomItem);
    document.getElementById('item-name').textContent = randomItem.name;
    document.getElementById('item-price').textContent = randomItem.price;
    document.getElementById('item-image').src = randomItem.image;
    document.getElementById('result-message').textContent = '';

    const paymentOptions = document.getElementsByName('payment');
    for (const option of paymentOptions) {
        option.checked = false;
    }

    const changeContainer = document.getElementById('change-container');
    if (changeContainer) {
        const change = parseInt(changeContainer.dataset.change, 10);
        console.log('Adding change to wallet:', change);
        addChangeToWallet(change);
        changeContainer.remove();
    }
}

// 既存の「もう1回」ボタンを再利用
let resetButton = document.getElementById('reset-button');
if (!resetButton) {
    resetButton = document.createElement('button');
    resetButton.textContent = 'もう1回';
    resetButton.id = 'reset-button';
    document.querySelector('.button-container').appendChild(resetButton);
}
resetButton.addEventListener('click', resetGame);

// ページ読み込み時にゲームを初期化
window.addEventListener('load', resetGame);

// Ensure wallet initialization on page load
window.addEventListener('load', initializeWallet);
