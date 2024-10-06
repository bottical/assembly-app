// Firebase設定とFirestoreインスタンス作成
if (!window.db) { // すでにdbが定義されているか確認
  const firebaseConfig = {
    apiKey: "AIzaSyAr7u9B-w9XXdWbEtWwwvjJhuDKDuecjmM",
    authDomain: "assembly-app-b644d.firebaseapp.com",
    projectId: "assembly-app-b644d",
    storageBucket: "assembly-app-b644d.appspot.com",
    messagingSenderId: "854507856467",
    appId: "1:854507856467:web:c028af6a65afb9a1901ca6"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  // Firestoreインスタンスを作成してグローバルに保存
  window.db = firebase.firestore();
}

// ログイン状態の確認
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log('ログインユーザー:', user.displayName);
    // ユーザーがログインしている場合の処理
  } else {
    // ユーザーがログインしていない場合、ログインページにリダイレクト
    window.location.href = 'login.html';
  }
});
