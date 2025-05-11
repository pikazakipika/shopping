// 「しはらう」ボタンのイベントリスナー
// 支払い処理を行い、合計金額を計算し、支払いが十分かどうかを判断します
document.getElementById('pay-button').addEventListener('click', function() {
    const payButton = document.getElementById('pay-button');

    const itemPrice = parseInt(document.getElementById('item-price').textContent, 10);
    const selectedCoins = document.querySelectorAll('.coin.selected'); // 選択されたすべてのコインを取得
    let totalPayment = 0;

    selectedCoins.forEach(coin => {
        totalPayment += parseInt(coin.dataset.value, 10);
    });

    const resultMessage = document.getElementById('result-message');

    if (totalPayment === 0) {
        showToast('おかねをえらんで。', 'error'); // トースト通知を表示
        resultMessage.textContent = 'おかねをえらんで。';
        resultMessage.style.color = 'red';
        return;
    }

    if (totalPayment < itemPrice) {
        showToast('おかねがたりないよ。', 'error');
        resultMessage.textContent = 'おかねが足りないよ。';
        resultMessage.style.color = 'red';
    } else if (totalPayment >= itemPrice) {
        const change = totalPayment - itemPrice;
        paidCoins = Array.from(selectedCoins); // 支払いに使用されたコインを記録

        const changeContainer = displayChange(change);
        const gameContainer = document.querySelector('.game-container');
        const existingChangeContainer = document.getElementById('change-container');
        if (existingChangeContainer) {
            gameContainer.removeChild(existingChangeContainer);
        }
        gameContainer.appendChild(changeContainer);

        if (change > 0) {
            showToast(`ナイス！おかいものせいこう！ おつりは ${change} えんです。`, 'success');
            resultMessage.textContent = `ナイス！おかいものせいこう！ おつりは ${change} えんです。`;
        } else {
            showToast('ナイス！おかいものせいこう！', 'success');
            resultMessage.textContent = 'ナイス！おかいものせいこう！';
        }

        resultMessage.style.color = 'green';
        payButton.disabled = true; // 支払いが成功した後にのみ「しはらう」ボタンを無効にします
    }
});

// 購入可能な商品の配列
// 各商品には名前、価格、画像が含まれています
const items = [
    { name: 'りんご', price: 100, image: 'images/fruit_apple.png' },
    { name: 'バナナ', price: 150, image: 'images/fruit_banana.png' },
    { name: 'オレンジ', price: 200, image: 'images/fruit_orange.png' }
];

// 硬貨要素にクリックとキーボードの動作を適用する関数
// マウスやキーボードを使用して硬貨を選択または解除できます
function applyCoinClickBehavior(coinImage) {
    coinImage.addEventListener('click', function () {
        // クリックされたコインの選択状態をトグルします
        this.classList.toggle('selected');
    });

    // 硬貨選択のためのキーボードサポートを追加
    coinImage.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') { // EnterまたはSpaceキーをチェック
            event.preventDefault(); // Spaceキーのデフォルトのスクロール動作を防ぐ
            this.classList.toggle('selected');
        }
    });
}

// 財布を初期化する関数
// すべての硬貨に必要なクラスと動作を適用します
function initializeWallet() {
    const walletContainer = document.getElementById('payment-options');
    const coinImages = walletContainer.querySelectorAll('img');

    coinImages.forEach(coinImage => {
        coinImage.classList.add('coin'); // すべての初期コインにコインクラスを適用
        applyCoinClickBehavior(coinImage, walletContainer);
    });
}

// おつりを財布に追加する関数
// おつりの硬貨要素を作成し、財布に追加します
function addChangeToWallet(change) {
    const walletContainer = document.getElementById('payment-options');
    let remainingChange = change;

    for (const coin of COIN_VALUES) {
        const count = Math.floor(remainingChange / coin);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                const coinImage = createCoinElement(coin);
                applyCoinClickBehavior(coinImage); // 追加前に動作を適用
                walletContainer.appendChild(coinImage); // コインをDOMに追加
            }
            remainingChange %= coin;
        }
    }
}

