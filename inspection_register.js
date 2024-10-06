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

// 登録済みの検品セットを表示する関数
function loadSetList() {
  const ul = document.getElementById('setList');
  ul.innerHTML = '';

  db.collection('inspectionSets').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.textContent = data.setName;
      link.href = `inspection_page.html?id=${doc.id}`;
      link.target = '_blank';
      li.appendChild(link);
      ul.appendChild(li);
    });
  }).catch((error) => {
    console.error('Error getting documents: ', error);
  });
}

// ページ読み込み時に検品セット一覧を表示
window.onload = function() {
  loadSetList();
}
