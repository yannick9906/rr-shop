/**
 * Created by yanni on 2017-10-09.
 */

function refreshPreviewShirt() {
    let city = $("#cityselShirt").val();
    let heart = $("#shirtHeart").val();
    let color = $("#shirtColor").val();
    let name = $("#front_name_shirt").val().toUpperCase();
    let previewBack = $("#preview-back-shirt");
    let previewFront = $("#preview-front-shirt");
    let previewHeart = $("#preview-heart-shirt");
    let previewColor = $("#preview-color-shirt");
    console.log(city);
    if(city === "mz") {slider2.carousel('set', 0); previewBack.attr('src', "img/preview/RH%20Mainz.png");}
    else if(city === "az") {slider2.carousel('set', 1); previewBack.attr('src', "img/preview/RH%20Alzey.png");}
    else if(city === "wo") {slider2.carousel('set', 2); previewBack.attr('src', "img/preview/RH%20Worms.png");}
    else if(city === "ffm") {slider2.carousel('set', 3); previewBack.attr('src', "img/preview/RH%20Frankfurt.png");}
    else if(city === "wi") {slider2.carousel('set', 4); previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");}
    previewFront.html("<span>"+name+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});

    previewHeart.attr('src', "img/preview/"+heart+".png");

    previewColor.removeClass("black");
    previewColor.removeClass("white");
    previewColor.removeClass("black-text");
    previewColor.removeClass("white-text");
    previewColor.removeClass("red");
    previewColor.removeClass("yellow");
    previewColor.removeClass("green");
    previewColor.removeClass("blue");
    previewColor.removeClass("cyan");
    previewColor.removeClass("purple");

    if(color === "schwarz") previewColor.addClass("black");
    if(color === "rot") previewColor.addClass("red");
    if(color === "gelb") previewColor.addClass("yellow");
    if(color === "gruen") previewColor.addClass("green");
    if(color === "blau") previewColor.addClass("blue");
    if(color === "cyan") previewColor.addClass("cyan");
    if(color === "magenta") previewColor.addClass("purple");
    if(color === "weiss") {previewColor.addClass("white"); previewColor.addClass("black-text");}
    else previewColor.addClass("white-text");
}

function shirtRefreshPrice() {
    let amount = $("#shirtAmount").val();
    $("#shirt_price").html(amount*22+" €")
}

function shirtAdd() {
    if($("#shirtAmount").val() && $("#front_name_shirt").val() && $("#cityselShirt").val() && $("#shirtSize").val()) {
        let item = {
            itemType: 2,
            amount: parseInt($("#shirtAmount").val()),
            price: 22,
            itemData: {
                frontName: $("#front_name_shirt").val(),
                city: $("#cityselShirt").val(),
                size: $("#shirtSize").val(),
                color: $("#shirtColor").val(),
                heart: $("#shirtHeart").val(),
                insta: $("#shirtInsta").val()
            }
        }
        Lockr.sadd("items", item);
        M.toast({html: "Zum Einkaufswagen hinzugefügt", duration: 1000, classes:"green"});
    } else {
        M.toast({html: "Bitte alle Felder ausfüllen!", duration: 2000, classes:"red"});
    }
    updateCartAmount();
}