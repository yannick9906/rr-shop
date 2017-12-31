function startOrders() {
    //Setup
    $("#listSearchString").html("In Bestellungen suchen...");
    $("#listSearchIcon").addClass("mddi-magnify");
    $("#listHeader").html("<th dataO-field=\"id\" width=\"50px\">ID</th>\n" +
                        "<th dataO-field=\"name\" width=\"40%\">Status</th>\n" +
                        "<th dataO-field=\"name\" width=\"20%\">Bezahlmethode</th>\n" +
                        "<th dataO-field=\"name\" width=\"20%\">Bedruckung</th>\n");
    $("#createNewBtnIcon").addClass("mddi-book-plus");
    $("#createNewTitle").html("Bestellung erstellen");
    $("#editTitle").html("Bestellung bearbeiten");
    $("#newFields").html(newFields);
    $("#editFields").html(editFieldsO);
    $("#sort").html(sortsO);

    $("#createNewBtn").on('click',newOrderO);
    $("#createNewSubmitBtn").on('click',submitNewOrder);
    $("#createNewCancelBtn").on('click',backToListO);
    $("#editSubmitBtn").on('click',submitEditOrder);
    $("#editCancelBtn").on('click',backToListO);

    //Show
    $("#listPanel").show();
    $("#nav-orders").addClass("active");
    $("select").select();

    updatesO = true;
    updateCallerO()
    $("#filter").keyup(function () {
        delay(function(){
            searchStringO = $("#filter").val();
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
}

const paymentType = ["Bar","Überweisung","PayPal","Lastschrift"];
const shipmentType = ["Mainz-Lerchenberg (Yannick Félix)","Friesenheim (Philipp Lommel)", "Lieferung"];
const stateType = ["<span class='grey-text'>Bestellung aufgenommen</span>", "<span class='green-text'>Bestellung bezahlt</span>", "<span class='green-text'>Bestellung abholbereit</span>"]

let sortNameO = "#sort";
let listNameO = "#listItems"
let linkListO = "api/order/getList.php";
let jsonFieldO = "orders"
let pagesizeO = 12;
///////////////////////////////////////////////////////////////////////
// TODO Fill List Template and update() method
let sortsO = `
<option value="idAsc">ID aufstg.</option>
<option value="idDesc">ID abstg.</option>
<option value="timeAsc">Datum aufstg.</option>
<option value="timeDesc">Datum abstg.</option>
`
let listElemTmpltO = `
    <tr id="row-{{i}}" style="display: none;" onclick="editOrder({{orderID}})" class="clickable">
        <td>{{orderID}}</td>
        <td>{{customerName}} hat am {{timestamp}} bestellt.<br/>Status: {{{state}}}</td>
        <td>{{payment}}</td>
        <td>in KW{{kw}}</td>
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
let sortO = "idAsc";
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
    console.log("Update Orders");
    let sort = $(sortNameO).val();
    let postdata = {
        page: reqPageO,
        sort: sort,
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
                $(listNameO).append(templateO({i: i,kw: e.estDate, orderID: e.orderID, customerName: e.customer.firstname+" "+e.customer.lastname, payment: paymentType[e.payment], state: stateType[e.state], timestamp: e.timestamp}))
                sizeO = i;
            }
            dataO = JSON.stringify(list);

            animateO(0);
        }
    });
}

function animateO(i) {
    if(i <= sizeO) {
        $("#row-"+i).fadeIn(150);
        window.setTimeout("animateO("+(i+1)+")", 150);
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
function backToListO() {
    $("#editForm").fadeOut(200, function() {
        $("#listContainer").fadeIn(200);
    });
    $("#createNewForm").fadeOut(200);
    currEditO = -1;
}

function newOrderO() {
    $("#new-username").removeClass("invalid");
    $("#new-username").val("");
    $("#new-realname").val("");
    $("#new-password").val("");
    $("#new-email").val("");
    $("#listContainer").fadeOut(200, function() {
        $("#createNewForm").fadeIn(200);
    });
}

function submitNewOrder() {
    dataO = {
        username: $("#new-username").val(),
        realname: $("#new-realname").val(),
        passhash: md5($("#new-password").val()),
        email: $("#new-email").val()
    };
    $.post("api/order/create.php", dataO, function(response) {
        let json = JSON.parse(response);
        if(json.success == "1") {
            M.toast({html: "Benutzer erstellt", duration: 2000, classes: "green"});
            backToListO();
        } else {
            if(json.error == "missing fields") {
                M.toast({html: "Bitte alle Felder ausfüllen", duration: 2000, classes: "red"});
            } else if(json.error == "username exists") {
                M.toast({html: "Der Benutzername existiert bereits", duration: 2000, classes: "red"});
                $("#new-username").addClass("invalid");
            }
        }
    });
}

function editOrder(id) {
    currEditO = id;
    $.getJSON("api/order/details.php?id="+id,null, function(json) {
        $("#edit-username").val(json.username);
        $("#edit-realname").val(json.realname);
        $("#edit-password").val("");
        $("#edit-email").val(json.email);
        M.updateTextFields();
        $("#listContainer").fadeOut(200, function() {
            $("#editForm").fadeIn(200);
        });
    })
}

function submitEditOrder() {
    let password = $("#edit-password").val();
    let passhash = "NOUPDATE";
    if(password != "") {
        passhash = md5(password)
    };

    dataO = {
        realname: $("#edit-realname").val(),
        passhash: passhash,
        email: $("#edit-email").val()
    };

    $.post("api/order/update.php?id="+currEditO, dataO, function(response) {
        let json = JSON.parse(response);
        if(json.success == "1") {
            M.toast({html: "Benutzer aktualisiert", duration: 2000, classes: "green"});
            backToListO();
        } else {
            if(json.error == "missing fields") {
                M.toast({html: "Bitte alle Felder ausfüllen", duration: 2000, classes: "red"});
            }
        }
    });
}