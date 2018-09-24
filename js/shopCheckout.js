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
let orderData = {};
let orderID = 0;
let securityToken = 0;
const paymentType = ["Bar / Karte","Überweisung","PayPal","Lastschrift"];
const shipmentType = ["Mitnahme am nächsten Stammtisch","Selbstabholung", "Versand nach Hause"];

function checkOut() {
    $("#shopHome").hide();
    $("#buyerInfo").show();
}

function checkoutBack() {
    $("#buyerConfirm").hide();
    $("#innerBuyerInfo").show();
}

function checkoutNext() {
    $("#innerBuyerInfo").hide();
    $("#buyerLoading").show();
    $("#infoBuyButton").addClass("disabled");

    //Collect input data
    orderData = {
        firstName: $("#infoFirstName").val(),
        lastName : $("#infoLastName").val(),
        email    : $("#infoEmail").val(),
        note     : $("#infoNote").val(),
        payment  : parseInt($('input[name=infoPayment]:checked').val()),
        shipping : parseInt($('input[name=infoShipping]:checked').val()),
        items    : JSON.stringify(Lockr.smembers("items")),
        addressStreet: $("#infoAddressStreet").val(),
        addressZip   : $("#infoAddressZip").val(),
        addressCity  : $("#infoAddressCity").val(),
        agbConfirm   : $('#infoAGBConfirm').is(':checked')
    };

    console.log(orderData);

    //Check if everything has been put in
    if(orderData.firstname !== '' && orderData.lastname !== '' && orderData.email != '' && orderData.payment != undefined && orderData.shipping != undefined && orderData.addressCity != '' && orderData.addressStreet != '' && orderData.addressZip != '' && orderData.agbConfirm) {
        //Show preview of the input data

        $("#infoConfirmName").html(orderData.firstName+" "+orderData.lastName);
        $("#infoConfirmEmail").html(orderData.email);
        $("#infoConfirmNote").html(orderData.note);
        $("#infoConfirmAddress").html(orderData.addressStreet+"<br/>"+orderData.addressZip+" "+orderData.addressCity);
        $("#infoConfirmPayment").html(paymentType[orderData.payment]);
        $("#infoConfirmShipping").html(shipmentType[orderData.shipping]);

        let cartItems = Lockr.smembers("items");
        $.post("backend/api/cart/addShipping.php", {items: JSON.stringify(cartItems), shipping: orderData.shipping}, (data) => {
            let cartItems = JSON.parse(data);
            orderData.items = JSON.stringify(cartItems);
            Lockr.rm("items");
            for (let i = 0; i < cartItems.length; i++) {
                if(cartItems[i].itemType != 99)
                Lockr.sadd("items", cartItems[i]);
            }

            let target = $("#infoConfirmList");
            target.html("");
            let itemPrice = 0;
            let shipPrice = 0;
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
            $("#infoConfirmTotalPrice").html("Gesamt: " + itemPrice + "€ + " + shipPrice + "€ Versand");

            orderData.totalPrice    = itemPrice+shipPrice;
            orderData.itemPrice     = itemPrice;
            orderData.shippingPrice = shipPrice;

            $("#buyerLoading").hide();
            $("#buyerConfirm").show();
            $("#infoBuyButton").removeClass("disabled");
        });
    } else {
        M.toast("Alle Felder müssen ausgefüllt werden.", 2000, "red");
    }
}

function checkoutBuy() {
    //Show loading
    $("#buyerConfirm").hide();
    $("#buyerLoading").show();
    //-> Send Order Post (only db creation)
    sendOrder((success) => {
        if(success || success === "true")
            $("#buyerLoading").fadeOut(250, () => {
                $("#buyerCheck").fadeIn(250);
                setTimeout(() => {
                    $("#buyerCheck").fadeOut(250, () => {
                        $("#buyerSuccess").fadeIn(250);
                    });
                },500);
            });
        else
            $("#buyerLoading").fadeOut(250, () => {
                $("#buyerFail").fadeIn(250);
            });
    });
    //Stop loading, show success or fail
    //-> Send Notification & Invoice Post if success
}

function sendOrder(callback) {
    $("#infoSuccessPaymentBar").hide();
    $("#infoSuccessPaymentTransfer").hide();
    $("#infoSuccessPaymentPayPal").hide();
    //Send Order Post
    console.log("Sending Basic Order Data...");
    $.post("backend/api/order/create.php",orderData,(data) => {
        let json = JSON.parse(data);

        //Prepare the success page before calling callback
        $("#infoSuccessOrderID").html(json.orderID);
        $("#infoSuccessOrderDate").html(json.orderDate);
        $("#infoSuccessOrderPayment").html(paymentType[orderData.payment]);
        $("#infoSuccessOrderTotalPrice").html(json.totalPrice);

        if(orderData.payment === 0) $("#infoSuccessPaymentBar").show();
        else if(orderData.payment === 1) $("#infoSuccessPaymentTransfer").show();
        else if(orderData.payment === 2) $("#infoSuccessPaymentPayPal").show();

        //Start Animation
        callback(json.success);
        console.log("Basic Order Data Response recieved.");

        //Prepare the rest.
        if(json.success || json.success === "true") {
            orderID = json.orderID;
            securityToken = json.orderNum;
            sendRest();
            clearCart();
        }
    });
}

function sendRest() {
    //Both only one time possible, security token needed.
    //Send Adminnotifications
    console.log("Sending Adminnotification Request...");
    $.getJSON("backend/api/order/notify.php",{orderID: orderID, token: securityToken},() => {

        console.log("Adminnotification Response received.");
    });

    //Send Invoice to Usermail and save
    console.log("Sending Invoice and Email Request...");
    $.getJSON("backend/api/order/invoice.php",{orderID: orderID, token: securityToken},() => {

        console.log("Invoice and Email Response received.");
    });
}