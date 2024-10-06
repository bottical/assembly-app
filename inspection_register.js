// 検品セットを登録する関数
function registerSet() {
  const setName = document.getElementById('setName').value;
  const itemName = document.getElementById('itemName').value;
  const barcode = document.getElementById('barcode').value;

  if (!setName || !itemName || !barcode) {
    alert("全てのフィールドを入力してください");
    return;
  }

  const setData = {
    setName: setName,
    items: [{
      name: itemName,
      barcode: barcode,
      checked: false
    }],
    completedCount: 0
  };

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

      // 完了数表示
      const completedCountText = document.createElement('span');
      completedCountText.textContent = ` - 完了数: ${data.completedCount} / ${data.items.length}`;

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

    // 全てのアイテムの検品状態をリセット
    const resetItems = data.items.map(item => ({
      ...item,
      checked: false
    }));

    // 完了数とアイテムの状態をリセットしてFirestoreに保存
    db.collection('inspectionSets').doc(setId).update({
      completedCount: 0,
      items: resetItems
    }).then(() => {
      alert('セットがリセットされました');
      loadSetList(); // セットリストを再表示
    }).catch((error) => {
      console.error('リセットに失敗しました: ', error);
    });
  });
}

// ページ読み込み時に検品セット一覧を表示
window.onload = function() {
  loadSetList();
}
