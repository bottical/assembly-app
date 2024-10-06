// アイテムを追加するためのフォームを動的に追加する関数
function addItem() {
  const itemContainer = document.getElementById('itemContainer');
  
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');

  itemDiv.innerHTML = `
    <label for="itemName">アイテム名:</label>
    <input type="text" name="itemName" placeholder="アイテム名">
    <label for="barcode">バーコード:</label>
    <input type="text" name="barcode" placeholder="バーコード">
  `;

  itemContainer.appendChild(itemDiv);
}

// 検品セットを登録する関数（複数のアイテムとバーコードを一つのセットとして登録）
function registerSet() {
  const setName = document.getElementById('setName').value;
  const items = [];
  
  // 各アイテム名とバーコードを取得してitems配列に追加
  document.querySelectorAll('#itemContainer .item').forEach(itemDiv => {
    const itemName = itemDiv.querySelector('input[name="itemName"]').value;
    const barcode = itemDiv.querySelector('input[name="barcode"]').value;
    
    if (itemName && barcode) {
      items.push({
        name: itemName,
        barcode: barcode,
        checked: false // 検品未完了状態で初期化
      });
    }
  });

  if (!setName || items.length === 0) {
    alert("セット名と少なくとも1つのアイテムを登録してください");
    return;
  }

  const setData = {
    setName: setName,
    items: items,
    completedCount: 0 // 完了した回数を記録
  };

  // Firestoreにセットを登録
  db.collection('inspectionSets').add(setData).then(() => {
    alert('セットが登録されました');
    loadSetList(); // セット一覧を更新
  }).catch((error) => {
    console.error('Error adding document: ', error);
  });
}

// 登録済みの検品セット一覧を表示する関数
function loadSetList() {
  const ul = document.getElementById('setList');
  ul.innerHTML = '';

  db.collection('inspectionSets').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement('li');
      
      // セット名リンクを作成
      const link = document.createElement('a');
      link.textContent = data.setName;
      link.href = `inspection_page.html?id=${doc.id}`;
      link.target = '_blank';

      // 完了数表示（母数なし）
      const completedCountText = document.createElement('span');
      completedCountText.textContent = ` - 完了回数: ${data.completedCount}`;

      // リセットボタンを作成
      const resetButton = document.createElement('button');
      resetButton.textContent = 'リセット';
      resetButton.style.marginLeft = '10px'; // ボタンのスペースを調整
      resetButton.onclick = function() {
        resetSet(doc.id); // リセットボタンがクリックされたときの動作
      };

      // liにセット名、完了数、リセットボタンを追加
      li.appendChild(link);
      li.appendChild(completedCountText);
      li.appendChild(resetButton);
      ul.appendChild(li);
    });
  }).catch((error) => {
    console.error('Error getting documents: ', error);
  });
}

// セットをリセットする関数
function resetSet(setId) {
  db.collection('inspectionSets').doc(setId).get().then((doc) => {
    const data = doc.data();

    // アイテムの検品状態をすべてリセット
    const resetItems = data.items.map(item => ({
      ...item,
      checked: false // 検品状態をリセット
    }));

    // 完了数とアイテムの状態をリセットしてFirestoreに保存
    db.collection('inspectionSets').doc(setId).update({
      completedCount: 0, // 完了数をリセット
      items: resetItems  // アイテムの検品状態をリセット
    }).then(() => {
      alert('セットがリセットされました');
      loadSetList(); // セットリストを再表示
    }).catch((error) => {
      console.error('リセットに失敗しました: ', error);
    });
  }).catch((error) => {
    console.error('セットの取得に失敗しました: ', error);
  });
}

// ページ読み込み時に検品セット一覧を表示
window.onload = function() {
  loadSetList();
}
