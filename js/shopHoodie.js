/**
 * Created by yanni on 2017-10-09.
 */

function refreshPreviewHoodie() {
    let city = $("#citysel").val();
    let heart = $("#hoodieHeart").val();
    let color = $("#hoodieColor").val();
    let name = $("#front_name").val().toUpperCase();
    let previewBack = $("#preview-back");
    let previewFront = $("#preview-front");
    let previewHeart = $("#preview-heart");
    let previewColor = $("#preview-color");
    console.log(city);
    if(city === "mz") previewBack.attr('src', "img/preview/RH%20Mainz.png");
    else if(city === "az") previewBack.attr('src', "img/preview/RH%20Alzey.png");
    else if(city === "wo") previewBack.attr('src', "img/preview/RH%20Worms.png");
    else if(city === "ffm") previewBack.attr('src', "img/preview/RH%20Frankfurt.png");
    else if(city === "wi") previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");
    previewFront.html("<span>"+name+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});

    previewHeart.attr('src', "img/preview/"+heart+".png");
    if(heart==="sumo" && (name === "NAME" || name === "")) {
        $("#front_name").val("Sumo ist Life");
        refreshPreviewHoodie();
    }

    previewColor.removeClass("black");
    previewColor.removeClass("indigo darken-4");
    previewColor.removeClass("black-text");
    previewColor.removeClass("white-text");
    previewColor.removeClass("red");
    previewColor.removeClass("yellow");
    previewColor.removeClass("green");
    previewColor.removeClass("blue");
    previewColor.removeClass("cyan");
    previewColor.removeClass("purple");

    if(color === "schwarz") previewColor.addClass("black");
    if(color === "natoblau") previewColor.addClass("indigo darken-4");
    if(color === "gelb") previewColor.addClass("yellow");
    if(color === "gruen") previewColor.addClass("green");
    if(color === "blau") previewColor.addClass("blue");
    if(color === "cyan") previewColor.addClass("cyan");
    if(color === "magenta") previewColor.addClass("purple");
    if(color === "weiss") {previewColor.addClass("white"); previewColor.addClass("black-text");}
    else previewColor.addClass("white-text");

}

function hoodieRefreshPrice() {
    let amount = $("#hoodieAmount").val();
    let RRtext = $("#hoodieRightArm").val();
    if(RRtext === "JA") $("#hoodie_price").html(amount*35+" €")
    else $("#hoodie_price").html(amount*33+" €")
}

function hoodieAdd() {
    if($("#hoodieAmount").val() && $("#front_name").val() && $("#citysel").val() && $("#hoodieSize").val()) {
        let item = {
            itemType: 1,
            amount: parseInt($("#hoodieAmount").val()),
            price: $("#hoodieRightArm").val()==="JA" ? 35:33,
            itemData: {
                frontName: $("#front_name").val(),
                city: $("#citysel").val(),
                size: $("#hoodieSize").val(),
                color: $("#hoodieColor").val(),
                heart: $("#hoodieHeart").val(),
                insta: $("#hoodieInsta").val(),
                rightarm: $("#hoodieRightArm").val()
            }
        }
        Lockr.sadd("items", item);
        M.toast({html: "Zum Einkaufswagen hinzugefügt", duration: 1000, classes:"green"});
    } else {
        M.toast({html: "Bitte alle Felder ausfüllen!", duration: 2000, classes:"red"});
    }
    updateCartAmount();
}