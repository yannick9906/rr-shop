/**
 * Created by yanni on 2017-10-06.
 */

let slider1, slider2, slider3;


function hoodieDetail() {
    $("#shopHome").hide();
    $("#shopDetailHoodie").show();
    $("#breadHoodie").show();
    $("#backbutton").show();
    refreshPreview();
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
    refreshPreview();
    slider3 = $('#slider3');
    slider3.carousel({fullWidth: true, indicators: true});
    slider3.css('height', $('#slider3 .carousel-item img').height()+"px");}

function shirtDetail() {
    $("#shopHome").hide();
    $("#shopDetailShirt").show();
    $("#breadShirt").show();
    $("#backbutton").show();
    refreshPreview();
    slider2 = $('#slider2');
    slider2.carousel({fullWidth: true, indicators: true});
    slider2.css('height', $('#slider2 .carousel-item img').height()+"px");
}

function shoppingCart() {

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
    $("#backbutton").hide();
}

function refreshPreview() {
    let city = $("#citysel").val();
    let name = $("#front_name").val().toUpperCase();
    let previewBack = $("#preview-back");
    let previewFront = $("#preview-front");
    console.log(city);
    if(city === "mz") previewBack.attr('src', "img/preview/RH%20Mainz.png");
    else if(city === "az") previewBack.attr('src', "img/preview/RH%20Alzey.png");
    else if(city === "wo") previewBack.attr('src', "img/preview/RH%20Worms.png");
    else if(city === "ffm") previewBack.attr('src', "img/preview/RH%20Frankfurt.png");
    else if(city === "wi") previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");
    previewFront.html("<span>"+name+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});
}

function hoodieRefreshPrice() {
    let amount = $("#hoodieAmount").val();
    $("#hoodie_price").html(amount*30+" €")
}

function refreshPreviewShirt() {
    let city = $("#cityselShirt").val();
    let name = $("#front_name_shirt").val().toUpperCase();
    let previewBack = $("#preview-back-shirt");
    let previewFront = $("#preview-front-shirt");
    console.log(city);
    if(city === "mz") {slider2.carousel('set', 0); previewBack.attr('src', "img/preview/RH%20Mainz.png");}
    else if(city === "az") {slider2.carousel('set', 1); previewBack.attr('src', "img/preview/RH%20Alzey.png");}
    else if(city === "wo") {slider2.carousel('set', 2); previewBack.attr('src', "img/preview/RH%20Worms.png");}
    else if(city === "ffm") {slider2.carousel('set', 3); previewBack.attr('src', "img/preview/RH%20Frankfurt.png");}
    else if(city === "wi") {slider2.carousel('set', 4); previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");}
    previewFront.html("<span>"+name+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});
}

function shirtRefreshPrice() {
    let amount = $("#shirtAmount").val();
    $("#shirt_price").html(amount*19+" €")
}

function refreshPreviewSticker() {
    let city = $("#cityselSticker").val();
    let previewBack = $("#preview-back-sticker");
    console.log(city);
    if(city === "mz") {slider3.carousel('set', 0); previewBack.attr('src', "img/preview/RH%20Mainz.png");}
    else if(city === "az") {slider3.carousel('set', 1); previewBack.attr('src', "img/preview/RH%20Alzey.png");}
    else if(city === "wo") {slider3.carousel('set', 2); previewBack.attr('src', "img/preview/RH%20Worms.png");}
    else if(city === "ffm") {slider3.carousel('set', 3); previewBack.attr('src', "img/preview/RH%20Frankfurt.png");}
    else if(city === "wi") {slider3.carousel('set', 4); previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");}
}

function stickerRefreshPrice() {
    let amount = $("#stickerAmount").val();
    $("#sticker_price").html(amount*1+" €")
}

function hashChange() {
    shopHome();
    if(window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        if (hash === "hoodie") hoodieDetail();
        if (hash === "shirt") shirtDetail();
        if (hash === "sticker") stickerDetail();
        if (hash === "shopping-cart") hoodieDetail();
    }
}