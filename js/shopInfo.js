const paymentType = ["Bar","Überweisung","PayPal","Lastschrift"]
const shipmentType = ["Mainz-Lerchenberg (Yannick Félix)","Friesenheim (Philipp Lommel)"]

function orderInfo(id) {
    $("#shopHome").hide();
    $("#orderInfo").show();

    $.getJSON("backend/api/order/checkInfo.php", {orderID: id.replace('order-','')}, (data) => {
        let stateText = setStateProgress(data.state);
        $("#info_orderID").html(data.orderID);
        $("#info_state").html(stateText);
        $("#info_shippingDate").html("Bedruckung am "+data.nextClose+" Bereit ca 1 Woche später.");
        $("#info_customer").html(data.customername);
        $("#info_shippingPlace").html(shipmentType[data.shipping]);
        $("#info_payment").html(paymentType[data.payment]);
    });
}

function setStateProgress(state) {
    if (state === 0) {
        $("#orderProgress").css("width","1%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        return "Bestellung aufgenommen";
    } else if (state === 1) {
        $("#orderProgress").css("width","50%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");
        return "Bestlung bezahlt";
    } else {
        $("#orderProgress").css("width","100%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");
        $("#orderShipped").removeClass("grey-text");
        $("#orderShipped").removeClass("text-lighten-2");
        return "Bestellung abholbereit";
    }
}