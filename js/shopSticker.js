/**
 * Created by yanni on 2017-10-09.
 */

function refreshPreviewSticker() {

}

function stickerRefreshPrice() {
    let amount = $("#stickerAmount").val();
    $("#sticker_price").html(amount*0.2+" €*")
}


function stickerAdd() {
    if($("#stickerAmount").val() && $("#stickerType").val()) {
        let item = {
            itemType: 3,
            amount: parseInt($("#stickerAmount").val()),
            price: 0.2,
            itemData: {
                type: $("#stickerType").val()
            }
        }
        Lockr.sadd("items", item);
        M.toast({html: "Zum Einkaufswagen hinzugefügt", duration: 1000, classes:"green"});
    } else {
        M.toast({html: "Bitte alle Felder ausfüllen!", duration: 2000, classes:"red"});
    }
    updateCartAmount();
}