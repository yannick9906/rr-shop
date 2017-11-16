/**
 * Created by yanni on 2017-10-09.
 */

function refreshPreviewSticker() {
    let city = $("#cityselSticker").val();
    let previewBack = $("#preview-back-sticker");
    console.log(city);
    if(city === "mz") {/*slider3.carousel('set', 0);*/ previewBack.attr('src', "img/preview/RH%20Mainz.png");}
    else if(city === "az") {/*slider3.carousel('set', 1); */previewBack.attr('src', "img/preview/RH%20Alzey.png");}
    else if(city === "wo") {/*slider3.carousel('set', 2); */previewBack.attr('src', "img/preview/RH%20Worms.png");}
    else if(city === "ffm") {/*slider3.carousel('set', 3); */previewBack.attr('src', "img/preview/RH%20Frankfurt.png");}
    else if(city === "wi") {/*slider3.carousel('set', 4); */previewBack.attr('src', "img/preview/RH%20Wiesbaden.png");}
}

function stickerRefreshPrice() {
    let amount = $("#stickerAmount").val();
    $("#sticker_price").html(amount*1+" €")
}


function stickerAdd() {
    if($("#stickerAmount").val() && $("#cityselSticker").val() && $("#stickerSize").val()) {
        let item = {
            itemType: 3,
            amount: parseInt($("#stickerAmount").val()),
            itemData: {
                city: $("#cityselSticker").val(),
                size: $("#stickerSize").val()
            }
        }
        Lockr.sadd("items", item);
        Materialize.toast("Zum Einkaufswagen hinzugefügt", 1000, "green");
    } else {
        Materialize.toast("Bitte alle Felder ausfüllen!",2000,"red");
    }
    updateCartAmount();
}