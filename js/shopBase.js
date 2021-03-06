let currentUrl = location.href;
let itemData = [];
let itemActiveTemplate = Handlebars.compile(`
        <div class="col s12 m{{width}}">
            <div class="card" onclick="location.hash = '#{{itemName}}'">
                <div class="card-image">
                    <img src="{{{imageUrl}}}">
                    <span class="card-title rrSpace" style="text-shadow: 0 0 10px black;">{{displayName}}</span>
                </div>
                <div class="card-content black-text">
                    <p>{{{description}}}</p>
                </div>
                <div class="card-action">
                    {{#if otherAmount}}
                    <a href="#{{itemName}}" class="green-text text-darken-2">ab {{basePrice}}€ / {{baseAmount}} Stk - details</a>
                    {{else}}
                    <a href="#{{itemName}}" class="green-text text-darken-2">ab {{basePrice}}€ / Stk - details</a>
                    {{/if}}
                </div>
            </div>
        </div>
`);

let itemPreActiveTemplate = Handlebars.compile(`
        <div class="col s12 m{{width}}">
            <div class="card">
                <div class="card-image">
                    <img src="{{{imageUrl}}}">
                    <span class="card-title rrSpace" style="text-shadow: 0 0 10px black;">{{displayName}}</span>
                </div>
                <div class="card-content black-text">
                    <p>{{{description}}}</p>
                </div>
                <div class="card-action">
                                        {{#if otherAmount}}
                    <a class="orange-text text-darken-2">ab {{basePrice}}€ / {{baseAmount}} Stk - bald verfügbar</a>
                    {{else}}
                    <a class="orange-text text-darken-2">ab {{basePrice}}€ / Stk - bald verfügbar</a>
                    {{/if}}
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
        if (hash.startsWith("rr_")) detail(hash);
        else if (hash === "shopping-cart") shopCart();
        else if (hash === "buyerInfo") checkOut();
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
    $("#shopDetail").hide();
    $("#shopCart").hide();
    $("#buyerInfo").hide();
    $("#buyerConfirm").hide();
    $("#buyerSuccess").hide();
    $("#buyerFail").hide();
    $("#buyerCheck").hide();
    $("#buyerLoading").hide();
    $("#innerBuyerInfo").show();
    document.title = "Home - RheinhessenRiders Shop";
    let shopHomeElem = $("#shopHome");
    shopHomeElem.show();

    $.post("backend/api/accesscodecheck.php",{accesscode: Cookies.get("accesscode")}, (data) => {

        let json = JSON.parse(data);
        $("#backbutton").hide();
        $("#cart-list-bought").html("");
        window.scrollTo(0, 0);
        updateCartAmount();
        //resetBuy()
        if (json.success) {
            if(shopHomeElem.html() == "") {
                $.post("backend/api/item/getItemList.php", null, (d) => {
                    let items = JSON.parse(d);
                    let widths = [6, 6, 4, 4, 4, 4, 4, 4]

                    for (let i = 0; i < items.length; i++) {
                        items[i].width = widths[i];
                        items[i].imageLink = JSON.parse(items[i].imageLink);
                        items[i].imageUrl = items[i].imageLink[0];
                        items[i].otherAmount = parseInt(items[i].baseAmount) != 1;
                        if (items[i].active == 1) shopHomeElem.append(itemActiveTemplate(items[i]));
                        else if (items[i].active == 2) shopHomeElem.append(itemPreActiveTemplate(items[i]));
                        itemData[items[i].itemName] = items[i];
                    }

                    $("#shoppingcartbtn").show();
                    $("#shopCode").hide();
                    hashChangeCallback();
                });
            } else {
                hashChangeCallback();
            }
        } else {
            shopHomeElem.hide();
            $("#shoppingcartbtn").hide();
            $("#shopCode").show();
        }
    });
}


$(document).ready(() => {
    Sentry.init({ dsn: 'https://01590785af3946038a4d8045b6b3dd09@sentry.io/1888097' });
    $("#shopHome").html("");
    window.onhashchange = hashChange;
    shopHome();
    updateBreadCrump();
    M.AutoInit();
});