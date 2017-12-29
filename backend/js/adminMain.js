$(document).ready(() => {
    checkHash()
    window.onhashchange = checkHash;
});

function startDash() {
    $("#mainPanel").show();
}

function resetDash() {
    //Menubar reset:
    $("#nav-account").removeClass("active");
    $("#nav-logout").removeClass("active");
    $("#nav-order-scan").removeClass("active");
    $("#nav-orders").removeClass("active");
    $("#nav-customer").removeClass("active");
    $("#nav-users").removeClass("active");

    //Panel reset:
    $("#listPanel").hide();
}

function checkHash() {
    resetDash();
    if(window.location.hash) {
        let hash = window.location.hash.substring(1);
        //Startpanel...
        if(hash.startsWith("order-")) return;
        if(hash === "account") startAccount();
        if(hash === "scan") return;
        if(hash === "orders") startOrders();
        if(hash === "customer") return;
        if(hash === "users") startUsers();
    }
}