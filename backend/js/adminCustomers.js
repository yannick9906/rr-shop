function startCustomers() {
    //Setup
    $("#listSearchString").html("In Kunden suchen...");
    $("#listSearchIcon").addClass("mddi-magnify");
    $("#listHeader").html("<th data-field=\"id\" width=\"50px\">ID</th>\n" +
                        "<th data-field=\"name\" width=\"30%\">Name</th>\n" +
                        "<th data-field=\"name\" width=\"30%\">Email</th>\n" +
                        "<th data-field=\"name\" width=\"30%\">Adresse</th>\n");
    $("#createNewBtnIcon").addClass("mddi-account-plus");
    $("#createNewTitle").html("Kunde erstellen");
    $("#editTitle").html("Kunde bearbeiten");
    $("#editFields").html(editFieldsC);
    $("#sort").html(sortsC);

    $("#createNewBtn").hide();
    $("#createNewCancelBtn").on('click',backToListC);
    $("#editSubmitBtn").on('click',submitEditCustomer);
    $("#editCancelBtn").on('click',backToListC);

    //Show
    $("#listPanel").show();
    $("#nav-customers").addClass("active");
    $('input').characterCounter();
    $("select").select();

    updatesC = true;
    updateCallerC()
    $("#filter").keyup(function () {
        delay(function(){
            searchStringC = $("#filter").val();
            dataC = "";
            reqPageC = 1;
            updateDataC();
            updatePagesC();
        }, 500 );
    });
}

function resetCustomers() {
    updatesC = false;
    dataC = "";
    $("#createNewBtnIcon").removeClass("mddi-account-plus");
    $("#listSearchIcon").removeClass("mddi-magnify");
    $("#createNewBtn").show();
}

let sortNameC = "#sort";
let listNameC = "#listItems"
let linkListC = "api/customer/getList.php";
let jsonFieldC = "customers"
let pagesizeC = 12;
///////////////////////////////////////////////////////////////////////
// TODO Fill List Template and update() method
let sortsC = `
<option value="idAsc">ID aufstg.</option>
<option value="idDesc">ID abstg.</option>
<option value="nameAsc">Name aufstg.</option>
<option value="nameDesc">Name abstg.</option>
`
let listElemTmpltC = `
    <tr id="row-{{i}}" style="display: none;" onclick="editCustomer({{cID}})" class="clickable">
        <td>{{cID}}</td>
        <td>{{firstname}} {{lastname}}</td>
        <td>{{email}}</td>
        <td>{{addressStreet}}<br/>{{addressZip}} {{addressCity}}</td>
    </tr>
    `;
let templateC = Handlebars.compile(listElemTmpltC);
let editFieldsC = `
<div class="row">
    <div class="input-field col s12 l4">
        <input id="edit-firstname" type="text" data-length="128">
        <label for="edit-firstname">Vorname</label>
    </div>
    <div class="input-field col s12 l4">
        <input id="edit-lastname" type="text" data-length="128">
        <label for="edit-lastname">Nachname</label>
    </div>
    <div class="input-field col s12 l4">
        <input id="edit-email" type="email" data-length="256">
        <label for="edit-email">E-Mail-Adresse</label>
    </div>
</div>
<div class="row">
    <div class="input-field col s12">
        <input id="edit-addressStreet" type="text" data-length="256">
        <label for="edit-addressStreet">Straße Hausnummer</label>
    </div>
    <div class="input-field col s4">
        <input id="edit-addressZip" type="text" data-length="5">
        <label for="edit-addressZip">PLZ</label>
    </div>
    <div class="input-field col s8">
        <input id="edit-addressCity" type="text" data-length="128">
        <label for="edit-addressCity">Stadt</label>
    </div>
</div>
`
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
let searchStringC = "";
let currPageC = 1;
let reqPageC = 1;
let maxPagesC = 1;
let sizeC = 0;
let sortC = "idAsc";
let dataC = "";
let currEditC = -1;
let updatesC = false;
///////////////////////////////////////////////////////////////////////

function setPageC(apage) {
    reqPageC = apage;
}

