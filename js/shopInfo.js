const paymentType = ["Bar","Überweisung","PayPal","Lastschrift"]
const shipmentType = ["Mainz-Lerchenberg (Yannick Félix)","Friesenheim (Philipp Lommel)"]

function orderInfo(id) {
    $("#shopHome").hide();
    $("#orderInfo").show();

    $.getJSON("backend/api/order/checkInfo.php", {orderID: id.replace('order-','')}, (data) => {
        let stateText = setStateProgress(data.state);
        $("#info_orderID").html(data.orderID);
        $("#info_state").html(stateText);
        if(data.state === 0) $("#info_shippingDate").html("Bedruckung in Kalenderwoche "+data.nextClose+" bei Zahlungseingang bis diesen Sonntag 19:00 CET.");
        else $("#info_shippingDate").html("Bedruckung in Kalenderwoche "+data.nextClose+".");
        $("#info_customer").html(data.customername);
        $("#info_payment").html(paymentType[data.payment]);
    });
}

function setStateProgress(state) {
    if (state === 0) {
        $("#orderProgress").css("width","1%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        return "Bestellung aufgenommen.";
    } else if (state === 1) {
        $("#orderProgress").css("width","50%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");
        return "Bestlung bezahlt.";
    } else if(state === 2) {
        $("#orderProgress").css("width","100%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");
        $("#orderPrinting").removeClass("grey-text");
        $("#orderPrinting").removeClass("text-lighten-2");
        return "Bestellung wird bedruckt und versendet.";
    } else {
        $("#orderProgress").css("width","100%");
        $("#orderProgress").addClass("red");
        $("#orderProgress").removeClass("black");
        return "<span class='red-text'>Bestellung storniert.</span>";
    }
}