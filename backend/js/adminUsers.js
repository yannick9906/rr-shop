function startUsers() {
    //Setup
    $("#listSearchString").html("In Benutzern suchen...");
    $("#listSearchIcon").addClass("mddi-account-search");
    $("#listHeader").html("<th data-field=\"id\" width=\"50px\">ID</th>\n" +
        "<th data-field=\"name\" width=\"40%\">Benutzername</th>\n" +
        "<th data-field=\"email\" width=\"40%\">Email</th>");
    $("#createNewBtnIcon").addClass("mddi-account-plus");
    $("#createNewTitle").html("Benutzer erstellen");
    $("#editTitle").html("Benutzer bearbeiten");
    $("#newFields").html(newFields);
    $("#editFields").html(editFields);
    $("#sort").html(sorts);

    $("#createNewBtn").on('click',newUser);
    $("#createNewSubmitBtn").on('click',submitNewUser);
    $("#createNewCancelBtn").on('click',backToList);
    $("#editSubmitBtn").on('click',submitEditUser);
    $("#editCancelBtn").on('click',backToList);

    //Show
    $("#listPanel").show();
    $("#nav-users").addClass("active");
    $("select").select();

    updatesU = true;
    updateCaller();
    $("#filter").keyup(function () {
        delay(function(){
            searchString = $("#filter").val();
            data = "";
            reqPage = 1;
            updateData();
            updatePages();
        }, 500 );
    });
}

function resetUsers() {
    updatesU = false;
    data = "";
    $("#listSearchIcon").removeClass("mddi-account-search");
    $("#createNewBtnIcon").removeClass("mddi-account-plus");
}

let sortName = "#sort";
let listName = "#listItems"
let linkList = "api/user/getList.php";
let jsonField = "users"
let pagesize = 12;
///////////////////////////////////////////////////////////////////////
// TODO Fill List Template and update() method
let sorts = `
<option value="idAsc">ID aufstg.</option>
<option value="idDesc">ID abstg.</option>
<option value="nameAsc">Name aufstg.</option>
<option value="nameDesc">Name abstg.</option>
`
let listElemTmplt = `
    <tr id="row-{{i}}" style="display: none;" onclick="editUser({{id}})" class="clickable">
        <td>{{id}}</td>
        <td>{{usrname}}</td>
        <td>{{email}}</td>
    </tr>
    `;
let template = Handlebars.compile(listElemTmplt);
let newFields = `
<div class="row">
    <div class="input-field col s6">
        <input id="new-username" type="text" data-length="50">
        <label for="new-username">Benutzername</label>
    </div>
</div>
<div class="row">
    <div class="input-field col s6">
        <input id="new-password" type="password">
        <label for="new-password">Passwort</label>
    </div>
    <div class="input-field col s6">
        <input id="new-email" type="email" data-length="256">
        <label for="new-email">Email</label>
    </div>
</div>
`
let editFields = `
<div class="row">
    <div class="input-field col s6">
        <input id="edit-username" type="text" disabled data-length="50">
        <label for="edit-username">Benutzername</label>
    </div>
</div>
<div class="row">
    <div class="input-field col s6">
        <input id="edit-password" type="password">
        <label for="edit-password">Passwort</label>
    </div>
    <div class="input-field col s6">
        <input id="edit-email" type="email" data-length="256">
        <label for="edit-email">Email</label>
    </div>
</div>
`
///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
let searchString = "";
let currPage = 1;
let reqPage = 1;
let maxPages = 1;
let size = 0;
let sort = "idAsc";
let data = "";
let currEdit = -1;
let updatesU = false;
///////////////////////////////////////////////////////////////////////

function setPage(apage) {
    reqPage = apage;
}

