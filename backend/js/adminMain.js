$(document).ready(() => {
    checkHash()
    window.onhashchange = checkHash;
});

function startDash() {
    console.log("dash");
    $.getJSON("api/user/details.php?id=-1",null, (json) => {
        $("#infoUserChar").html(json.username.substr(0,1).toUpperCase())
        $("#infoUsername").html(json.username);
        $("#infoEmail").html(json.email);
    });
    $("#mainPanel").fadeIn();
    $("#welcomePanel").show();

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
    $("#welcomePanel").hide();
    $("#listPanel").hide();
    resetOrders();
    resetUsers();
    resetCustomers();
    $("#account").hide();
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
        if(hash === "customers") startCustomers();
        if(hash === "users") startUsers();
    }
}