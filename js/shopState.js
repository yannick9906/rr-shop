function orderInfo(hash) {
    let orderID = hash.substr(6);
    let state0 = $("#state0");
    let state1 = $("#state1");
    let state2 = $("#state2");
    let state3 = $("#state3");
    let state4 = $("#state4");
    let state5 = $("#state5");
    let state6 = $("#state6");
    let stateN = $("#stateN");

    state0.addClass("grey-text bolden");
    state1.addClass("grey-text bolden");
    state2.addClass("grey-text bolden");
    state3.addClass("grey-text bolden");
    state4.addClass("grey-text bolden");
    state5.addClass("grey-text bolden");
    state6.addClass("grey-text bolden");
    state0.removeClass("green-text");
    state1.removeClass("green-text");
    state2.removeClass("green-text");
    state3.removeClass("green-text");
    state4.removeClass("green-text");
    state5.removeClass("green-text");
    state6.removeClass("green-text");
    stateN.hide();
    state5.hide();

    $("#shopHome").hide();
    $.getJSON("backend/api/order/checkInfo.php",{orderID: orderID}, (json) => {
        console.log(json);
        $("#stateTotal").html("Gesamt: "+json.totalPrice+"€");
        $("#stateID").html("Bestellstatus Bestellung #"+json.orderID);
        $("#stateInfoName").html(json.customername);
        $("#stateInfoShip").html(shipmentType[parseInt(json.shipping)]);
        $("#stateInfoPaym").html(paymentType[parseInt(json.payment)]);
        $("#stateInfoDate").html(json.timestamp);
        $("#stateInfoAmou").html(json.items.length-1+" Positionen");

        switch(json.state) {
            case 6:
                state6.removeClass("grey-text");
                state5.removeClass("bolden");
                state6.addClass("green-text");
            case 5:
                state5.removeClass("grey-text");
                state4.removeClass("bolden");
                state4.hide();
                state5.show();
                state5.addClass("green-text");
            case 4:
                state4.removeClass("grey-text");
                state3.removeClass("bolden");
                state4.addClass("green-text");
            case 3:
                state3.removeClass("grey-text");
                state2.removeClass("bolden");
                state3.addClass("green-text");
            case 2:
                state2.removeClass("grey-text");
                state1.removeClass("bolden");
                state2.addClass("green-text");
            case 1:
                state1.removeClass("grey-text");
                state0.removeClass("bolden");
                state1.addClass("green-text");
            case 0:
                state0.removeClass("grey-text");
                state0.addClass("green-text");
                break;
            case -1:
                stateN.show();
                state0.removeClass("bolden");
                state0.removeClass("grey-text");
                state0.addClass("green-text");
                break;
        }

        $("#shopState").show();
    });
}