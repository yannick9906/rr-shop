/**
 * Created by yanni on 2017-10-10.
 */

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


function buy() {
    document.title = "Kasse - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $("#shopHome").hide();
    $("#breadCart").show();
    $("#breadBuy").show();
    $("#backbutton").show();
    $("#buyerInfo").show();

    $('input[data-length]').characterCounter();
    $('textarea[data-length]').characterCounter();
}

function buyNow() {
    let item = {
        itemType: 4,
        amount: 1,
        price: 5,
        itemData: {}
    }
    Lockr.sadd("items", item);

    let orderData = {
        firstname: $("#first_name").val(),
        lastname: $("#last_name").val(),
        email: $("#email").val(),
        payment: $('input[name=payment]:checked').val(),
        items: JSON.stringify(Lockr.smembers("items")),
        note: $("#note").val(),
        addressStreet: $("#address-street").val(),
        addressZip: $("#address-zip").val(),
        addressCity: $("#address-city").val()
    }
    console.log(orderData);

    if(orderData.firstname != '' && orderData.lastname != '' && orderData.email != '' && orderData.payment != undefined && orderData.addressCity != '' && orderData.addressStreet != '' && orderData.addressZip != '') {

        $("#innerBuyerInfo").fadeOut(250);
        $("#buyerLoading").fadeIn(250, () => {
            $.post("backend/api/order/create.php", orderData, (data) => {
                if (JSON.parse(data).success) {
                    $("#buyerLoading").fadeOut(250);
                    $("#buyerCheck").fadeIn(250, () => {
                        window.setTimeout(() => {
                            $("#buyerCheck").hide();
                            $("#buyerSuccess").show();
                            let target = $("#cart-list-bought");
                            let items = JSON.parse(data).order.items;
                            console.log(items);
                            let price = 0;
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].itemType === 1) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/hoodie/Hoodie-Back-1-25.jpg",
                                        itemID: i,
                                        itemRef: "hoodie",
                                        itemName: "RheinhessenRiders Hoodie",
                                        itemPrice: items[i].price * items[i].amount,
                                        itemData: '<p><span class="bolden">Name auf der Front: </span>' + items[i].itemData.frontName + '</p>' +
                                        '<p><span class="bolden">Stadt: </span>'+cityAbbrToLong(items[i].itemData.city)+'</p>' +
                                        '<p><span class="bolden">Größe: </span>'+items[i].itemData.size.toUpperCase()+'</p>' +
                                        '<p><span class="bolden">Farbe: </span>'+items[i].itemData.color+'</p>' +
                                        '<p><span class="bolden">RR Insta: </span>'+items[i].itemData.insta.toUpperCase()+'</p>' +
                                        '<p><span class="bolden">Herzschlag: </span>'+items[i].itemData.heart+'</p>' +
                                        '<p><span class="bolden">RR Rechter Arm: </span>'+items[i].itemData.rightarm.toUpperCase()+'</p>' +
                                        '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
                                    }));
                                    _paq.push(['addEcommerceItem',
                                        "1", // (required) SKU: Product unique identifier
                                        "RheinhessenRiders Hoodie", // (optional) Product name
                                        "Clothing", // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                                        items[i].price, // (recommended) Product price
                                        items[i].amount // (optional, default to 1) Product quantity
                                    ]);
                                    price += items[i].price*items[i].amount;
                                } else if (items[i].itemType === 2) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/shirt/Shirt-Back-" + cityAbbrToLong(items[i].itemData.city) + ".jpg",
                                        itemID: i,
                                        itemRef: "shirt",
                                        itemName: "RheinhessenRiders Shirt",
                                        itemPrice: items[i].price * items[i].amount,
                                        itemData: '<p><span class="bolden">Name auf der Front: </span>' + items[i].itemData.frontName + '</p>' +
                                        '<p><span class="bolden">Stadt: </span>'+cityAbbrToLong(items[i].itemData.city)+'</p>' +
                                        '<p><span class="bolden">Größe: </span>'+items[i].itemData.size.toUpperCase()+'</p>' +
                                        '<p><span class="bolden">Farbe: </span>'+items[i].itemData.color+'</p>' +
                                        '<p><span class="bolden">RR Insta: </span>'+items[i].itemData.insta.toUpperCase()+'</p>' +
                                        '<p><span class="bolden">Herzschlag: </span>'+items[i].itemData.heart+'</p>' +
                                        '<p><span class="bolden">RR Rechter Arm: </span>'+items[i].itemData.rightarm.toUpperCase()+'</p>' +
                                        '<p><span class="bolden">Anzahl: </span>'+items[i].amount+'</p>'
                                    }));
                                    _paq.push(['addEcommerceItem',
                                        "2", // (required) SKU: Product unique identifier
                                        "RheinhessenRiders Shirt", // (optional) Product name
                                        "Clothing", // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                                        items[i].price, // (recommended) Product price
                                        items[i].amount // (optional, default to 1) Product quantity
                                    ]);
                                    price += items[i].price*items[i].amount;
                                } else if (items[i].itemType === 3) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/sticker/Sticker-" + cityAbbrToLong(items[i].itemData.city) + ".jpg",
                                        itemID: i,
                                        itemRef: "sticker",
                                        itemName: "RheinhessenRiders Sticker",
                                        itemPrice: 1 * items[i].amount,
                                        itemData: '<p><span class="bolden">Größe: </span>' + items[i].itemData.size + '</p>' +
                                        '<p><span class="bolden">Anzahl: </span>' + items[i].amount + '</p>'
                                    }));
                                    _paq.push(['addEcommerceItem',
                                        "3", // (required) SKU: Product unique identifier
                                        "RheinhessenRiders Sticker", // (optional) Product name
                                        "Accessories", // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                                        items[i].price, // (recommended) Product price
                                        items[i].amount // (optional, default to 1) Product quantity
                                    ]);
                                    price += items[i].price*items[i].amount;
                                } else if (items[i].itemType === 4) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/backgroundRR.jpg",
                                        itemID: i,
                                        itemRef: "",
                                        itemName: "Versandkosten",
                                        itemPrice: items[i].price * items[i].amount,
                                        itemData: ''
                                    }));
                                    price += items[i].price*items[i].amount;
                                } else if(items[i].itemType === 5) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/mug/Mug-1-pre.jpg",
                                        itemID: i,
                                        itemRef: "mug",
                                        itemName: "RheinhessenRiders Tasse",
                                        itemPrice: items[i].price * items[i].amount,
                                        itemData: '<p><span class="bolden">Name auf der Tasse: </span>' + items[i].itemData.mugName + '</p>' +
                                        '<p><span class="bolden">Stadt: </span>' + cityAbbrToLong(items[i].itemData.city) + '</p>' +
                                        '<p><span class="bolden">Farbe: </span>' + items[i].itemData.color + '</p>' +
                                        '<p><span class="bolden">Herzschlag: </span>' + items[i].itemData.heart + '</p>' +
                                        '<p><span class="bolden">Anzahl: </span>' + items[i].amount + '</p>'
                                    }));
                                    _paq.push(['addEcommerceItem',
                                        "5", // (required) SKU: Product unique identifier
                                        "RheinhessenRiders Tasse", // (optional) Product name
                                        "Accessories", // (optional) Product category. You can also specify an array of up to 5 categories eg. ["Books", "New releases", "Biography"]
                                        items[i].price, // (recommended) Product price
                                        items[i].amount // (optional, default to 1) Product quantity
                                    ]);
                                    price += items[i].price * items[i].amount;
                                }
                            }
                            clearCart();
                            _paq.push(['trackEcommerceOrder',
                                JSON.parse(data).order.orderID, // (required) Unique Order ID
                                price, // (required) Order Revenue grand total (includes tax, shipping, and subtracted discount)
                                price-5,
                                0,
                                5, // (optional) Shipping amount
                                false // (optional) Discount offered (set to false for unspecified parameter)
                            ]);
// we recommend to leave the call to trackPageView() on the Order confirmation page
                            _paq.push(['trackPageView']);
                        }, 500);
                    });
                } else {
                    $("#buyerLoading").fadeOut(250);
                    $("#buyerFail").fadeIn(250);
                }
            });
        });
    } else {
        Materialize.toast("Alle Felder müssen ausgefüllt werden.", 2000, "red");
    }
}

function resetBuy() {
    $("#innerBuyerInfo").show();
    $("#buyerLoading").hide();
    $("#buyerCheck").hide();
    $("#buyerSuccess").hide();
    $("#buyerFail").hide();
    $("#buyerInfo").hide();
}