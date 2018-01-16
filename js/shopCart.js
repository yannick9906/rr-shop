/**
 * Created by yanni on 2017-10-09.
 */

let cartItemTemplate = Handlebars.compile(`
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
            <div class="card-action">
                <a href="#{{{itemRef}}}">Info</a>
                <a href="#shopping-cart" class="red-text" onclick="delItem({{{itemID}}})">Entfernen</a>
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
        <div class="card-action">
            <a href="#{{{itemRef}}}">Info</a>
            <a href="#shopping-cart" class="red-text" onclick="delItem({{{itemID}}})">Entfernen</a>
        </div>
    </div>
</div>
`);

function displayCart() {
    console.log("Display Cart");
    let items = Lockr.smembers("items");
    console.log(items);
    let target = $("#cart-list");
    target.html("");
    $("#buyButton").removeClass("disabled");
    $("#clearButton").removeClass("disabled");
    let totalPrice = 0;
    for(let i = 0; i < items.length; i++) {
        if(items[i].itemType === 1) {
            target.append(cartItemTemplate({
                imageSrc:"img/hoodie/Hoodie-Back-1.jpg",
                itemID:i,
                itemRef:"hoodie",
                itemName:"RheinhessenRiders Hoodie",
                itemPrice: 28*items[i].amount,
                itemData: '<p><span class="bolden">Name auf der Front: </span>'+items[i].itemData.frontName+'</p>' +
                '<p><span class="bolden">Stadt: </span>'+cityAbbrToLong(items[i].itemData.city)+'</p>' +
                '<p><span class="bolden">Größe: </span>'+items[i].itemData.size.toUpperCase()+'</p>' +
                '<p><span class="bolden">Farbe: </span>'+items[i].itemData.color+'</p>' +
                '<p><span class="bolden">RR Insta: </span>'+items[i].itemData.insta+'</p>' +
                '<p><span class="bolden">Herzschlag: </span>'+items[i].itemData.heart+'</p>' +
                '<p><span class="bolden">RR Rechter Arm: </span>'+items[i].itemData.rightarm+'</p>' +
                '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
            }));
            totalPrice += 28*items[i].amount;
        } else if(items[i].itemType === 2) {
            target.append(cartItemTemplate({
                imageSrc:"img/shirt/Shirt-Back-"+cityAbbrToLong(items[i].itemData.city)+".jpg",
                itemID:i,
                itemRef:"shirt",
                itemName:"RheinhessenRiders Shirt",
                itemPrice: 19*items[i].amount,
                itemData: '<p><span class="bolden">Name auf der Front: </span>'+items[i].itemData.frontName+'</p>' +
                '<p><span class="bolden">Stadt: </span>'+cityAbbrToLong(items[i].itemData.city)+'</p>' +
                '<p><span class="bolden">Größe: </span>'+items[i].itemData.size.toUpperCase()+'</p>' +
                '<p><span class="bolden">Farbe: </span>'+items[i].itemData.color+'</p>' +
                '<p><span class="bolden">RR Insta: </span>'+items[i].itemData.insta+'</p>' +
                '<p><span class="bolden">Herzschlag: </span>'+items[i].itemData.heart+'</p>' +
                '<p><span class="bolden">RR Rechter Arm: </span>'+items[i].itemData.rightarm+'</p>' +
                '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
            }));
            totalPrice += 19*items[i].amount;
        } else if(items[i].itemType === 3) {
            target.append(cartItemTemplate({
                imageSrc:"img/sticker/Sticker-"+cityAbbrToLong(items[i].itemData.city)+".jpg",
                itemID:i,
                itemRef:"sticker",
                itemName:"RheinhessenRiders Sticker",
                itemPrice: 1*items[i].amount,
                itemData: '<p><span class="bolden">Größe: </span>'+items[i].itemData.size+'</p>' +
                '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
            }));
            totalPrice += 1*items[i].amount;
        }
    }
    $("#cartTotalPrice").html("Gesamt: "+totalPrice+"€ + 5€ Versand");
    if(items.length === 0) {
        target.html(`
<div style="height: 50px; "></div>
<p class="center">Der Einkaufswagen ist leer.</p>
<div style="height: 50px; "></div>
        `);
        $("#buyButton").addClass("disabled");
        $("#clearButton").addClass("disabled");
        $("#cartTotalPrice").html("Gesamt: 0€");
    }
}

function cityAbbrToLong(city) {
    if(city === "mz") return "Mainz";
    else if(city === "wi") return "Wiesbaden";
    else if(city === "az") return "Alzey";
    else if(city === "wo") return "Worms";
    else if(city === "ffm") return "Frankfurt";
    else return null;
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

function updateCartAmount() {
    $("#cartAmount").html(Lockr.smembers("items").length)
    let items = Lockr.smembers("items");
    let total = 0;

    for(let i = 0; i < items.length; i++) {
        if(items[i].itemType === 1) {
            _paq.push(['addEcommerceItem',
                "1", // (required) SKU: Product unique identifier
                "RheinhessenRiders Hoodie", // (optional) Product name
                "Clothing", // (optional) Product category, string or array of up to 5 categories
                28, // (recommended) Product price
                items[i].amount // (optional, default to 1) Product quantity
            ]);
            total += 28;
        } else if(items[i].itemType === 2) {
            _paq.push(['addEcommerceItem',
                "2", // (required) SKU: Product unique identifier
                "RheinhessenRiders Shirt", // (optional) Product name
                "Clothing", // (optional) Product category, string or array of up to 5 categories
                19, // (recommended) Product price
                items[i].amount // (optional, default to 1) Product quantity
            ]);
            total += 19;
        } else if(items[i].itemType === 3) {
            _paq.push(['addEcommerceItem',
                "3", // (required) SKU: Product unique identifier
                "RheinhessenRiders Sticker", // (optional) Product name
                "Accessories", // (optional) Product category, string or array of up to 5 categories
                1, // (recommended) Product price
                items[i].amount // (optional, default to 1) Product quantity
            ]);
            total += 1;
        }
    }
    _paq.push(['trackEcommerceCartUpdate',
        total]); // (required) Cart amount
    _paq.push(['trackPageView']);
}