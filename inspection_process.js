// URLからセットIDを取得する関数
function getSetIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Firestoreから検品セットのデータを読み込む関数
function loadSetDetails() {
  const setId = getSetIdFromURL();
  if (!setId) {
    console.error('セットIDが指定されていません。');
    return;
  }

  db.collection('inspectionSets').doc(setId).get().then((doc) => {
    if (doc.exists) {
      const data = doc.data();
      renderSetDetails(data);
    } else {
      console.error('指定されたセットが存在しません。');
    }
  }).catch((error) => {
    console.error('データ取得に失敗しました: ', error);
  });
}

// 検品セットの詳細を表示する関数
function renderSetDetails(setData) {
  const setDetailsElement = document.getElementById('setDetails');
  setDetailsElement.innerHTML = ''; // 前回のデータをクリア

  const itemList = setData.items.map(item => `
    <li class="item ${item.checked ? 'checked' : ''}">
      <span>${item.name}</span>
      <span class="barcode">${item.barcode}</span>
    </li>
  `).join('');

  setDetailsElement.innerHTML = `
    <h2>検品セット: ${setData.setName}</h2>
    <ul class="item-list">${itemList}</ul>
  `;
}

// バーコードを検品する関数
function checkBarcode() {
  const barcodeInput = document.getElementById('barcodeInput').value.trim();
  const setId = getSetIdFromURL(); // URLからセットIDを取得

  db.collection('inspectionSets').doc(setId).get().then((doc) => {
    const data = doc.data();
    let found = false;

    // 各アイテムのバーコードを検品
    data.items.forEach((item) => {
      if (item.barcode === barcodeInput && !item.checked) {
        item.checked = true; // 検品完了をマーク
        found = true;
      }
    });

    // UIを更新してフォームをクリア
    renderSetDetails(data);
    document.getElementById('barcodeInput').value = ''; // フォームを空にする

    // すべてのアイテムが検品されたかを確認
    if (found) {
      db.collection('inspectionSets').doc(setId).update({
        items: data.items
      }).then(() => {
        // 検品完了、次の検品に進むかどうかはポップアップを表示せず、UIでフィードバック
        const allChecked = data.items.every(item => item.checked);
        if (allChecked) {
          db.collection('inspectionSets').doc(setId).update({
            completedCount: firebase.firestore.FieldValue.increment(1),
            items: data.items.map(item => ({ ...item, checked: false })) // 検品状態リセット
          }).then(() => {
            loadSetDetails(); // 次回検品用にリストをリセット
          });
        }
      });
    } else {
      document.getElementById('errorMessage').textContent = 'バーコードが見つかりませんでした。';
    }
  });
}

// ページ読み込み時に検品セットを表示
window.onload = function() {
  loadSetDetails();

  // Enterキーでバーコードを入力できるように設定
  document.getElementById('barcodeInput').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault(); // Enterキーのデフォルト動作を防ぐ
      checkBarcode(); // Enterキーでバーコード検品を実行
    }
  });
}
