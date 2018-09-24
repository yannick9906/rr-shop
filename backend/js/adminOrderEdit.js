let orderID = "";
let orderData = "";
let orderTotal = 0;
let templateCartItemNoOptions = Handlebars.compile(`
<div class="col s12">
    <div class="card">
        <div class="card-content" id="cardContentNoOptions{{{cardID}}}2">
            <span class="card-title rr">{{displayName}}</span>
            <span class="right rr price">{{price}} €</span>
            <p><span class="bolden">Anzahl: </span>{{amount}}</p>
            
        </div>
    </div>
</div>
`);
let templateCartData = Handlebars.compile(`
{{#each itemData}}
    <p><span class="bolden">{{@key}}: </span>{{this}}</p>
{{/each}}
`);

let customerTemplate = Handlebars.compile(`
<span class="mono">
Name &nbsp;&nbsp;: {{firstname}} {{lastname}}<br/>
E-Mail : {{email}}<br/>
Adresse: {{addressStreet}},<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{addressZip}} {{addressCity}}
</span><br/>
`);

function startOrderEdit(hash) {
    orderID = hash.substr(6);
    $("#orderEdit").show();
    $("#info-action-storno-yes").hide();
    $("#info-action-storno-no").hide();
    $("#nav-orders").addClass("active");
    $("#oe-header").html("Bestellung #" + orderID + " bearbeiten");
    $(window).on('focusin', refreshInfo);
    refreshInfo();
}

function refreshInfo() {
    resetInfo();
    $.post("api/item/getItemList.php", null, (d) => {
        let items = JSON.parse(d);

        for (let i = 0; i < items.length; i++) {
            itemData[items[i].itemName] = items[i];
        }

        $.getJSON("api/order/checkInfo.php", {orderID: orderID}, (json) => {
            $("#orderjson").html(JSON.stringify(json, null, 2));
            orderData = json;
            $("#info-payment").html(paymentType[json.payment]);
            $("#info-shipping").html(shipmentType[json.shipping]);
            $("#info-customerdata").html(customerTemplate(json.customer));
            $("#info-timestamp").html(json.timestamp);
            $("#info-state").html(stateType[json.state]);
            $("#info-note").html(json.note);
            $("#info-price").html(json.totalPrice+" €")
            orderTotal = json.totalPrice

            if(json.state === 0) {
                $("#info-action-undo").hide();
                if(json.payment === 0) $("#info-action-cluster-offline").show();
                else $("#info-action-cluster-online").show();
            } else if(json.state === 1) {
                $("#info-action-payed").addClass("disabled");
                $("#info-action-cluster-waiting").show();
            } else if(json.state === 2) {
                $("#info-action-printed").addClass("disabled");
                $("#info-action-cluster-ready").show();
            } else if(json.state === 3) {
                $("#info-action-shipped").addClass("disabled");
                $("#info-action-cluster-shipment").show();
            } else if(json.state === 4) {
                $("#info-action-completed").addClass("disabled");
                $("#info-action-cluster-complete").show();
            } else if(json.state === 5) {
                $("#info-action-storno").addClass("disabled");
            }

            //Bestellung:
            let target = $("#orderData");
            target.html("");
            let itemPrice = 0;
            let shipPrice = 0;
            let cartItems = json.items;
            for (let i = 0; i < cartItems.length; i++) {
                let thisItem = itemData[cartItems[i].itemName];
                if(cartItems[i].itemType === 99) shipPrice = cartItems[i].price;
                else itemPrice += cartItems[i].price;
                target.append(templateCartItemNoOptions({
                    cardID: i,
                    displayName: thisItem.displayName,
                    imageUrl: thisItem.imageUrl,
                    price: cartItems[i].price,
                    amount: cartItems[i].amount,
                    itemName: cartItems[i].itemName
                }));
                itemDataToDisplay(cartItems[i], i, "cardContentNoOptions");
            }

            M.updateTextFields();
            $('#info-note').trigger('autoresize');
        });
    });
}

function itemDataToDisplay(item, id, nameIdentifier) {
    let displayableData = {};
    console.log(item.itemData);
    $.getJSON("api/item/getItemDetail.php",{itemName: item.itemName}, (json) => {
        let features = {};
        for(let j=0; j<json.length; j++){
            features[json[j].featureName] = json[j];
        }

        for(let i=0; i<Object.keys(item.itemData).length; i++) {
            let thisFeature = features[Object.keys(item.itemData)[i]]

            if(thisFeature.possibleValues != "*") displayableData[thisFeature.displayName] = JSON.parse(thisFeature.possibleValues)[Object.values(item.itemData)[i]];
            else displayableData[thisFeature.displayName] = Object.values(item.itemData)[i];
        }
        $("#"+nameIdentifier+id+"1").append(templateCartData({itemData: displayableData}));
        $("#"+nameIdentifier+id+"2").append(templateCartData({itemData: displayableData}));
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
    $("#info-action-shipped").removeClass("disabled");
    $("#info-action-completed").removeClass("disabled");
    $("#info-action-storno").removeClass("disabled");

    $("#info-action-cluster-complete").hide();
    $("#info-action-cluster-shipment").hide();
    $("#info-action-cluster-start-shipment").hide();
    $("#info-action-cluster-ready").hide();
    $("#info-action-cluster-waiting").hide();
    $("#info-action-cluster-offline").hide();
    $("#info-action-cluster-online").hide();
    $("#info-action-undo").show();
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
    $.post("api/order/update.php",{orderID: orderID, state: 5}, (data) => {
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
        $("#info-action-printed").html("Bestellung im Druck");
    });
}

function actionShipped() {
    $("#info-action-shipped").html("...");
    $.post("api/order/update.php",{orderID: orderID, state: 3}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Bestellung versandt.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
        $("#info-action-shipped").html("Bestellung versandt");
    });
}

function actionCompleted() {
    $("#info-action-completed").html("...");
    $.post("api/order/update.php",{orderID: orderID, state: 4}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Bestellung abgeschlossen.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
        $("#info-action-completed").html("Bestellung angeschlossen");
    });
}

function actionUndo() {
    $.post("api/order/update.php",{orderID: orderID, state: orderData.state-1}, (data) => {
        let json = JSON.parse(data);
        if(json.success) M.toast({html: "Bestellung aktualisiert.", duration: 1000, classes:"green"});
        else M.toast({html: "Es ist ein Fehler aufgetreten: "+json.error, duration: 2000, classes:"red"});
        refreshInfo();
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

function actionPayNow() {
    window.open('sumupmerchant://pay/1.0?affiliate-key=c30746eb-1964-4575-98a0-37936bd8cc0e&app-id=tk.rheinhessenriders.beta&total='+orderTotal+'&currency=EUR&title=RHEINHESSENRIDERS%20SHOP%20%2F%2F%20Bestellnummer%20'+orderID+'&receipt-email='+orderData.customer.email+'&callback=https://beta.rheinhessenriders.tk/backend/pay.html')
}

function cityAbbrToLong(city) {
    if(city === "mz") return "Mainz";
    else if(city === "wi") return "Wiesbaden";
    else if(city === "az") return "Alzey";
    else if(city === "wo") return "Worms";
    else if(city === "ffm") return "Frankfurt";
    else return null;
}
