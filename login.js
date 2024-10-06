// ログイン処理
function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // ログイン成功時の処理
      const user = userCredential.user;
      console.log('ログイン成功:', user); // ログイン後のユーザー情報を確認
      window.location.href = 'index.html'; // ログイン後にメインページにリダイレクト
    })
    .catch((error) => {
      const errorMessage = error.message;
      document.getElementById('loginError').textContent = errorMessage;
    });
}

// ログアウト処理
function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log('ログアウト成功');
      window.location.href = 'login.html'; // ログアウト後にログインページにリダイレクト
    })
    .catch((error) => {
      console.error('ログアウト中にエラーが発生しました:', error);
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
