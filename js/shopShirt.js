/**
 * Created by yanni on 2017-10-09.
 */

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

function shirtAdd() {
    if($("#shirtAmount").val() && $("#front_name_shirt").val() && $("#cityselShirt").val() && $("#shirtSize").val()) {
        let item = {
            itemType: 2,
            amount: parseInt($("#shirtAmount").val()),
            itemData: {
                frontName: $("#front_name_shirt").val(),
                city: $("#cityselShirt").val(),
                size: $("#shirtSize").val()
            }
        }
        Lockr.sadd("items", item);
        Materialize.toast("Zum Einkaufswagen hinzugefügt", 1000, "green");
    } else {
        Materialize.toast("Bitte alle Felder ausfüllen!",2000,"red");
    }
    updateCartAmount();
}