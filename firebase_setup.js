// Firebase設定とFirestoreインスタンス作成
if (!firebase.apps.length) {
  const firebaseConfig = {
    apiKey: "AIzaSyAr7u9B-w9XXdWbEtWwwvjJhuDKDuecjmM",
    authDomain: "assembly-app-b644d.firebaseapp.com",
    projectId: "assembly-app-b644d",
    storageBucket: "assembly-app-b644d.appspot.com",
    messagingSenderId: "854507856467",
    appId: "1:854507856467:web:c028af6a65afb9a1901ca6"
  };

  firebase.initializeApp(firebaseConfig);
}

// Firestoreインスタンスを作成
window.db = firebase.firestore();

// ログイン状態の確認とページリダイレクト
firebase.auth().onAuthStateChanged((user) => {
  const currentPage = window.location.pathname;
  
  if (user) {
    console.log('ログインユーザー:', user.displayName);
    
    // もしログイン中で、ログインページにいる場合はメインページにリダイレクト
    if (currentPage === '/login.html') {
      window.location.href = 'index.html'; // ログイン成功後にメインページへ
    }
  } else {
    // 既にログインページにいない場合のみリダイレクト
    if (currentPage !== '/login.html') {
      window.location.href = 'login.html';
    }
  }
});
