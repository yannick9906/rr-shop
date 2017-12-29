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
    $("#shopHome").hide();
    $("#breadCart").show();
    $("#breadBuy").show();
    $("#backbutton").show();
    $("#buyerInfo").show();
}

function buyNow() {
    let orderData = {
        firstname: $("#first_name").val(),
        lastname: $("#last_name").val(),
        email: $("#email").val(),
        payment: $('input[name=payment]:checked').val(),
        shipment: $('input[name=destination]:checked').val(),
        items: JSON.stringify(Lockr.smembers("items")),
        note: $("#note").val()
    }
    console.log(orderData);

    if(orderData.firstname != '' && orderData.lastname != '' && orderData.email != '' && orderData.payment != undefined && orderData.shipment != undefined) {

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
                            for (let i = 0; i < items.length; i++) {
                                if (items[i].itemType === 1) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/hoodie/Hoodie-Back-1.jpg",
                                        itemID: i,
                                        itemRef: "hoodie",
                                        itemName: "RheinhessenRiders Hoodie",
                                        itemPrice: 30 * items[i].amount,
                                        itemData: '<p><span class="bolden">Name auf der Front: </span>' + items[i].itemData.frontName + '</p>' +
                                        '<p><span class="bolden">Stadt: </span>' + cityAbbrToLong(items[i].itemData.city) + '</p>' +
                                        '<p><span class="bolden">Größe: </span>' + items[i].itemData.size.toUpperCase() + '</p>' +
                                        '<p><span class="bolden">Anzahl: </span>' + items[i].amount + '</p>'
                                    }));
                                } else if (items[i].itemType === 2) {
                                    target.append(cartItemBoughtTemplate({
                                        imageSrc: "img/shirt/Shirt-Back-" + cityAbbrToLong(items[i].itemData.city) + ".jpg",
                                        itemID: i,
                                        itemRef: "shirt",
                                        itemName: "RheinhessenRiders Shirt",
                                        itemPrice: 19 * items[i].amount,
                                        itemData: '<p><span class="bolden">Name auf der Front: </span>' + items[i].itemData.frontName + '</p>' +
                                        '<p><span class="bolden">Stadt: </span>' + cityAbbrToLong(items[i].itemData.city) + '</p>' +
                                        '<p><span class="bolden">Größe: </span>' + items[i].itemData.size.toUpperCase() + '</p>' +
                                        '<p><span class="bolden">Anzahl: </span>' + items[i].amount + '</p>'
                                    }));
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
                                }
                            }
                            clearCart();
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