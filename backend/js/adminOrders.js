function startOrders() {
    //Setup
    $("#listSearchString").html("In Bestellungen suchen...");
    $("#listSearchIcon").addClass("mddi-magnify");
    $("#listHeader").html("<th data-field=\"id\" width=\"50px\">ID</th>\n" +
                        "<th data-field=\"name\" width=\"40%\">Status</th>\n" +
                        "<th data-field=\"name\" width=\"20%\">Bezahlung & Versand</th>\n" +
                        "<th data-field=\"name\" width=\"20%\">Gesamtpreis</th>\n");
    $("#createNewBtnIcon").addClass("mddi-book-plus");
    $("#createNewTitle").html("Bestellung erstellen");
    $("#editTitle").html("Bestellung bearbeiten");
    $("#newFields").html(newFields);
    $("#editFields").html(editFieldsO);
    $("#filter").html(filtersO);

    $("#createNewBtn").hide();

    //Show
    $("#listPanel").show();
    $("#nav-orders").addClass("active");
    $("select").select();

    updatesO = true;
    updateCallerO()
    $("#searchText").keyup(function () {
        delay(function(){
            searchStringO = $("#searchText").val();
            dataO = "";
            reqPageO = 1;
            updateDataO();
            updatePagesO();
        }, 500 );
    });
}

function resetOrders() {
    updatesO = false;
    dataO = "";
    $("#createNewBtnIcon").removeClass("mddi-book-plus");
    $("#listSearchIcon").removeClass("mddi-magnify");
    $("#createNewBtn").show();
}

const paymentType = ["Bar / Karte","Überweisung","PayPal","Lastschrift"];
const shipmentType = ["Mitnahme am nächsten Stammtisch","Selbstabholung", "Versand nach Hause"];
const stateType = {'-1':"<span class='red-text'>Bestellung storniert.</span>", 0:"<span class='grey-text'>Bestellung aufgenommen</span>", 1:"<span class='orange-text'>Bestellung bezahlt</span>", 2:"<span class='yellow-text'>Bestellung bestellt</span>", 3:"<span class='orange-text'>Bestellung wird zusammengeführt</span>", 4:"<span class='green-text'>Bestellung versandt</span>", 5:"<span class='green-text'>Bestellung abholbereit</span>", 6:"<span class='green-text'>Bestellung abgeschlossen</span>"};

let filterNameO = "#filter";
let listNameO = "#listItems"
let linkListO = "api/order/getList.php";
let jsonFieldO = "orders"
let pagesizeO = 12;
///////////////////////////////////////////////////////////////////////
// TODO Fill List Template and update() method
let filtersO = `
<option value="default" selected>Standard</option>
<option value="all">Alle</option>
<option value="new">Neue & Bezahlte</option>
<option value="ordered">Bestellt</option>
<option value="shipping">Versandt</option>
<option value="completed">Abgeschlossen</option>
<option value="storno">Storno</option>
`
let listElemTmpltO = `
    <tr id="row-{{i}}" style="display: none;" onclick="location.hash = 'order-{{orderID}}'" class="clickable">
        <td>{{orderID}}</td>
        <td>{{customerName}} hat am {{timestamp}} bestellt.<br/>Status: {{{state}}}</td>
        <td>{{payment}}<br/>{{shipping}}</td>
        <td>{{totalPrice}} EUR</td>
    </tr>
    `;
