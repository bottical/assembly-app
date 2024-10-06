// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

const scanHistory = [];

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('exportHistory').addEventListener('click', function() {
        const csvContent = "data:text/csv;charset=utf-8,"
            + scanHistory.map(e => `${e.completedAt},${e.setPattern.join('|')},${e.items.join('|')}`).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "scan_history.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
