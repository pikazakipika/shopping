document.getElementById('pay-button').addEventListener('click', function() {
    const itemPrice = parseInt(document.getElementById('item-price').textContent, 10);
    const selectedCoins = document.querySelectorAll('.coin.selected'); // Get all selected coins
    let totalPayment = 0;

    selectedCoins.forEach(coin => {
        totalPayment += parseInt(coin.dataset.value, 10);
    });

    const resultMessage = document.getElementById('result-message');

    if (totalPayment === 0) {
        showToast('おかねをえらんで。', 'error'); // Show toast notification
        resultMessage.textContent = 'おかねをえらんで。';
        resultMessage.style.color = 'red';
        return;
    }

    if (totalPayment < itemPrice) {
        showToast('おかねが足りないよ。', 'error');
        resultMessage.textContent = 'おかねが足りないよ。';
        resultMessage.style.color = 'red';
    } else if (totalPayment >= itemPrice) {
        const change = totalPayment - itemPrice;
        paidCoins = Array.from(selectedCoins); // Record coins used for payment

        const changeContainer = displayChange(change);
        const gameContainer = document.querySelector('.game-container');
        const existingChangeContainer = document.getElementById('change-container');
        if (existingChangeContainer) {
            gameContainer.removeChild(existingChangeContainer);
        }
        gameContainer.appendChild(changeContainer);

        if (change > 0) {
            showToast(`ビンゴ！おかいものせいこう！ おつりは ${change} えんです。`, 'success');
            resultMessage.textContent = `ビンゴ！おかいものせいこう！ おつりは ${change} えんです。`;
        } else {
            showToast('ビンゴ！おかいものせいこう！', 'success');
            resultMessage.textContent = 'ビンゴ！おかいものせいこう！';
        }

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
    let remainingChange = change;

    for (const coin of COIN_VALUES) {
        const count = Math.floor(remainingChange / coin);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                const coinImage = createCoinElement(coin);
                applyCoinClickBehavior(coinImage);
                walletContainer.appendChild(coinImage);
            }
            remainingChange %= coin;
        }
    }
}

function removePaidCoins() {
    const walletContainer = document.getElementById('payment-options');

    // Remove only coins that were used for payment
    paidCoins.forEach(coin => {
        if (walletContainer.contains(coin)) {
            walletContainer.removeChild(coin);
            console.log(`Removed coin: ${coin.alt}`);
        }
    });

    // Clear the record of paid coins after removal
    paidCoins = [];

    // Ensure that selected but unpaid coins remain selected
    const remainingCoins = walletContainer.querySelectorAll('.coin');
    remainingCoins.forEach(coin => {
        if (coin.classList.contains('selected')) {
            coin.classList.remove('selected'); // Deselect unpaid coins
        }
    });
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

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // Add type class (success or error)
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show the toast
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Define constants for coin values
const COIN_VALUES = [500, 100, 50, 10, 5, 1];

// Utility function to create a coin element
function createCoinElement(value) {
    const coinImage = document.createElement('img');
    coinImage.src = `images/money_${value}.png`;
    coinImage.alt = `${value}えん`;
    coinImage.classList.add('coin');
    coinImage.dataset.value = value;
    return coinImage;
}

// Utility function to calculate total payment from selected coins
function calculateTotalPayment(selectedCoins) {
    return Array.from(selectedCoins).reduce((total, coin) => total + parseInt(coin.dataset.value, 10), 0);
}

// Utility function to display change as coins
function displayChange(change) {
    const changeContainer = document.createElement('div');
    changeContainer.id = 'change-container';
    changeContainer.style.marginTop = '20px';
    changeContainer.dataset.change = change;

    let remainingChange = change;
    for (const coin of COIN_VALUES) {
        const count = Math.floor(remainingChange / coin);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                const coinImage = createCoinElement(coin);
                changeContainer.appendChild(coinImage);
            }
            remainingChange %= coin;
        }
    }

    return changeContainer;
}

// Define a global variable to track paid coins
let paidCoins = [];
