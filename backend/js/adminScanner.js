function startScan() {
    $("#orderEdit").show();
    $("#scan-panel").show();
    $("#info-action-storno-yes").hide();
    $("#info-action-storno-no").hide();
    $("#nav-order-scan").addClass("active");
    $("#scan-field").on('keyup',(e) => {
        if(e.keyCode == 13)
            scan();
    });
}

function scan() {
    orderID = $("#scan-field").val();
    $("#scan-field").val("");
    $("#oe-header").html("Bestellung #" + orderID + " bearbeiten");
    resetInfo();
    refreshInfo();
}

function resetScan() {
    $("#scan-panel").hide();
}