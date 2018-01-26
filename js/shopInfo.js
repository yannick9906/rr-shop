const paymentType = ["Bar","Überweisung","PayPal","Lastschrift"]
const months = ["","Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"]
const dates = ["","31.01.","28.02.","31.03.","30.04.","31.05.","30.06.","31.07.","31.08.","30.09.","31.10.","30.11.","31.12."]

function orderInfo(id) {
    document.title = "Bestellinfo - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash.substr(1);
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $("#shopHome").hide();
    $("#orderInfo").show();

    $.getJSON("backend/api/order/checkInfo.php", {orderID: id.replace('order-','')}, (data) => {
        let stateText = setStateProgress(data.state, data.nextClose);
        $("#info_orderID").html(data.orderID);
        $("#info_state").html(stateText);
        $("#info_customer").html(data.customername);
        $("#info_payment").html(paymentType[data.payment]);
    });
}

function setStateProgress(state, nextClose) {
    if (state === 0) {
        $("#orderProgress").css("width","1%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");

        $("#info_shippingDate").html("Bestellung im Monat "+months[nextClose]+" bei Zahlungseingang vor dem "+dates[nextClose]+" 19:00 CET");
        return "Bestellung aufgenommen.";
    } else if (state === 1) {
        $("#orderProgress").css("width","50%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");

        $("#info_shippingDate").html("Bestellung & Versand im Monat "+months[nextClose]+".");
        return "Bestlung bezahlt.";
    } else if(state === 2) {
        $("#orderProgress").css("width","100%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");
        $("#orderPrinting").removeClass("grey-text");
        $("#orderPrinting").removeClass("text-lighten-2");

        $("#info_shippingDate").html("Demnächst. ("+months[nextClose]+")");
        return "Bestellung bestellt und wird demnächst versendet.";
    } else if(state === 3) {
        $("#orderProgress").css("width","100%");
        $("#orderApproved").removeClass("grey-text");
        $("#orderApproved").removeClass("text-lighten-2");
        $("#orderPayed").removeClass("grey-text");
        $("#orderPayed").removeClass("text-lighten-2");
        $("#orderPrinting").removeClass("grey-text");
        $("#orderPrinting").removeClass("text-lighten-2");
        $("#orderProgress").addClass("lighten-3");

        $("#info_shippingDate").html("Versand erfolgte im "+months[nextClose]);
        return "Bestellung abgeschlossen.";
    } else {
        $("#orderProgress").css("width","100%");
        $("#orderProgress").addClass("red");
        $("#orderProgress").removeClass("black");
        return "<span class='red-text'>Bestellung storniert.</span>";
    }
}