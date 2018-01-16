let orderID = "";
let cartItemBoughtTemplate = Handlebars.compile(`
<div class="col s12">
    <div class="card horizontal hide-on-small-only">
        <div class="card-image" style="max-width: 35%; width: 35%;">
            <img src="{{{imageSrc}}}">
        </div>
        <div class="card-stacked">
            <div class="card-content">
                <span class="right rr price">{{itemPrice}} €</span>
                <span class="rr bigger">{{itemName}}</span>
                {{{itemData}}}
            </div>
        </div>
    </div>
    <div class="card hide-on-med-and-up">
        <div class="card-image">
            <img src="{{{imageSrc}}}">
            <span class="card-title rr">{{itemName}}</span>
        </div>
        <div class="card-content">
            <span class="right rr price">{{itemPrice}} €</span>
            {{{itemData}}}
        </div>
    </div>
</div>
`);

function startOrderEdit(hash) {
    orderID = hash.substr(6);
    $("#orderEdit").show();
    $("#info-action-storno-yes").hide();
    $("#info-action-storno-no").hide();
    $("#nav-orders").addClass("active");
    $("#oe-header").html("Bestellung #" + orderID + " bearbeiten");
    refreshInfo();
}

function refreshInfo() {
    $.getJSON("api/order/checkInfo.php", {orderID: orderID}, (json) => {
        //$("#orderData").html(JSON.stringify(json, null, 2));
        $("#info-payment").html(paymentType[json.payment]);
        $("#info-customername").html(json.customername);
        $("#info-customermail").html(json.customer.email);
        $("#info-customeraddress").html(json.customer.addressStreet+", "+json.customer.addressZip+" "+json.customer.addressCity);
        $("#info-printing").html("KW"+json.nextClose);
        $("#info-state").html(stateType[json.state]);
        $("#info-note").html(json.note);

        if(json.state === 1) {
            $("#info-action-payed").addClass("disabled");
        } else if(json.state === 2) {
            $("#info-action-payed").addClass("disabled");
            $("#info-action-printed").addClass("disabled");
        } else if(json.state === 3) {
            $("#info-action-payed").addClass("disabled");
            $("#info-action-printed").addClass("disabled");
            $("#info-action-storno").addClass("disabled");
        }

        //Bestellung:
        let items = json.items;
        let target = $("#orderData");
        let totalPrice = 0;
        target.html("");
        for(let i = 0; i < items.length; i++) {
            if(items[i].itemType === 1) {
                target.append(cartItemBoughtTemplate({
                    imageSrc:"../img/hoodie/Hoodie-Back-1.jpg",
                    itemID:i,
                    itemRef:"hoodie",
                    itemName:"RheinhessenRiders Hoodie",
                    itemPrice: items[i].price*items[i].amount,
                    itemData: '<p><span class="bolden">Name auf der Front: </span>'+items[i].itemData.frontName+'</p>' +
                    '<p><span class="bolden">Stadt: </span>'+cityAbbrToLong(items[i].itemData.city)+'</p>' +
                    '<p><span class="bolden">Größe: </span>'+items[i].itemData.size.toUpperCase()+'</p>' +
                    '<p><span class="bolden">Farbe: </span>'+items[i].itemData.color+'</p>' +
                    '<p><span class="bolden">RR Insta: </span>'+items[i].itemData.insta+'</p>' +
                    '<p><span class="bolden">Herzschlag: </span>'+items[i].itemData.heart+'</p>' +
                    '<p><span class="bolden">RR Rechter Arm: </span>'+items[i].itemData.rightarm+'</p>' +
                    '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
                }));
                totalPrice += items[i].price*items[i].amount;
            } else if(items[i].itemType === 2) {
                target.append(cartItemBoughtTemplate({
                    imageSrc:"../img/shirt/Shirt-Back-"+cityAbbrToLong(items[i].itemData.city)+".jpg",
                    itemID:i,
                    itemRef:"shirt",
                    itemName:"RheinhessenRiders Shirt",
                    itemPrice: items[i].price*items[i].amount,
                    itemData: '<p><span class="bolden">Name auf der Front: </span>'+items[i].itemData.frontName+'</p>' +
                    '<p><span class="bolden">Stadt: </span>'+cityAbbrToLong(items[i].itemData.city)+'</p>' +
                    '<p><span class="bolden">Größe: </span>'+items[i].itemData.size.toUpperCase()+'</p>' +
                    '<p><span class="bolden">Farbe: </span>'+items[i].itemData.color+'</p>' +
                    '<p><span class="bolden">RR Insta: </span>'+items[i].itemData.insta+'</p>' +
                    '<p><span class="bolden">Herzschlag: </span>'+items[i].itemData.heart+'</p>' +
                    '<p><span class="bolden">RR Rechter Arm: </span>'+items[i].itemData.rightarm+'</p>' +
                    '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
                }));
                totalPrice += items[i].price*items[i].amount;
            } else if(items[i].itemType === 3) {
                target.append(cartItemBoughtTemplate({
                    imageSrc:"../img/sticker/Sticker-"+cityAbbrToLong(items[i].itemData.city)+".jpg",
                    itemID:i,
                    itemRef:"sticker",
                    itemName:"RheinhessenRiders Sticker",
                    itemPrice: items[i].price*items[i].amount,
                    itemData: '<p><span class="bolden">Größe: </span>'+items[i].itemData.size+'</p>' +
                    '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
                }));
                totalPrice += items[i].price*items[i].amount;
            } else if (items[i].itemType === 4) {
                target.append(cartItemBoughtTemplate({
                    imageSrc: "../img/backgroundRR.jpg",
                    itemID: i,
                    itemRef: "",
                    itemName: "Versandkosten",
                    itemPrice: items[i].price * items[i].amount,
                    itemData: ''
                }));
                totalPrice += items[i].price*items[i].amount;
            }
        }
        $("#info-price").html(totalPrice+" €");
    });
}

