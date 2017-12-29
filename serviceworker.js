/**
 * Created by yanni on 04.02.2017.
 */



'use strict';

self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    //console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);

    let notifAbout = JSON.parse(event.data.text());
    let title = "Something went wrong";
    let options = {
        body: 'Normally here would be a extremly important Notification. Sorry.',
        icon: '/icon/RRMainz-192.png',
        badge: '/icon/RRMobile.png'
    };
    if(notifAbout.info == "statechange") {
        if(notifAbout.orderState == 0) {
            title = notifAbout.customerName+" hat gerade eine Bestellung aufgegeben.";
            options.body = "#"+notifAbout.orderID+" für "+notifAbout.orderPrice+" €. Tippe hier für weitere Infos.";
        } else if(notifAbout.orderState == 1) {
            title = "Bezahlt: Bestellung #"+notifAbout.orderID+" von "+notifAbout.customerName+".";
            options.body = "#"+notifAbout.orderID+" für "+notifAbout.orderPrice+" €. Tippe hier für weitere Infos.";
        } else if(notifAbout.orderState == 5) {
            title = "Abholbereit: Bestellung #"+notifAbout.orderID+" von "+notifyAbout.customerName+".";
            options.body = "#"+notifAbout.orderID+" für "+notifAbout.orderPrice+" €. Tippe hier für weitere Infos.";
        }
        options.data = notifAbout.orderID;
    } else if(notifAbout.info == "custom") {
        title = notifAbout.title;
        options.body = notifAbout.body;
        options.data = "xxxxxx";
    }

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', function(event) {
    console.log('[Service Worker] Notification click Received.');

    event.notification.close();

    event.waitUntil(
        clients.openWindow('https://shop.rheinhessenriders.tk/backend/#order-'+event.notification.data)
    );
});