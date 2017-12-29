/**
 * Created by yanni on 2017-10-09.
 */

function refreshPreviewHoodie() {
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

function hoodieAdd() {
    if($("#hoodieAmount").val() && $("#front_name").val() && $("#citysel").val() && $("#hoodieSize").val()) {
        let item = {
            itemType: 1,
            amount: parseInt($("#hoodieAmount").val()),
            itemData: {
                frontName: $("#front_name").val(),
                city: $("#citysel").val(),
                size: $("#hoodieSize").val()
                //color: $("#hoodieColor").val()
            }
        }
        Lockr.sadd("items", item);
        Materialize.toast("Zum Einkaufswagen hinzugefügt", 1000, "green");
    } else {
        Materialize.toast("Bitte alle Felder ausfüllen!",2000,"red");
    }
    updateCartAmount();
}