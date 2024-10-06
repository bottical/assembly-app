// Firebase configuration
const firebaseConfigInspection = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const appInspection = firebase.initializeApp(firebaseConfigInspection);
const databaseInspection = firebase.database();

document.addEventListener('DOMContentLoaded', function() {
    const setPatterns = {
        set1: ['商品A', '商品B', '商品C'],
        set2: ['商品D', '商品E', '商品F']
    };

    let currentSet = [];
    let completedSets = 0;
    const scannedItems = new Set();

    document.getElementById('barcodeInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const barcode = event.target.value.trim();
            if (currentSet.includes(barcode) && !scannedItems.has(barcode)) {
                scannedItems.add(barcode);
                const listItem = document.createElement('li');
                listItem.textContent = barcode;
                listItem.classList.add('list-group-item');
                document.getElementById('barcodeList').appendChild(listItem);
                event.target.value = '';

                if (scannedItems.size === currentSet.length) {
                    document.getElementById('completionMessage').style.display = 'block';
                    completedSets++;
                    document.getElementById('setCount').textContent = completedSets;

                    // Save to Firebase DB
                    const timestamp = new Date().toISOString();
                    const historyEntry = {
                        setPattern: currentSet,
                        completedAt: timestamp,
                        items: Array.from(scannedItems)
                    };
                    firebase.database().ref('scanHistory').push(historyEntry);
                }
            }
        }
    });
});