// 支払いに使用された硬貨を財布から削除する関数
// 支払った硬貨のみを削除し、未使用の硬貨の選択状態をリセットします
function removePaidCoins() {
    const walletContainer = document.getElementById('payment-options');

    // 支払いに使用されたコインのみを削除
    paidCoins.forEach(coin => {
        if (walletContainer.contains(coin)) {
            walletContainer.removeChild(coin);
            console.log(`Removed coin: ${coin.alt}`);
        }
    });

    // コイン削除後に支払い済みコインの記録をクリア
    paidCoins = [];

    // 未払いのコインは選択状態を維持
    const remainingCoins = walletContainer.querySelectorAll('.coin');
    remainingCoins.forEach(coin => {
        if (coin.classList.contains('selected')) {
            coin.classList.remove('selected'); // 未払いコインの選択を解除
        }
    });
}

// ゲームの状態をリセットする関数
// 支払った硬貨を削除し、新しいランダムな商品を選択し、財布とUIをリセットします
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

    // 税込価格を計算して表示
    const taxRate = 0.08; // 消費税率10%
    const taxIncludedPrice = Math.round(randomItem.price * (1 + taxRate));
    // 税込価格のスタイルを調整
    const taxPriceElement = document.createElement('p');
    taxPriceElement.textContent = `（ぜいこみ: ${taxIncludedPrice}えん）`;
    taxPriceElement.style.fontSize = '0.8em'; // フォントサイズを少し小さく設定

    document.querySelector('.item-container').appendChild(taxPriceElement);

    const changeContainer = document.getElementById('change-container');
    if (changeContainer) {
        const change = parseInt(changeContainer.dataset.change, 10);
        console.log('Adding change to wallet:', change);
        addChangeToWallet(change);
        changeContainer.remove();
    }

    // 最初の硬貨にフォーカスを設定
    const firstCoin = document.querySelector('#payment-options .coin');
    if (firstCoin) {
        firstCoin.focus();
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
resetButton.addEventListener('click', function() {
    document.getElementById('pay-button').disabled = false; // リセット時に「しはらう」ボタンを再度有効にします
    // 既存の税込価格要素を削除
    const existingTaxPriceElement = document.querySelector('.item-container p:nth-of-type(3)');
    if (existingTaxPriceElement) {
        existingTaxPriceElement.remove();
    }
    resetGame();
});

// ページ読み込み時にゲームを初期化
window.addEventListener('load', resetGame);

// Ensure wallet initialization on page load
window.addEventListener('load', initializeWallet);

// トースト通知を表示する関数
// ユーザーに成功またはエラーメッセージを表示します
function showToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`; // タイプクラス（成功またはエラー）を追加
    toast.textContent = message;
    toast.setAttribute('role', 'alert'); // アクセシビリティのためにARIAロールを追加
    document.body.appendChild(toast);

    // トーストを表示
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);

    // 3秒後にトーストを非表示
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Define constants for coin values
const COIN_VALUES = [500, 100, 50, 10, 5, 1];

// 硬貨要素を作成するユーティリティ関数
// 指定された金額の硬貨を表す画像要素を返します
function createCoinElement(value) {
    const coinImage = document.createElement('img');
    coinImage.src = `images/money_${value}.png`;
    coinImage.alt = `${value}えん`;
    coinImage.classList.add('coin');
    coinImage.dataset.value = value;
    coinImage.tabIndex = 0; // キーボードナビゲーションのためにコインをフォーカス可能にします
    return coinImage;
}

// 選択された硬貨から合計支払い金額を計算するユーティリティ関数
// すべての選択された硬貨の値を合計します
function calculateTotalPayment(selectedCoins) {
    return Array.from(selectedCoins).reduce((total, coin) => total + parseInt(coin.dataset.value, 10), 0);
}

// おつりを硬貨として表示するユーティリティ関数
// おつりの硬貨要素を作成し、コンテナ要素を返します
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
