let currentUrl = location.href;
const names = [
    "Ranzlaube", "Gruppenzwerg", "Taschentuch", "Marcele", "Bollinator", "Nebelmaschine", "Der Ranz",
    "Ranz izz Life", "Pocketbike", "Da machste nix!", "1:30 oder 30:1 ?", "Gruppen-mechaniker", "Hoesqvarna?",
    "Sumo ist Life"
]
let itemActiveTemplate = Handlebars.compile(`
        <div class="col s12 m{{width}}">
            <div class="card" onclick="location.hash = '#{{itemName}}'">
                <div class="card-image">
                    <img src="{{{imageLink}}}">
                    <span class="card-title rrSpace" style="text-shadow: 0 0 10px black;">{{displayName}}</span>
                </div>
                <div class="card-content black-text">
                    <p>{{description}}</p>
                </div>
                <div class="card-action">
                    <a href="#sticker" class="green-text text-darken-2">ab {{basePrice}}€/{{baseAmount}}Stk - details</a>
                </div>
            </div>
        </div>
`);

let itemPreActiveTemplate = Handlebars.compile(`
        <div class="col s12 m{{width}}">
            <div class="card">
                <div class="card-image">
                    <img src="{{{imageLink}}}">
                    <span class="card-title rrSpace" style="text-shadow: 0 0 10px black;">{{displayName}}</span>
                </div>
                <div class="card-content black-text">
                    <p>{{description}}</p>
                </div>
                <div class="card-action">
                    <a href="#sticker" class="orange-text text-darken-2">ab {{basePrice}}€/{{baseAmount}}Stk - bald verfügbar</a>
                </div>
            </div>
        </div>
`);

function hashChange() {
    shopHome();
    //shopClosed();
}

function hashChangeCallback() {
    if(window.location.hash) {
        var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
        if (hash === "hoodie") hoodieDetail();
        else if (hash === "shirt") shirtDetail();
        else if (hash === "sticker") stickerDetail();
        else if (hash === "mug") mugDetail();
        else if (hash === "shopping-cart") shoppingCart();
        else if (hash === "buyerInfo") buy();
        else if (hash.startsWith("order")) orderInfo(hash);
        else {
            _paq.push(['setReferrerUrl', currentUrl]);
            currentUrl = '' + window.location.hash;
            _paq.push(['setCustomUrl', currentUrl]);
            _paq.push(['setDocumentTitle', document.title]);

            // remove all previously assigned custom variables, requires Piwik 3.0.2
            _paq.push(['deleteCustomVariables', 'page']);
            _paq.push(['setGenerationTimeMs', 0]);
            _paq.push(['trackPageView']);
        }
    }
}

function updateBreadCrump() {
    if (window.innerWidth <= 350 && $("#breadBuy").is(":visible")) {
        $("#breadCart").html("...");
    } else {
        $("#breadCart").html("Einkaufswagen");
    }
}

function checkAccessCode() {
    let code = $("#accesscode").val();
    Cookies.set("accesscode", md5(code), {expires: 90});
    shopHome();
}

function shopHome() {
    document.title = "Home - RheinhessenRiders Shop";

    $.post("backend/api/accesscodecheck.php",{accesscode: Cookies.get("accesscode")}, (data) => {
        let json = JSON.parse(data);

        $("#backbutton").hide();
        $("#cart-list-bought").html("");
        window.scrollTo(0, 0);
        //updateCartAmount();
        //resetBuy()
        let shopHomeElem = $("#shopHome");
        if (json.success == "true") {
            //if(shopHomeElem.html() != "") {
                $.post("backend/api/item/getItemList.php",null,(d) => {
                    items = JSON.parse(d);
                    widths = [6,6,4,4,4,4,4,4]

                    for(let i=0; i < items.length; i++){
                        items[i].width = widths[i];
                        if(items[i].active == 1) shopHomeElem.append(itemActiveTemplate(items[i]));
                        else if(items[i].active == 2) shopHomeElem.append(itemPreActiveTemplate(items[i]));
                    }

                });
            //}
            shopHomeElem.show();
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


$(document).ready(() => {
    shopHome();
});