let templateO = Handlebars.compile(listElemTmpltO);
let newFieldsO = `
<div class="row">
    <div class="input-field col s6">
        <input id="new-username" type="text">
        <label for="new-username">Benutzername</label>
    </div>
</div>
<div class="row">
    <div class="input-field col s6">
        <input id="new-password" type="password" class="validate">
        <label for="new-password">Passwort</label>
    </div>
    <div class="input-field col s6">
        <input id="new-email" type="email" class="validate">
        <label for="new-email">Email</label>
    </div>
</div>
`
let editFieldsO = `
<div class="row">
    <div class="input-field col s6">
        <input id="edit-username" type="text" disabled>
        <label for="edit-username">Benutzername</label>
    </div>
</div>
<div class="row">
    <div class="input-field col s6">
        <input id="edit-password" type="password" class="validate">
        <label for="edit-password">Passwort</label>
    </div>
    <div class="input-field col s6">
        <input id="edit-email" type="email" class="validate">
        <label for="edit-email">Email</label>
    </div>
</div>
`
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
let searchStringO = "";
let currPageO = 1;
let reqPageO = 1;
let maxPagesO = 1;
let sizeO = 0;
let filterO = "default";
let dataO = "";
let currEditO = -1;
let updatesO = false;
///////////////////////////////////////////////////////////////////////

function setPageO(apage) {
    reqPageO = apage;
}

function updatePagesO() {
    if(currPageO > maxPagesO) reqPageO = maxPagesO;
    if(reqPageO == 0) reqPageO = 1;

    let nextPage = parseInt(currPageO)+1;
    let prevPage = currPageO-1;
    let p = $("#pages");
    p.html("");
    p.append("<div id='pagesPre' class='col s1'></div>");
    p.append("<div id='pagesSuf' class='col push-s10 s1'></div>");
    p.append("<div id='pagesNum' class='col pull-s1 s10'></div>");

    if(currPageO <= 1) $("#pagesPre").append("<li class=\"disabled\"><a><i class=\"mddi mddi-chevron-left\"></i></a></li>");
    else $("#pagesPre").append("<li class=\"waves-effect\"><a onclick=\"setPageO("+prevPage+")\"><i class=\"mddi mddi-chevron-left\"></i></a></li>");

    for(let i = 1; i <= maxPagesO; i++) {
        if(i != currPageO) {
            $("#pagesNum").append("<li class=\"waves-effect\"><a onclick=\"setPageO("+i+")\">"+i+"</a></li>");
        } else {
            $("#pagesNum").append("<li class=\"active black\"><a onclick=\"setPageO("+i+")\">"+i+"</a></li>");
        }
    }

    if(currPageO >= maxPagesO) $("#pagesSuf").append("<li class=\"disabled\"><a><i class=\"mddi mddi-chevron-right\"></i></a></li>");
    else $("#pagesSuf").append("<li class=\"waves-effect\"><a onclick=\"setPageO("+nextPage+")\"><i class=\"mddi mddi-chevron-right\"></i></a></li>");
}

function updateDataO() {
    let filter = $(filterNameO).val();
    let postdata = {
        page: reqPageO,
        filter: filter,
        search: searchStringO,
        pagesize: pagesizeO
    }
    $.getJSON(linkListO,postdata, function(json) {
        maxPagesO = json['maxPage'];
        currPageO = json['page'];
        sizeO = json['size'];
        let list = json[jsonFieldO];

        if(JSON.stringify(list) != dataO) {
            $(listNameO).html("");
            for(let i = 0; i < list.length; i++) {
                let e = list[i];
                $(listNameO).append(templateO({i: i,kw: e.estDate, orderID: e.orderID, customerName: e.customer.firstname+" "+e.customer.lastname, payment: paymentType[e.payment], shipping: shipmentType[e.shipping], totalPrice: e.totalPrice, state: stateType[e.state], timestamp: e.timestamp}))
                sizeO = i;
            }
            dataO = JSON.stringify(list);

            animateO(0);
        }
    });
    if(JSON.parse(Cookies.get("orderingList")).length > 0) $('#orderingListButton').show();
}

function animateO(i) {
    if(i <= sizeO) {
        $("#row-"+i).fadeIn(100);
        window.setTimeout("animateO("+(i+1)+")", 100);
    }
}

function updateCallerO() {
    if(updatesO) {
        updateDataO();
        updatePagesO();
        window.setTimeout("updateCallerO()", 1000);
    }
}

///////////////////////////////////////