function updatePages() {
    if(currPage > maxPages) reqPage = maxPages;
    if(reqPage == 0) reqPage = 1;

    let nextPage = parseInt(currPage)+1;
    let prevPage = currPage-1;
    let p = $("#pages");
    p.html("");
    p.append("<div id='pagesPre' class='col s1'></div>");
    p.append("<div id='pagesSuf' class='col push-s10 s1'></div>");
    p.append("<div id='pagesNum' class='col pull-s1 s10'></div>");

    if(currPage <= 1) $("#pagesPre").append("<li class=\"disabled\"><a><i class=\"mddi mddi-chevron-left\"></i></a></li>");
    else $("#pagesPre").append("<li class=\"waves-effect\"><a onclick=\"setPage("+prevPage+")\"><i class=\"mddi mddi-chevron-left\"></i></a></li>");

    for(let i = 1; i <= maxPages; i++) {
        if(i != currPage) {
            $("#pagesNum").append("<li class=\"waves-effect\"><a onclick=\"setPage("+i+")\">"+i+"</a></li>");
        } else {
            $("#pagesNum").append("<li class=\"active black\"><a onclick=\"setPage("+i+")\">"+i+"</a></li>");
        }
    }

    if(currPage >= maxPages) $("#pagesSuf").append("<li class=\"disabled\"><a><i class=\"mddi mddi-chevron-right\"></i></a></li>");
    else $("#pagesSuf").append("<li class=\"waves-effect\"><a onclick=\"setPage("+nextPage+")\"><i class=\"mddi mddi-chevron-right\"></i></a></li>");
}

function updateData() {
    //console.log("Update Users");
    let sort = $(sortName).val();
    let postdata = {
        page: reqPage,
        sort: sort,
        search: searchString,
        pagesize: pagesize
    }
    $.getJSON(linkList,postdata, function(json) {
        maxPages = json['maxPage'];
        currPage = json['page'];
        size = json['size'];
        let list = json[jsonField];

        if(JSON.stringify(list) != data) {
            $(listName).html("");
            for(let i = 0; i < list.length; i++) {
                let e = list[i];
                $(listName).append(template({i: i,id: e.uID, usrname: e.username, email: e.email}))
                size = i;
            }
            data = JSON.stringify(list);

            animate(0);
        }
    });
}

function animate(i) {
    if(i <= size) {
        $("#row-"+i).fadeIn(150);
        window.setTimeout("animate("+(i+1)+")", 150);
    }
}

function updateCaller() {
    if(updatesU) {
        updateData();
        updatePages();
        window.setTimeout("updateCaller()", 1000);
    }
}

///////////////////////////////////////
function backToList() {
    $("#editForm").fadeOut(200, function() {
        $("#listContainer").fadeIn(200);
    });
    $("#createNewForm").fadeOut(200);
    currEdit = -1;
}

function newUser() {
    $("#new-username").removeClass("invalid");
    $("#new-username").val("");
    $("#new-realname").val("");
    $("#new-password").val("");
    $("#new-email").val("");
    $("#listContainer").fadeOut(200, function() {
        $("#createNewForm").fadeIn(200);
    });
}

function submitNewUser() {
    data = {
        username: $("#new-username").val(),
        realname: $("#new-realname").val(),
        passhash: md5($("#new-password").val()),
        email: $("#new-email").val()
    };
    $.post("api/user/create.php", data, function(response) {
        let json = JSON.parse(response);
        if(json.success == "1") {
            M.toast({html: "Benutzer erstellt", duration: 2000, classes: "green"});
            backToList();
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

function editUser(id) {
    currEdit = id;
    $.getJSON("api/user/details.php?id="+id,null, function(json) {
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

function submitEditUser() {
    let password = $("#edit-password").val();
    let passhash = "NOUPDATE";
    if(password != "") {
        passhash = md5(password)
    };

    data = {
        realname: $("#edit-realname").val(),
        passhash: passhash,
        email: $("#edit-email").val()
    };

    $.post("api/user/update.php?id="+currEdit, data, function(response) {
        let json = JSON.parse(response);
        if(json.success == "1") {
            M.toast({html: "Benutzer aktualisiert", duration: 2000, classes: "green"});
            backToList();
        } else {
            if(json.error == "missing fields") {
                M.toast({html: "Bitte alle Felder ausfüllen", duration: 2000, classes: "red"});
            }
        }
    });
}
///////////////////////////////////////

var delay = (function(){
    let timer = 0;
    return function(callback, ms){
        clearTimeout (timer);
        timer = setTimeout(callback, ms);
    };
})();