/**
 * Created by yanni on 2017-10-09.
 */

let slider1, slider2, slider3;
const names = [
    "Ranzlaube", "Gruppenzwerg", "Taschentuch", "Marcele", "Bollinator", "Nebelmaschine", "Der Ranz",
    "Ranz izz Life", "Pocketbike", "Da machste nix!", "1:30 oder 30:1 ?", "Gruppen-mechaniker", "Hoesqvarna?",
    ""
]

function hoodieDetail() {
    $("#shopHome").hide();
    $("#shopDetailHoodie").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider1 = $('#slider1');
    slider1.carousel({fullWidth: true, indicators: true});
    slider1.css('height', $('#slider1 .carousel-item img').height()+"px");
    //window.setInterval(() => slider1.carousel('next'),5000);
    let previewFront = $("#preview-front");
    let random = Math.floor(Math.random()*names.length);
    previewFront.html("<span>"+names[random]+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});
}

function stickerDetail() {
    $("#shopHome").hide();
    $("#shopDetailSticker").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider3 = $('#slider3');
    slider3.carousel({fullWidth: true, indicators: true});
    slider3.css('height', $('#slider3 .carousel-item img').height()+"px");
}

function shirtDetail() {
    $("#shopHome").hide();
    $("#shopDetailShirt").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider2 = $('#slider2');
    slider2.carousel({fullWidth: true, indicators: true});
    slider2.css('height', $('#slider2 .carousel-item img').height()+"px");
    let previewFront = $("#preview-front-shirt");
    let random = Math.floor(Math.random()*names.length);
    previewFront.html("<span>"+names[random]+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});
}

function shoppingCart() {
    $("#shopHome").hide();
    $("#shopping-cart").show();
    $("#breadCart").show();
    $("#backbutton").show();
    displayCart();
    updateCartAmount();
    resetBuy()
}

function shopHome() {
    $("#shopHome").show();
    $("#shopDetailShirt").hide();
    $("#shopDetailSticker").hide();
    $("#shopDetailHoodie").hide();
    $("#shopping-cart").hide();
    $("#buyerInfo").hide();
    $("#orderInfo").hide();
    $("#backbutton").hide();
    window.scrollTo(0,0);
    updateCartAmount();
    resetBuy()
}

function hashChange() {
    shopHome();
    updateCartAmount();
    if(window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        if (hash === "hoodie") hoodieDetail();
        if (hash === "shirt") shirtDetail();
        if (hash === "sticker") stickerDetail();
        if (hash === "shopping-cart") shoppingCart();
        if (hash === "buyerInfo") buy();
        if (hash.startsWith("order")) orderInfo(hash);
    }
}

function updateBreadCrump() {
    if (window.innerWidth <= 350 && $("#breadBuy").is(":visible")) {
        $("#breadCart").html("...");
    } else {
        $("#breadCart").html("Einkaufswagen");
    }
}