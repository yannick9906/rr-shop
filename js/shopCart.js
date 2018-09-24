let templateCartItem = Handlebars.compile(`
<div class="col s12">
    <div class="card horizontal hide-on-small-only">
        <div class="card-image" style="max-width: 35%; width: 35%;">
            <img src="{{{imageUrl}}}">
        </div>
        <div class="card-stacked">
            <div class="card-content" id="cardContent{{{cardID}}}1">
                <span class="right rr price">{{price}} €</span>
                <span class="rr bigger">{{displayName}}</span>
                <p><span class="bolden">Anzahl: </span>{{amount}}</p>

            </div>
            <div class="card-action">
                <a href="#{{{itemName}}}">Info</a>
                <a href="#shopping-cart" class="red-text" onclick="delItem({{{cardID}}})">Entfernen</a>
            </div>
        </div>
    </div>
    <div class="card hide-on-med-and-up">
        <div class="card-image">
            <img src="{{{imageUrl}}}">
            <span class="card-title rr">{{displayName}}</span>
        </div>
        <div class="card-content" id="cardContent{{{cardID}}}2">
            <span class="right rr price">{{price}} €</span>
            <p><span class="bolden">Anzahl: </span>{{amount}}</p>
            
        </div>
        <div class="card-action">
            <a href="#{{{itemName}}}">Info</a>
            <a href="#shopping-cart" class="red-text" onclick="delItem({{{cardID}}})">Entfernen</a>
        </div>
    </div>
</div>
`);

let templateCartData = Handlebars.compile(`
{{#each itemData}}
    <p><span class="bolden">{{@key}}: </span>{{this}}</p>
{{/each}}
`);

function displayCart() {
    console.log("Check Cart");
    let cartItems = Lockr.smembers("items");
    $.post("backend/api/cart/checkCart.php", {items: JSON.stringify(cartItems)}, (data) => {
        items = JSON.parse(data);
        Lockr.rm("items");
        for(let i = 0; i < items.length; i++) {
            Lockr.sadd("items", items[i]);
        }
        console.log("Display Cart");
        console.log(cartItems);
        let target = $("#cart-list");
        target.html("");
        $("#buyButton").removeClass("disabled");
        $("#clearButton").removeClass("disabled");
        let totalPrice = 0;
        let shipping = 0;
        for(let i = 0; i < cartItems.length; i++) {
            let thisItem = itemData[cartItems[i].itemName];
            totalPrice += cartItems[i].price;
            target.append(templateCartItem({
                cardID: i,
                displayName: thisItem.displayName,
                imageUrl: thisItem.imageUrl,
                price: cartItems[i].price,
                amount: cartItems[i].amount * thisItem.baseAmount,
                itemName: cartItems[i].itemName
            }));
            itemDataToDisplay(cartItems[i], i, "cardContent");
        }
        $("#cartTotalPrice").html("Gesamt: "+totalPrice+"€ + "+shipping+"€ Versand");


        if(cartItems.length === 0) {
            target.html(`
<div style="height: 50px; "></div>
<p class="center">Der Einkaufswagen ist leer.</p>
<div style="height: 50px; "></div>
        `);
            $("#buyButton").addClass("disabled");
            $("#clearButton").addClass("disabled");
            $("#cartTotalPrice").html("Gesamt: 0€");
        }
    });
}

function itemDataToDisplay(item, id, nameIdentifier) {
    let displayableData = {};
    console.log(item.itemData);
    $.getJSON("backend/api/item/getItemDetail.php",{itemName: item.itemName}, (json) => {
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

function updateCartAmount() {
    $("#cartAmount").html(Lockr.smembers("items").length);
    let items = Lockr.smembers("items");

    //TODO eCommerce Tracking
}

function delItem(itemID) {
    let items = Lockr.smembers("items");
    Lockr.rm("items");
    for(let i = 0; i < items.length; i++) {
        if(i !== itemID) Lockr.sadd("items", items[i]);
    }
    displayCart();
    updateCartAmount();
}

function clearCart() {
    Lockr.rm("items");
    displayCart();
    updateCartAmount();
}

function shopCart() {
    $("#shopHome").hide();
    $("#shopCart").show();
    $("#breadCart").show();
    $("#backbutton").show();
    displayCart();
}