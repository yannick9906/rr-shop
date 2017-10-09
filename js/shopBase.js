/**
 * Created by yanni on 2017-10-09.
 */

let slider1, slider2, slider3;


function hoodieDetail() {
    $("#shopHome").hide();
    $("#shopDetailHoodie").show();
    $("#breadHoodie").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider1 = $('#slider1');
    slider1.carousel({fullWidth: true, indicators: true});
    slider1.css('height', $('#slider1 .carousel-item img').height()+"px");
    window.setInterval(() => slider1.carousel('next'),5000);
}

function stickerDetail() {
    $("#shopHome").hide();
    $("#shopDetailSticker").show();
    $("#breadSticker").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider3 = $('#slider3');
    slider3.carousel({fullWidth: true, indicators: true});
    slider3.css('height', $('#slider3 .carousel-item img').height()+"px");}

function shirtDetail() {
    $("#shopHome").hide();
    $("#shopDetailShirt").show();
    $("#breadShirt").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider2 = $('#slider2');
    slider2.carousel({fullWidth: true, indicators: true});
    slider2.css('height', $('#slider2 .carousel-item img').height()+"px");
}

function shoppingCart() {
    $("#shopHome").hide();
    $("#shopping-cart").show();
    $("#breadCart").show();
    $("#backbutton").show();
    displayCart();
    updateCartAmount();
}

function shopHome() {
    $("#shopHome").show();
    $("#shopDetailShirt").hide();
    $("#shopDetailSticker").hide();
    $("#shopDetailHoodie").hide();
    $("#shopping-cart").hide();
    $("#breadHoodie").hide();
    $("#breadShirt").hide();
    $("#breadSticker").hide();
    $("#breadCart").hide();
    $("#backbutton").hide();
    updateCartAmount();
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
    }
}