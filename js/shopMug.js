/**
 * Created by yanni on 2018-01-25.
 */

function refreshPreviewMug() {
    let city = $("#cityselMug").val();
    let heart = $("#mugHeart").val();
    let color = $("#mugColor").val();
    let name = $("#mug_name").val().toUpperCase();
    let previewBack = $("#preview-back-mug");
    let previewFront = $("#preview-front-mug");
    let previewHeart = $("#preview-heart-mug");
    let previewColor = $("#preview-color-mug");
    console.log(city);
    if(city === "mz") previewBack.attr('src', "img/preview/RH%20Mainz.png");
    else if(city === "az") previewBack.attr('src', "img/preview/RH%20Alzey.png");
    else if(city === "wo") previewBack.attr('src', "img/preview/RH%20Worms.png");
    else if(city === "ffm") previewBack.attr('src', "img/preview/RH%20Frankfurt.png");
    else if(city === "wi") previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");
    previewFront.html("<span>"+name+"</span>");
    previewFront.textfill({maxFontPixels:50, minFontPixels:10});

    previewHeart.attr('src', "img/preview/"+heart+".png");
    if(heart==="sumo" && (name === "NAME" || name === "")) {
        $("#mug_name").val("Sumo ist Life");
        refreshPreviewMug();
    }
    mugRefreshPrice();
}

function mugRefreshPrice() {
    let amount = $("#mugAmount").val();
    let color = $("#mugColor").val();
    if(color != "weiss") $("#mug_price").html(amount*14+" €")
    else $("#mug_price").html(amount*12+" €")
}

function mugAdd() {
    if($("#mugAmount").val() && $("#mug_name").val() && $("#cityselMug").val()) {
        let item = {
            itemType: 5,
            amount: parseInt($("#mugAmount").val()),
            price: $("#mugColor").val()==="weiss" ? 12:14,
            itemData: {
                mugName: $("#mug_name").val(),
                city: $("#cityselMug").val(),
                color: $("#mugColor").val(),
                heart: $("#mugHeart").val()
            }
        }
        Lockr.sadd("items", item);
        M.toast({html: "Zum Einkaufswagen hinzugefügt", duration: 1000, classes:"green"});
    } else {
        M.toast({html: "Bitte alle Felder ausfüllen!", duration: 2000, classes:"red"});
    }
    updateCartAmount();
}