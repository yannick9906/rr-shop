/**
 * Created by yanni on 2017-10-09.
 */
let currentUrl = location.href;
let slider1, slider2, slider3;
const names = [
    "Ranzlaube", "Gruppenzwerg", "Taschentuch", "Marcele", "Bollinator", "Nebelmaschine", "Der Ranz",
    "Ranz izz Life", "Pocketbike", "Da machste nix!", "1:30 oder 30:1 ?", "Gruppen-mechaniker", "Hoesqvarna?",
    ""
]

function hoodieDetail() {
    document.title = "RR Hoodie - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $("#shopHome").hide();
    $("#shopDetailHoodie").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider1 = $('#slider1');
    slider1.carousel({fullWidth: true, indicators: true});
    slider1.css('height', $('#slider1 .carousel-item img').height()+"px");
    //window.setInterval(() => slider1.carousel('next'),5000);
    let previewFront = $("#preview-front");
    let random = Math.floor(Math.random()*names.length);
    previewFront.html("<span>"+names[random]+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});
    $("select").select();

    _paq.push(['setEcommerceView',
        "1", // (required) SKU: Product unique identifier
        "RheinhessenRiders Hoodie", // (optional) Product name
        "Clothing", // (optional) Product category, or array of up to 5 categories
        28 // (optional) Product Price as displayed on the page
    ]);
    _paq.push(['trackPageView']);
}

function stickerDetail() {
    /*
    document.title = "RR Sticker - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash.substr(1);
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $("#shopHome").hide();
    $("#shopDetailSticker").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider3 = $('#slider3');
    slider3.carousel({fullWidth: true, indicators: true});
    slider3.css('height', $('#slider3 .carousel-item img').height()+"px");

    _paq.push(['setEcommerceView',
        "3", // (required) SKU: Product unique identifier
        "RheinhessenRiders Sticker", // (optional) Product name
        "Accessories", // (optional) Product category, or array of up to 5 categories
        1 // (optional) Product Price as displayed on the page
    ]);
    _paq.push(['trackPageView']);
    */
}

function shirtDetail() {
    document.title = "RR Shirt - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $("#shopHome").hide();
    $("#shopDetailShirt").show();
    $("#backbutton").show();
    refreshPreviewHoodie();
    slider2 = $('#slider2');
    slider2.carousel({fullWidth: true, indicators: true});
    slider2.css('height', $('#slider2 .carousel-item img').height()+"px");
    let previewFront = $("#preview-front-shirt");
    let random = Math.floor(Math.random()*names.length);
    previewFront.html("<span>"+names[random]+"</span>");
    previewFront.textfill({maxFontPixels:100, minFontPixels:10});

    _paq.push(['setEcommerceView',
        "2", // (required) SKU: Product unique identifier
        "RheinhessenRiders Shirt", // (optional) Product name
        "Clothing", // (optional) Product category, or array of up to 5 categories
        19 // (optional) Product Price as displayed on the page
    ]);
    _paq.push(['trackPageView']);
}

function shoppingCart() {
    document.title = "Einkaufswagen - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $("#shopHome").hide();
    $("#shopping-cart").show();
    $("#breadCart").show();
    $("#backbutton").show();
    displayCart();
    updateCartAmount();
    resetBuy()
}

function shopHome() {
    document.title = "Home - RheinhessenRiders Shop";
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = '' + window.location.hash;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', document.title]);

    // remove all previously assigned custom variables, requires Piwik 3.0.2
    _paq.push(['deleteCustomVariables', 'page']);
    _paq.push(['setGenerationTimeMs', 0]);
    _paq.push(['trackPageView']);

    $.post("backend/api/accesscodecheck.php",{accesscode: Cookies.get("accesscode")}, (data) => {
        let json = JSON.parse(data);

        $("#shopDetailShirt").hide();
        $("#shopDetailSticker").hide();
        $("#shopDetailHoodie").hide();
        $("#shopping-cart").hide();
        $("#buyerInfo").hide();
        $("#orderInfo").hide();
        $("#backbutton").hide();
        $("#cart-list-bought").html("");
        window.scrollTo(0, 0);
        updateCartAmount();
        resetBuy()
        if (json.success == "true") {
            $("#shopHome").show();
            $("#shoppingcartbtn").show();
            $("#shopCode").hide();
            hashChangeCallback();
        } else {
            $("#shopHome").hide();
            $("#shoppingcartbtn").hide();
            $("#shopCode").show();
        }
    });
}

function hashChange() {
    shopHome();
    //shopClosed();
}

function hashChangeCallback() {
    if(window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        if (hash === "hoodie") hoodieDetail();
        if (hash === "shirt") shirtDetail();
        if (hash === "sticker") stickerDetail();
        if (hash === "shopping-cart") shoppingCart();
        if (hash === "buyerInfo") buy();
        if (hash.startsWith("order")) orderInfo(hash);
    }
}

function updateBreadCrump() {
    if (window.innerWidth <= 350 && $("#breadBuy").is(":visible")) {
        $("#breadCart").html("...");
    } else {
        $("#breadCart").html("Einkaufswagen");
    }
}

function shopClosed() {
    $.post("backend/api/accesscodecheck.php",{accesscode: Cookies.get("beta")}, (data) => {
        let json = JSON.parse(data);
        if (json.success) {
            $("#shoppingcartbtn").show();
            $("#shopClosed").hide();
            shopHome();
            if(window.location.hash) {
                var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
                if (hash === "hoodie") hoodieDetail();
                if (hash === "shirt") shirtDetail();
                if (hash === "sticker") stickerDetail();
                if (hash === "shopping-cart") shoppingCart();
                if (hash === "buyerInfo") buy();
                if (hash.startsWith("order")) orderInfo(hash);
            }
        } else {
            shopHome();
            $("#shopHome").hide();
            $("#shoppingcartbtn").hide();
        }
    });
}

function checkCode(e) {
    let code = $("#betacode").val();
    Cookies.set("beta", md5(code), {expires: 31});
    //shopClosed();
}

function checkAccessCode() {
    let code = $("#accesscode").val();
    Cookies.set("accesscode", md5(code), {expires: 90});
    shopHome();
}