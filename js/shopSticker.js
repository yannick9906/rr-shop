/**
 * Created by yanni on 2017-10-09.
 */

function refreshPreviewSticker() {

}

function stickerRefreshPrice() {
    let amount = $("#stickerAmount").val();
    $("#sticker_price").html(amount*1+" €")
}


function stickerAdd() {
    /*if($("#stickerAmount").val() && $("#cityselSticker").val() && $("#stickerSize").val()) {
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
    updateCartAmount();*/
}