/**
 * Created by yanni on 2017-10-10.
 */

function buy() {
    $("#shopHome").hide();
    $("#breadCart").show();
    $("#breadBuy").show();
    $("#backbutton").show();
    $("#buyerInfo").show();
}

function buyNow() {
    let orderData = {
        firstname: $("#first_name").val(),
        lastname: $("#last_name").val(),
        email: $("#email").val(),
        payment: $('input[name=payment]:checked').val(),
        shipment: $('input[name=destination]:checked').val()
    }
    console.log(orderData);

    $("#innerBuyerInfo").fadeOut(250);
    $("#buyerLoading").fadeIn(250, () => {
        $.post("backend/api/order/create.php",orderData,(data) => {
            if (JSON.parse(data).success) {
                $("#buyerLoading").fadeOut(250);
                $("#buyerCheck").fadeIn(250, () => {
                    window.setTimeout(() => {
                        $("#buyerCheck").hide();
                        $("#buyerSuccess").show();
                    }, 500);
                });
            } else {
                $("#buyerLoading").fadeOut(250);
                $("#buyerFail").fadeIn(250);
            }
        });
    });
}