let itemData = [];

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
    $('.modal').modal();
    $('.fixed-action-btn').floatingActionButton();
    $('.tooltipped').tooltip();
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
    resetInfo();
    resetScan();
    $("#account").hide();
    $("#orderEdit").hide();

    $(window).off('focusin', refreshInfo);
    $('body').css('background-image','none');
}

function checkHash() {
    resetDash();
    if(window.location.hash) {
        let hash = window.location.hash.substring(1);
        //Startpanel...
        if(hash.startsWith("order-")) startOrderEdit(hash);
        if(hash === "account") startAccount();
        if(hash === "scan") startScan();
        if(hash === "orders") startOrders();
        if(hash === "customers") startCustomers();
        if(hash === "users") startUsers();
    }
}