function resetInfo() {
    $("#info-payment").html("...");
    $("#info-customername").html("...");
    $("#info-customermail").html("...");
    $("#info-customeraddress").html("...");
    $("#info-printing").html("...");
    $("#info-state").html("...");
    $("#info-note").html("...");
    $("#info-price").html("...");
    $("#info-action-payed").removeClass("disabled");
    $("#info-action-printed").removeClass("disabled");
    $("#info-action-storno").removeClass("disabled");
}


function actionStorno() {
    $("#info-action-storno").hide();
    $("#info-action-storno-yes").show();
    $("#info-action-storno-no").show();
}

function actionStornoCancel() {
    $("#info-action-storno-yes").hide();
    $("#info-action-storno-no").hide();
    $("#info-action-storno").show();
}

function actionStornoOk() {
    $("#info-action-storno-yes").hide();
    $("#info-action-storno-no").hide();
    $("#info-action-storno").show();
    $("#info-action-storno").html("...");
    $.post("api/order/update.php",{orderID: orderID, state: 3}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Bestellung storniert.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
        $("#info-action-storno").html("Bestellung storno");
    });
}

function actionPayed() {
    $("#info-action-payed").html("...");
    $.post("api/order/update.php",{orderID: orderID, state: 1}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Bestellung bezahlt.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
        $("#info-action-payed").html("Bestellung bezahlt");
    });
}

function actionPrinted() {
    $("#info-action-printed").html("...");
    $.post("api/order/update.php",{orderID: orderID, state: 2}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Bestellung im Druck.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
        $("#info-action-printed").html("Bestellung im druck");
    });
}

function actionSave() {
    $("#info-action-save").html("...");
    $.post("api/order/update.php",{orderID: orderID, note: $("#info-note").val()}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Änderungen gespeichert.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
        $("#info-action-save").html("Änderungen speichern");
    });
}

function cityAbbrToLong(city) {
    if(city === "mz") return "Mainz";
    else if(city === "wi") return "Wiesbaden";
    else if(city === "az") return "Alzey";
    else if(city === "wo") return "Worms";
    else if(city === "ffm") return "Frankfurt";
    else return null;
}
