const applicationServerPublicKey = 'BJZ30iSUhLT5YjckHLSsNL7Hob59SUcziRoEJM8PhuftnHqtSAYJLY81D7l5hFz27HRxkXJfBZABMAgNwo35Ibw=';
const pushSwitch = $("#acc-pushswitch");
const pushSwitchLabel = $("#acc-pushswitchlabel");

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('../serviceworker.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);

            swRegistration = swReg;
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
    pushSwitchLabel.html('Push Not Supported');
}

function startAccount() {
    $("#account").show();
    pushSwitch.on("click", () => {
        pushSwitch.disabled = true;
        if (isSubscribed) {
            // TODO: Unsubscribe user
        } else {
            subscribeUser();
        }
    });

    swRegistration.pushManager.getSubscription()
        .then(function(subscription) {
            isSubscribed = !(subscription === null);

            if (isSubscribed) {
                console.log('User IS subscribed.');
                pushSwitch.prop("checked", true);
            } else {
                updateSubscriptionOnServer(subscription);
                console.log('User is NOT subscribed.');
            }

            updateBtn();
        });
}

function subscribeUser() {
    const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
    swRegistration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: applicationServerKey
    })
        .then(function(subscription) {
            console.log('User is subscribed.');

            updateSubscriptionOnServer(subscription);

            isSubscribed = true;

            updateBtn();
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
            updateBtn();
        });
}

function updateBtn() {
    if (Notification.permission === 'denied') {
        pushSwitchLabel.html('Push Messaging Blocked.');
        pushSwitch.disabled = true;
        updateSubscriptionOnServer(null);
        return;
    }

    if (isSubscribed) {
        pushSwitchLabel.html('Benarichtigungen deaktivieren');
    } else {
        pushSwitchLabel.html('Benarichtigungen aktivieren');
    }

    pushSwitch.disabled = false;
}

function updateSubscriptionOnServer(subscription) {
    if(subscription) {
        $.post("api/user/setPush.php",{endpoint: JSON.stringify(subscription)},function(data) {
            let title = "Push Benachrichtigung";
            let options = {
                body: 'Aktiviere Push-Benachrichtigungen...',
                icon: '../icon/RRMainz-192.png',
                badge: '../icon/RRMobile.png'
            };
            let n = swRegistration.showNotification(title, options);
            setTimeout(() => {
                n.close();
            }, 4000);
        });
    }
}
