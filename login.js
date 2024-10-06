// ログイン処理
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // ログイン成功時の処理
      closePopup(); // ポップアップを閉じる
      console.log('ログイン成功:', userCredential.user);
    })
    .catch((error) => {
      // エラー処理
      const errorMessage = error.message;
      document.getElementById('loginError').textContent = errorMessage;
    });
}

// ポップアップを開く関数
function openPopup() {
  document.getElementById('loginPopup').style.display = 'block';
}

// ポップアップを閉じる関数
function closePopup() {
  document.getElementById('loginPopup').style.display = 'none';
}
