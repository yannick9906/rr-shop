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
        M.toast({html: "Zum Einkaufswagen hinzugefügt", duration: 1000, classes:"green"});
    } else {
        M.toast({html: "Bitte alle Felder ausfüllen!", duration: 2000, classes:"red"});
    }
    updateCartAmount();*/
}