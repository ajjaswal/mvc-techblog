let db;
// IDB DB 'budget_tracker"
const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function(event) {

    // reference to DB
    const db = event.target.result;

    // Create object store
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

request.onsuccess = function(event) {
    db = event.target.result;

    //if app is online, run uploadTransaction() 
    if (navigator.onLine) {
        uploadTransaction();
    }
};
// error logs
request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// function for saving offline data
function saveRecord(record) {

    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const  budgetObjectStore = transaction.objectStore('new_transaction');

    budgetObjectStore.add(record);
}
// upload transaction function
function uploadTransaction() {
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const budgetObjectStore = transaction.objectStore('new_transaction');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        // IDB data to api
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    const transaction = db.transaction(['new_transaction'], 'readwrite');

                    // new_transaction object store
                    const budgetObjectStore = transaction.objectStore('new_transaction');

                    // clear store
                    budgetObjectStore.clear();

                    alert('All saved transactions has been submitted!');
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}
// event listener for app launch
window.addEventListener('online', uploadTransaction);