function updatePagesC() {
    if(currPageC > maxPagesC) reqPageC = maxPagesC;
    if(reqPageC == 0) reqPageC = 1;

    let nextPage = parseInt(currPageC)+1;
    let prevPage = currPageC-1;
    let p = $("#pages");
    p.html("");
    p.append("<div id='pagesPre' class='col s1'></div>");
    p.append("<div id='pagesSuf' class='col push-s10 s1'></div>");
    p.append("<div id='pagesNum' class='col pull-s1 s10'></div>");

    if(currPageC <= 1) $("#pagesPre").append("<li class=\"disabled\"><a><i class=\"mddi mddi-chevron-left\"></i></a></li>");
    else $("#pagesPre").append("<li class=\"waves-effect\"><a onclick=\"setPageC("+prevPage+")\"><i class=\"mddi mddi-chevron-left\"></i></a></li>");

    for(let i = 1; i <= maxPagesC; i++) {
        if(i != currPageC) {
            $("#pagesNum").append("<li class=\"waves-effect\"><a onclick=\"setPageC("+i+")\">"+i+"</a></li>");
        } else {
            $("#pagesNum").append("<li class=\"active black\"><a onclick=\"setPageC("+i+")\">"+i+"</a></li>");
        }
    }

    if(currPageC >= maxPagesC) $("#pagesSuf").append("<li class=\"disabled\"><a><i class=\"mddi mddi-chevron-right\"></i></a></li>");
    else $("#pagesSuf").append("<li class=\"waves-effect\"><a onclick=\"setPageC("+nextPage+")\"><i class=\"mddi mddi-chevron-right\"></i></a></li>");
}

function updateDataC() {
    //console.log("Update Customers");
    let sort = $(sortNameC).val();
    let postdata = {
        page: reqPageC,
        sort: sort,
        search: searchStringC,
        pagesize: pagesizeC
    }
    $.getJSON(linkListC,postdata, function(json) {
        maxPagesC = json['maxPage'];
        currPageC = json['page'];
        sizeC = json['size'];
        let list = json[jsonFieldC];

        if(JSON.stringify(list) != dataC) {
            $(listNameC).html("");
            for(let i = 0; i < list.length; i++) {
                let e = list[i];
                $(listNameC).append(templateC({i: i, cID: e.customerID, firstname: e.firstname, lastname: e.lastname, email: e.email, addressStreet: e. addressStreet, addressZip: e.addressZip, addressCity: e.addressCity}))
                sizeC = i;
            }
            dataC = JSON.stringify(list);

            animateC(0);
        }
    });
}

function animateC(i) {
    if(i <= sizeC) {
        $("#row-"+i).fadeIn(150);
        window.setTimeout("animateC("+(i+1)+")", 150);
    }
}

function updateCallerC() {
    if(updatesC) {
        updateDataC();
        updatePagesC();
        window.setTimeout("updateCallerC()", 1000);
    }
}

///////////////////////////////////////
function backToListC() {
    $("#editForm").fadeOut(200, function() {
        $("#listContainer").fadeIn(200);
    });
    $("#createNewForm").fadeOut(200);
    currEditC = -1;
}

function editCustomer(id) {
    currEditC = id;
    $.getJSON("api/customer/details.php?id="+id,null, (json) => {
        $("#edit-firstname").val(json.firstname);
        $("#edit-lastname").val(json.lastname);
        $("#edit-email").val(json.email);
        $("#edit-addressCity").val(json.addressCity);
        $("#edit-addressStreet").val(json.addressStreet);
        $("#edit-addressZip").val(json.addressZip);
        M.updateTextFields();
        $("#listContainer").fadeOut(200, function() {
            $("#editForm").fadeIn(200);
        });
    })
}

function submitEditCustomer() {
    data = {
        id: currEditC,
        firstname: $("#edit-firstname").val(),
        lastname: $("#edit-lastname").val(),
        email: $("#edit-email").val(),
        addressStreet: $("#edit-addressStreet").val(),
        addressZip: $("#edit-addressZip").val(),
        addressCity: $("#edit-addressCity").val()
    };

    $.post("api/customer/update.php", data, function(response) {
        let json = JSON.parse(response);
        if(json.success) {
            M.toast({html: "Kunde aktualisiert", duration: 2000, classes: "green"});
            backToListC();
        } else {
            M.toast({html: "Fehler: "+json.error, duration: 2000, classes: "red"});
        }
    });
}