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
    <p>完了数: ${setData.completedCount} / ${setData.items.length}</p>
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

    data.items.forEach((item) => {
      if (item.barcode === barcodeInput && !item.checked) {
        item.checked = true;
        data.completedCount++;
        found = true;
      }
    });

    if (found) {
      db.collection('inspectionSets').doc(setId).update({
        items: data.items,
        completedCount: data.completedCount
      }).then(() => {
        alert('検品完了');
        renderSetDetails(data);
      });
    } else {
      alert('バーコードが見つかりません');
    }
  });
}

// ページ読み込み時に検品セットを表示
window.onload = function() {
  loadSetDetails();
}
